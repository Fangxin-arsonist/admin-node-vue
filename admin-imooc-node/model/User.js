const moment = require('moment');
class User {
  constructor(data) {
    if (data) {
      this.createUserFromData(data);
    }
  }

  createUserFromData(data) {
    this.USER_ID = data.USER_ID;
    this.USER_NAME = data.USER_NAME;
    this.USER_PASSWD = data.USER_PASSWD;
    this.ROLES_ID = data.ROLES_ID;
    this.COMPANY_ID = data.COMPANY_ID;
    this.TEL1 = data.TEL1;
    this.TEL2 = data.TEL2;
    this.EMAIL = data.EMAIL;
    this.DISABLED = data.DISABLED;
    this.ADDR = data.ADDR;
    this.CREATE_BY = data.CREATE_BY;
    this.UPDATE_BY = data.UPDATE_BY;
    this.CREATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    this.UPDATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
  }

  toDb() {
    return {
      USER_ID: this.USER_ID,
      USER_NAME: this.USER_NAME,
      USER_PASSWD:this.USER_PASSWD,
      ROLES_ID:this.ROLES_ID,
      COMPANY_ID:this.COMPANY_ID,
      TEL1:this.TEL1,
      TEL2:this.TEL2,
      EMAIL:this.EMAIL,
      ADDR:this.ADDR,
      DISABLED:this.DISABLED,
      CREATE_BY: this.CREATE_BY,
      UPDATE_BY: this.UPDATE_BY,
      CREATE_ON: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      UPDATE_ON: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
    }
  }

}

module.exports = User;
