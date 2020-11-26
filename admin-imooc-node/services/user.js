const {querySql, getInfoForId, queryOne, insert,exists, update, deleted, and, andLike,SqlCompose} = require('../db');
const User = require('../model/User');

//登录
function login(username, password) {
  return querySql(`select * from V_Users where DISABLED = 0 and USER_ID='${username}' and USER_PASSWD='${password}'`);
}


//获取用户列表
async function GetList(query, username) {
  const {USER_ID, COMPANY_ID, ROLES_ID, sort, page, pageSize} = query;
  const userSql = `select ROLES_ID from fw_s_users where USER_ID = '${username}'`;
  const result = await querySql(userSql);
  const offset = (page - 1) * pageSize;
  let sql = `select * from V_Users`;
  let where = `where ROLES_ID >= ${result[0].ROLES_ID}`;
  USER_ID && (where = andLike(where, `USER_ID`, USER_ID));
  COMPANY_ID && (where = and(where, `COMPANY_ID`, COMPANY_ID));
  ROLES_ID && (where = and(where, `ROLES_ID`, ROLES_ID));
  sql = `${sql} ${where}`;
  if (sort) {
    const symbol = sort[0];
    const column = sort.slice(1, sort.length);
    const order = symbol === '+' ? 'asc' : 'desc';
    sql = `${sql} order by ${column} ${order}`
  }
  sql = SqlCompose(sql,offset,pageSize,page);
  let countSql = `select count(*) as COUNT from V_Users ${where}`;

  const list = await querySql(sql);
  const count = await querySql(countSql);
  return {list, count: count[0].COUNT, page, pageSize};
}

async function GetSelectList(username){
  const userSql = `select ROLES_ID from fw_s_users where USER_ID = '${username}'`;
  const roleResult = await querySql(userSql);
  const sql = `select USER_ID from fw_s_users where DISABLED = 0 and ROLES_ID >= ${roleResult[0].ROLES_ID}`;
  const result = await querySql(sql);
  const userList = [];
  result.forEach(item => {
    userList.push({
      label: item.USER_ID,
      value: item.USER_ID
    })
  });
  return userList;
}
//根据用户名查询用户信息
function QueryUserInfo(username) {
  return queryOne(`select * from V_Users where USER_ID='${username}'`);
}

//根据用户id查询用户信息
function GetUserInfo(id) {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        const column = 'ID,USER_ID,USER_PASSWD,USER_NAME,COMPANY_ID,ROLES_ID,DISABLED,EMAIL,TEL1,TEL2,ADDR,CREATE_BY,UPDATE_BY,CREATE_ON,UPDATE_ON';
        const result = await getInfoForId(id, column, 'V_Users');
        resolve(result);
      } else {
        reject(new Error('查询条件id为空'))
      }
    } catch (e) {
      reject(e);
    }
  });
}

//检测属性是否已存在
function exist(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await exists('FW_S_USERS','USER_ID',userId);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  })
}

//新增用户
function Add(user) {
  return new Promise(async (resolve, reject) => {
    try {
      if (user instanceof User) {
          await insert(user, 'FW_S_USERS');
          resolve();
      } else {
        reject(new Error('添加的用户不合法'))
      }
    } catch (e) {
      reject(e);
    }
  })
}

//删除用户
function Deleted(condition) {
  return new Promise(async (resolve, reject) => {
    try {
      await deleted(condition, 'FW_S_USERS');
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}

//修改用户信息
function Update(user) {
  return new Promise(async (resolve, reject) => {
    try {
      await update(user, 'FW_S_USERS');
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}


module.exports = {
  login,
  GetList,
  GetSelectList,
  QueryUserInfo,
  GetUserInfo,
  exist,
  Add,
  Deleted,
  Update
};
