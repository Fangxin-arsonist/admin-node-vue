const {querySql, insert, and, andLike,deleted} = require('../db');
const Role = require('../model/Role');
const {database} = require('../db/datatype')

//获取菜单树
async function GetTree() {
  let sql = `select ID,MODULE_NAME,PERMISSION,FATHER_ID from fw_s_module`;
  const list = await querySql(sql);
  console.log("菜单list")
  console.log(list)
  let tree = [];
  let temp = {};
  list.forEach(module => {
    let treeC = {};
    let moduleArray = (module.PERMISSION).split("/");
    if (moduleArray.length === 2) {
      treeC.id = module.ID;
      treeC.label = module.MODULE_NAME;
      treeC.children = [];
      tree.push(treeC);
    }
  });
  list.forEach(module => {
    let treeC = {};
    let moduleArray = (module.PERMISSION).split("/");
    if (moduleArray.length > 2) {
      treeC.id = module.ID;
      treeC.label = module.MODULE_NAME;
      tree.forEach(tree => {
        if (module.FATHER_ID === tree.id) {
          tree.children.push(treeC);
        }
      })
    }
  });
  return tree;
}

//获取角色所选菜单
async function GetSelectMenu(roleId) {
  const roleSql = `select SORT_CODE from fw_s_roles where ID = '${roleId}'`;
  const result = await querySql(roleSql);
  console.log("im查出来的result")
  console.log(result);
  let sql;
  if(database()==='oracle'){
    sql = `select fw_s_role_module.MODULE_ID from fw_s_role_module inner join fw_s_module on fw_s_role_module.MODULE_ID = fw_s_module.ID where  fw_s_role_module.ROLE_CODE = ${result[0].SORT_CODE} and fw_s_module.FATHER_ID is not null`;
  }
  if(database()==='mysql'){
    sql = `select fw_s_role_module.MODULE_ID from fw_s_role_module,fw_s_module where fw_s_role_module.MODULE_ID = fw_s_module.ID and fw_s_role_module.ROLE_CODE = ${result[0].SORT_CODE} and fw_s_module.FATHER_ID != ''`;
  }
  const list = await querySql(sql);
  console.log("imlist");
  console.log(list);
  let selectMenu = [];
  list.forEach(list => {
    selectMenu.push(list.MODULE_ID)
  });
  return selectMenu;
}

//检测记录是否已存在
function deleted_menu(role_code) {
  console.log(role_code);
  return deleted(role_code,"fw_s_role_module ")
}

//添加角色所选菜单
async function AddSelectMenu(roleCode, menus) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(roleCode)
      console.log(menus)
      console.log(menus.length)
      console.log("rolecode and menus")
      // const count = await deleted_menu(roleCode);
      if (menus.length > 0) {
        menus.forEach(async (menuId) => {
          let menuModel = {
            role_code: roleCode,
            module_id: menuId
          };
          console.log(menuModel);
          console.log('menuModel');
          await insert(menuModel, 'fw_s_role_module')
        });
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  GetTree,
  GetSelectMenu,
  AddSelectMenu
};
