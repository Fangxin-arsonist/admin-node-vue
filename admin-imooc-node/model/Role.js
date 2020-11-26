const moment = require('moment');
class Role {
  constructor(data) {
    if (data) {
      this.createRoleFromData(data);
    }
  }

  createRoleFromData(data) {
    this.SORT_CODE = data.SORT_CODE;
    this.ROLE_NAME = data.ROLE_NAME;
    this.role_name2 = data.role_name2;
    this.DISABLED = data.DISABLED;
    this.CREATE_BY = data.CREATE_BY;
    this.UPDATE_BY = data.UPDATE_BY;
    this.CREATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    this.UPDATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = Role;
