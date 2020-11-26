const moment = require('moment');
class Role {
  constructor(data) {
    if (data) {
      this.createRoleMenuFromData(data);
    }
  }

  createRoleMenuFromData(data) {
    this.role_code = data.role_code;
    this.module_id = data.module_id;
    this.CREATE_BY = data.CREATE_BY;
    this.UPDATE_BY = data.UPDATE_BY;
    this.CREATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    this.UPDATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = Role;
