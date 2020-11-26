const {querySql,exists,insert, getInfoForId, update, deleted,andLike,SqlCompose} = require('../db');
const Company = require('../model/Company');

//获取单位列表
async function GetList(query) {
  const {COMPANY_CODE, NAME, sort, page, pageSize} = query;
  const offset = (page - 1) * pageSize;
  let sql = `select ID,COMPANY_CODE,NAME,DISABLED,TEL1,TEL2,FAX,ADDR_WORKING,CREATE_BY,CREATE_ON,UPDATE_BY,UPDATE_ON from fw_s_companies`;
  let where = `where`;
  COMPANY_CODE && (where = andLike(where, `COMPANY_CODE`, COMPANY_CODE));
  NAME && (where = andLike(where, `NAME`, NAME));
  if (where !== 'where') {
    sql = `${sql} ${where}`;
  }

  if (sort) {
    const symbol = sort[0];
    const column = sort.slice(1, sort.length);
    const order = symbol === '+' ? 'asc' : 'desc';
    sql = `${sql} order by \'${column}\' ${order}`
  }

  sql = SqlCompose(sql,offset,pageSize,page);
  let countSql = `select count(*) as COUNT from fw_s_companies`;
  if (where !== 'where') {
    countSql = `${countSql} ${where}`;
  }
  const list = await querySql(sql);
  const count = await querySql(countSql);
  return {list, count: count[0].COUNT, page, pageSize};
}

//获取单位下拉列表
async function GetSelectList() {
  const sql = `select COMPANY_CODE,NAME from fw_s_companies where DISABLED = 0`;
  const result = await querySql(sql);
  const companyList = [];
  result.forEach(item => {
    companyList.push({
      label: item.NAME,
      value: item.COMPANY_CODE
    })
  });
  return companyList;
}

//根据用户id查询用户信息
function GetInfo(id) {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        const result = await getInfoForId(id, '*','fw_s_companies');
        resolve(result);
      } else {
        reject(new Error('查询条件id为空'))
      }
    } catch (e) {
      reject(e);
    }
  });
}

//检测单位编号是否已存在
function exist(companyCode) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await exists('fw_s_companies','COMPANY_CODE',companyCode);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  })
}
//新增用户
function Add(company) {
  return new Promise(async (resolve, reject) => {
    try {
      if (company instanceof Company) {
        await insert(company, 'fw_s_companies');
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
function Update(company) {
  return new Promise(async (resolve, reject) => {
    try {
      await update(company, 'fw_s_companies');
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
      await deleted(condition, 'fw_s_companies');
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
  Deleted
};
