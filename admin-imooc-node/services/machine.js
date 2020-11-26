const {querySql, exists, insert, getInfoForId, update, deleted, andLike,SqlCompose} = require('../db');
const Machine = require('../model/Machine');

//获取单位列表
async function GetList(query) {
  const {MACHINENO, SSDW, SBFZR, sort, page, pageSize} = query;
  const offset = (page - 1) * pageSize;
  let sql = `select ID,MACHINENO,SSDW,SSDW_name,MAKECARD_ID,MakeCard_Com_Name,SBFZR,DISABLED,CREATE_BY,CREATE_ON,UPDATE_BY,UPDATE_ON from V_machine`;
  let where = `where`;
  MACHINENO && (where = andLike(where, `MACHINENO`, MACHINENO));
  SSDW && (where = andLike(where, `SSDW`, SSDW));
  SBFZR && (where = andLike(where, `SBFZR`, SBFZR));
  if (where !== 'where') {
    sql = `${sql} ${where}`;
  }

  if (sort) {
    const symbol = sort[0];
    const column = sort.slice(1, sort.length);
    const order = symbol === '+' ? 'asc' : 'desc';
    sql = `${sql} order by ${column} ${order}`
  }

  sql = SqlCompose(sql,offset,pageSize,page);
  let countSql = `select count(*) as COUNT from V_machine`;
  if (where !== 'where') {
    countSql = `${countSql} ${where}`;
  }
  //console.log(sql);
  const list = await querySql(sql);
  const count = await querySql(countSql);
  return {list, count: count[0].COUNT, page, pageSize};
}

//根据用户id查询用户信息
function GetInfo(id) {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        const result = await getInfoForId(id, '*', 'B_machine');
        console.log("根据id返回值")
        console.log(result);
        if(result.MAKECARD_ID && result.MAKECARD_ID.toString().indexOf(",") != -1 ){
          console.log("makeID");
          console.log(result.MAKECARD_IDk);
          result.MAKECARD_ID = result.MAKECARD_ID.split(',');
        }
        resolve(result);
      } else {
        reject(new Error('查询条件id为空'))
      }
    } catch (e) {
      reject(e);
    }
  });
}

//检测设备编号是否已存在
function exist(machineNo) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await exists('B_machine', 'MACHINENO', machineNo);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  })
}

//新增用户
function Add(machine) {
  return new Promise(async (resolve, reject) => {
    try {
      if (machine instanceof Machine) {
        console.log("开始新增设备了")
        await insert(machine, 'B_machine');
        resolve();
      } else {
        reject(new Error('添加的设备不合法'))
      }
    } catch (e) {
      reject(e);
    }
  })
}

//修改用户信息
function Update(machine) {
  return new Promise(async (resolve, reject) => {
    try {
      await update(machine, 'B_machine');
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}

//删除用户
function Deleted(condition) {
  return new Promise(async (resolve, reject) => {
    try {
      await deleted(condition, 'B_machine');
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}


module.exports = {
  GetList,
  GetInfo,
  exist,
  Add,
  Update,
  Deleted
};
