const {debug} = require('../utils/constant');
const {isObject} = require('../utils/index');
const {query,oracleinsert}=require('./oracle');
const {database} = require('./datatype')
const {connect}=require('../db/mysql');

function querySql(sql) {
  debug && console.log(sql);
  return new Promise((resolve, reject) => {
    if(database()==='oracle'){
      try {
        query(sql).then(results => {
          if (results) {
            console.log(results);
            resolve(results);       
          }
        });
        }
      catch (e) {
        reject(e);
      }finally {
        console.log("oraclefinally")
      }
    }
    if(database()==='mysql'){
      const conn = connect();
      try {
        conn.query(sql, (err, results) => {
          if (err) {
            debug && console.log('查询失败，原因：' + JSON.stringify(err));
            reject(err);
          } else {
            debug && console.log('查询成功')
            resolve(results);
          }
        });
      } catch (e) {
        reject(e);
      } finally {
        conn.end();
      }
    }
    if(database()===''){
      reject("数据库类型不得为空");
    }
  })
}

//检测属性是否已存在
function exists(tableName, field, fieldValue) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `select ${field} from ${tableName} where ${field} ='${fieldValue}'`;
      //console.log('existsSql:' + sql);
      querySql(sql).then(results => {
        let isExists = false;
        if (results && results.length > 0) {
          isExists = true
        }
        resolve({isExists});
      });
    } catch (e) {
      reject(e);
    }
  })
}

//查单条
function queryOne(sql) {
  return new Promise((resolve, reject) => {
    try {
      querySql(sql).then(results => {
        if (results && results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      });
    } catch (e) {
      reject(e);
    }
  })
}

//新增操做
function insert(model, tableName) {
  return new Promise((resolve, reject) => {
    if (!isObject(model)) {
      reject(new Error('插入数据库失败，插入数据非对象'));
    } else {
      console.log("插入数据")
      const keys = [];
      const values = [];
      if(database()==='oracle'){
        keys.push('ID');
        values.push(`${tableName}_SEQUENCE.nextval`)
      }
      Object.keys(model).forEach(key => {
        if (model.hasOwnProperty(key)) {
          if (model[key] && model[key] !== '') {
            keys.push(`${key}`);
            values.push(`'${model[key]}'`)
          }
        }
      });
      if (keys.length > 0 && values.length > 0) {
        let sql = `INSERT INTO ${tableName} (`;
        const keysString = keys.join(',');
        const valuesString = values.join(',');
        sql = `${sql}${keysString}) VALUES (${valuesString})`;
        console.log("插入语句",sql);
        if(database()==='oracle'){
          try {
            oracleinsert(sql).then(results => {
              if (results) {
                console.log(results);
                resolve(results);       
              }
            });
          } catch (e) {
            reject(e);
          } finally {
            // conn.end();
          }
        }
        if(database()==='mysql'){
          const conn = connect();
          try {
            conn.query(sql, (err, result) => {
              if (err) {
                debug && console.log('添加失败，原因：' + JSON.stringify(err));
                conn.rollback(function(){
                  console.log("事务失败，" + sql + "，ERROR：" + err);
                })
                reject(err);
              } else {
                console.log("更新返回值")
                console.log(result)
                debug && console.log('添加成功' + JSON.stringify(result));
                resolve(result);
              }
            });
          } catch (e) {
            conn.rollback(function(){
              console.log("事务失败，" + sql + "，ERROR：" + err);
            })
            reject(e);
          } finally {
            conn.end();
          }
        }
      } else {
        reject(new Error('插入数据库失败，对象中无任何属性'))
      }
    }
  })
}

//更新操作
function update(model, tableName) {
  return new Promise((resolve, reject) => {
    if (!isObject(model)) {
      reject(new Error('更新数据库失败，插入数据非对象'));
    } else {
      let where = '';
      let entry = [];
      Object.keys(model).forEach(key => {
        console.log(key);
        console.log(model);
        console.log('key  model');
        if (key !== 'ID' && key !== 'id') {
          if(model[key]!==null){
            entry.push(`${key} ='${model[key]}'`);
          }
        } 
        else {
          where = ` where id=${model[key]}`;
        }
      });
      if (entry.length > 0) {
        let sql = `UPDATE ${tableName} SET`;
        sql = `${sql} ${entry.join(',')} ${where}`;
        console.log('model', model);
        debug && console.log('updateUser', sql);
        if(database()==='oracle'){
          try {
            oracleinsert(sql).then(results => {
              if (results) {
                console.log(results);
                resolve(results);       
              }
            });
          }catch (e) {
            reject(e);
          } finally {
          }
        }
        if(database()==='mysql'){
          const conn = connect();
          try {
            conn.query(sql, (err, result) => {
              if (err) {
                debug && console.log('更新失败，原因：' + JSON.stringify(err));
                reject(err);
              } else {
                debug && console.log('更新成功' + JSON.stringify(result));
                resolve(result);
              }
            });
          } catch (e) {
            reject(e);
          } finally {
            conn.end();
          }
        }
      }
    }
  })
}

//根据ID删除数据操作
function deleted(condition, tableName) {
  return new Promise((resolve, reject) => {
    if (condition.length > 0 && tableName) {
      let sql = `DELETE FROM ${tableName} where id in (`;
      const valuesString = condition.join(',');
      sql = `${sql}${valuesString})`;
      debug && console.log(sql);
      if(database()==='oracle'){
        try {  
          oracleinsert(sql).then(results => {
            if (results) {
              console.log(results);
              resolve(results);       
            }
          });
        } catch (e) {
          reject(e);
        } finally{
        }
      }
      if(database()==='mysql'){
        const conn = connect();
        try {
          conn.query(sql, (err, result) => {
            if (err) {
              debug && console.log('更新失败，原因：' + JSON.stringify(err));
              reject(err);
            } else {
              debug && console.log('更新成功' + JSON.stringify(result));
              resolve(result);
            }
          });
        } catch (e) {
          reject(e);
        } finally {
          conn.end();
        }
      }
    } else {
      reject(new Error('删除数据失败，无有效参数'));
    }
  })
}

//根据id获取信息
function getInfoForId(id, column, tableName) {
  return new Promise((resolve, reject) => {
    let sql = `select ${column} from ${tableName} where id='${id}'`;
    console.log(sql);
    try {
      querySql(sql).then(results => {
        if (results && results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      });
    } catch (e) {
      reject(e);
    }
  })
}

function and(where, k, v) {
  if (where === 'where') {
    return `${where} ${k} ='${v}'`
  } else {
    return `${where} and ${k} ='${v}'`
  }
}

function andLike(where, k, v) {
  if (where === 'where') {
    return `${where} ${k} like '%${v}%'`
  } else {
    return `${where} and ${k} like '%${v}%'`
  }
}

function andGreaterThan(where, k, v) {
  if (where === 'where') {
    if(database()==='oracle'){
      return `${where} (${k}) >= to_date('${v}','yyyy-MM-dd HH24:MI:SS')`
    }
    if(database()==='mysql'){
      return `${where} timestamp(${k}) >= '${v}'`
    }
  } else {
    if(database()==='oracle'){
      return `${where} and (${k}) >= to_date('${v}','yyyy-MM-dd HH24:MI:SS')`
    }
    if(database()==='mysql'){
      return `${where} and timestamp(${k}) >= '${v}'`
    }
  }
}

function andLessThan(where, k, v) {
  if (where === 'where') {
    if(database()==='oracle'){
      return `${where} (${k}) <= to_date('${v}','yyyy-MM-dd HH24:MI:SS')`
    }
    if(database()==='mysql'){
      return `${where} timestamp(${k}) <= '${v}'`
    }
  } else {
    if(database()==='oracle'){
      return `${where} and (${k}) <= to_date('${v}','yyyy-MM-dd HH24:MI:SS')`
    }
    if(database()==='mysql'){
      return `${where} and timestamp(${k}) <= '${v}'`
    }
  }
}

function SqlCompose(sql,offset,pageSize,page){
  if(database()==='oracle'){
    let bignumber = page * pageSize;
    sql = `select a.* from (select rownum r,t.* from (${sql}) t) a where a.r between ${offset} and ${bignumber}`;
    return sql;
  }
  if(database()==='mysql'){
    sql = sql = `${sql} limit ${pageSize} offset ${offset}`;
    return sql
  }
}
module.exports = {
  querySql,
  queryOne,
  exists,
  insert,
  update,
  deleted,
  getInfoForId,
  and,
  andLike,
  andGreaterThan,
  andLessThan,
  SqlCompose
};
