const {querySql,exists, insert, getInfoForId, update, deleted, and, andLike,SqlCompose} = require('../db');
const Role = require('../model/Role');

//获取单位列表
async function GetList(query, username) {
  const {SORT_CODE, ROLE_NAME, role_name2, sort, page, pageSize} = query;
  const userSql = `select ROLES_ID from fw_s_users where USER_ID = '${username}'`;
  const result = await querySql(userSql);
  const offset = (page - 1) * pageSize;
  let sql = `select ID,SORT_CODE,ROLE_NAME,ROLE_DESCRIPT,DISABLED,CREATE_BY,CREATE_ON,UPDATE_BY,UPDATE_ON from fw_s_roles`;
  let where = `where SORT_CODE >= ${result[0].ROLES_ID}`;
  SORT_CODE && (where = andLike(where, `SORT_CODE`, SORT_CODE));
  ROLE_NAME && (where = andLike(where, `ROLE_NAME`, ROLE_NAME));
  role_name2 && (where = andLike(where, `role_name2`, role_name2));
  sql = `${sql} ${where}`;

  if (sort) {
    const symbol = sort[0];
    const column = sort.slice(1, sort.length);
    const order = symbol === '+' ? 'asc' : 'desc';
    sql = `${sql} order by ${column} ${order}`
  }

  sql = SqlCompose(sql,offset,pageSize,page);
  let countSql = `select count(*) as COUNT from fw_s_roles`;
  countSql = `${countSql} ${where}`;
  console.log(sql);
  const list = await querySql(sql);
  const count = await querySql(countSql);
  return {list, count: count[0].COUNT, page, pageSize};
}

//获取单位下拉列表
async function GetSelectList(username) {
  const sql = `select ROLES_ID from fw_s_users where USER_ID = '${username}'`;
  const ROLES_ID = await querySql(sql);
  const roleSql = `select SORT_CODE,ROLE_NAME from FW_S_ROLES where DISABLED = 0 and SORT_CODE >= ${ROLES_ID[0].ROLES_ID}`;
  const result = await querySql(roleSql);
  const roleyList = [];
  result.forEach(item => {
    roleyList.push({
      label: item.ROLE_NAME,
      value: item.SORT_CODE
    })
  });
  return roleyList;
}

//根据用户id查询用户信息
function GetInfo(id) {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        const result = await getInfoForId(id, '*', 'fw_s_roles');
        resolve(result);
      } else {
        reject(new Error('查询条件id为空'))
      }
    } catch (e) {
      reject(e);
    }
  });
}

//根据用户角色查询菜单
async function GetModule(username) {
  const userSql = `select ROLES_ID from fw_s_users where USER_ID = '${username}'`;
  const result = await querySql(userSql);
  const role_code = result[0].ROLES_ID;
  let menuSql = '';
  if(result[0].ROLES_ID === 0){
    menuSql =  `select ID,PERMISSION from fw_s_module`;
    return await querySql(menuSql);
  }else {
    const moduleResult = await querySql(`select MODULE_ID from fw_s_role_module where role_code=${result[0].ROLES_ID}`);
    if(moduleResult.length > 0){
      let moduleIds = [];
      moduleResult.forEach(m => {
        moduleIds.push(m.MODULE_ID);
      });
      moduleIds = moduleIds.join(',');
      menuSql = `select ID,PERMISSION from fw_s_module where ID in (${moduleIds})`;
      return await querySql(menuSql);
    }else {
      return []
    }
  }
}

//检测角色编号是否已存在
function exist(sortCode) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await exists('fw_s_roles','SORT_CODE',sortCode);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  })
}

//新增用户
function Add(role) {
  return new Promise(async (resolve, reject) => {
    try {
      if (role instanceof Role) {
        console.log('imaddrole')
        console.log(role)
        await insert(role, 'fw_s_roles');
        resolve();
      } else {
        reject(new Error('添加的单位不合法'))
      }
    } catch (e) {
      reject(e);
    }
  })
}

//修改用户信息
function Update(role) {
  return new Promise(async (resolve, reject) => {
    try {
      await update(role, 'fw_s_roles');
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
      await deleted(condition, 'fw_s_roles');
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  GetList,
  GetSelectList,
  GetInfo,
  exist,
  Add,
  Update,
  Deleted,
  GetModule
};
