const moment = require('moment');
const QueryRecord = require('../model/QueryRecord');
const CRJJL = require('../model/CRJJL');
const {querySql, getInfoForId, insert, and, andLike, andGreaterThan, andLessThan,SqlCompose} = require('../db');
const{database} = require('../db/datatype')
//获取查询机查询记录列表
async function GetList(query, username) {
  const {machineNo, XM, SFZH, sort, page, pageSize} = query;
  let {startDate,endDate} = query;
  if(startDate && startDate !== ''){
    startDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
  }
  if(endDate && endDate !== ''){
    endDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
  }
  console.log(endDate);
  let sql = `select ID,MACHINENO,XM,SFZH,XB,AGE,QUERYDATE from b_query_record`;
  let where = `where`;
  SFZH && (where = andLike(where, `SFZH`, SFZH));
  XM && (where = andLike(where, `XM`, XM));
  machineNo && (where = andLike(where, `machineNo`, machineNo));
  startDate && (where = andGreaterThan(where,`queryDate`,startDate));
  endDate && (where = andLessThan(where,`queryDate`,endDate));
  if (where !== 'where') {
    sql = `${sql} ${where}`;
  }

  const offset = (page - 1) * pageSize;
  if (sort) {
    const symbol = sort[0];
    const column = sort.slice(1, sort.length);
    const order = symbol === '+' ? 'asc' : 'desc';
    //mysql
    //sql = `${sql} order by \`${column}\` ${order}`
    //oracle
    sql = `${sql} order by \'${column}\' ${order}`
  }
  //oracle
  //sql = `select * from (${sql}) where rownum>${offset} and rownum <=${pageSize}`;
  //mysql
  //sql = `${sql} limit ${pageSize} offset ${offset}`;
  sql = SqlCompose(sql,offset,pageSize,page);
  let countSql = `select count(*) as COUNT from b_query_record`;
  if (where !== 'where') {
    countSql = `${countSql} ${where}`;
  }
  //console.log(sql);
  const count = await querySql(countSql);
  const list = await querySql(sql);
  list.forEach(record => {
    record.QUERYDATE = moment(record.QUERYDATE).format('YYYY-MM-DD HH:mm:ss');
  });
  return {list, count: count[0].COUNT, page, pageSize};
}


//获取查询机查询记录统计列表
async function GetGroupList(query, username) {
  const {machineNo,sort, page, pageSize} = query;
  let {startDate,endDate} = query;
  if(startDate && startDate !== ''){
    startDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
  }
  if(endDate && endDate !== ''){
    endDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
  }
  console.log(endDate);
  let sql = `SELECT MACHINENO,count(*) as COUNT FROM b_query_record`;
  let where = `where`;
  machineNo && (where = andLike(where, `machineNo`, machineNo));
  startDate && (where = andGreaterThan(where,`queryDate`,startDate));
  endDate && (where = andLessThan(where,`queryDate`,endDate));
  if (where !== 'where') {
    sql = `${sql} ${where}`;
  }
  const offset = (page - 1) * pageSize;
  if (sort) {
    const symbol = sort[0];
    const column = sort.slice(1, sort.length);
    const order = symbol === '+' ? 'asc' : 'desc';
    sql = `${sql} GROUP BY MachineNo order by \'${column}\' ${order}`
  }
  let sqlcount = sql;
  //mysql
  // sql = `${sql} limit ${pageSize} offset ${offset}`;
  //oracle
  //sql = `select * from (${sql}) where rownum>${offset} and rownum <=${pageSize}`;
  sql = SqlCompose(sql,offset,pageSize,page);
  let countSql;
  if(database()==='oracle'){
    countSql= `SELECT count(*) as COUNT FROM (${sqlcount})`;
  }
  if(database()==='mysql'){
    countSql= `SELECT count(*) as COUNT FROM (${sqlcount}) as b_query_record2`;
  }
  //console.log(sql);
  const count = await querySql(countSql);
  console.log("count",count)
  const list = await querySql(sql);
  list.forEach(record => {
    record.queryDate = moment(record.queryDate).format('YYYY-MM-DD HH:mm:ss');
  });
  return {list, count: count[0].COUNT, page, pageSize};
}


//获取查询记录的出入境记录列表
async function GetCRJJLList(id,listQuery) {
  const {sort, page, pageSize} = listQuery;
  let sql = `select id as CRJJLID,CRJBS,ZJMC,ZJHM,CRJSJ,CRJKA from b_CRJJL`;
  let where = 'where';
  id && (where = and(where, `queryRecordId`, id));
  if (where !== 'where') {
    sql = `${sql} ${where}`;
  }
  const offset = (page - 1) * pageSize;
  if (sort) {
    const symbol = sort[0];
    const column = sort.slice(1, sort.length);
    const order = symbol === '+' ? 'asc' : 'desc';
    sql = `${sql} order by \'${column}\' ${order}`
  }
  sql = SqlCompose(sql,offset,pageSize,page);
  let countSql = `select count(*) as COUNT from b_CRJJL`;
  if (where !== 'where') {
    console.log("where",where)
    countSql = `${countSql} ${where}`;
  }
  //console.log(sql);
  const count = await querySql(countSql);
  const list = await querySql(sql);

  list.forEach(record => {
    record.CRJSJ = moment(record.CRJSJ).format('YYYY-MM-DD HH:mm:ss');
  });
  return {list, count: count[0].COUNT, page, pageSize};
}
//根据id查询机查询记录详情
function GetInfo(params) {
  return new Promise(async (resolve, reject) => {
    try {

      if (params.id) {
        const result = await getInfoForId(params.id, '*', 'b_query_record');
        const CRJRecordData = await GetCRJJLList(params.id,params.listQuery);
        result.queryDate = moment(result.queryDate).format('YYYY-MM-DD HH:mm:ss');
        const res = {
          info:result,
          CRJRecordData:CRJRecordData
        };
        resolve(res);
      } else {
        reject(new Error('查询条件id为空'))
      }
    } catch (e) {
      reject(e);
    }
  });
}

//新增查询机查询记录
function Add(queryRecord) {
  return new Promise(async (resolve, reject) => {
    try {
      if (queryRecord instanceof QueryRecord) {
        let result = await insert(queryRecord, 'b_query_record');
        resolve(result);
      } else {
        reject(new Error('添加的查询机查询记录不合法'))
      }
    } catch (e) {
      reject(e);
    }
  })
}
//上传出入境记录
function addCRJJL(id,CRJRecordData) {
  return new Promise(async (resolve, reject) => {
    try {
      CRJRecordData.forEach(async rec => {
        rec.queryRecordId = id;
        const record = new CRJJL(rec);
        if (record instanceof CRJJL) {
          await insert(record, 'b_CRJJL');
        }
        else {
          reject(new Error('添加的出入境记录不合法'))
        }
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}

//修改查询机查询记录
function Update(id, field, fieldValue) {
  return new Promise(async (resolve, reject) => {
    try {
      await querySql(`UPDATE \`b_query_record\` SET \`${field}\`='${fieldValue}' where id=${id}`);
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  GetList,
  GetCRJJLList,
  GetInfo,
  Add,
  addCRJJL,
  Update,
  GetGroupList
};
