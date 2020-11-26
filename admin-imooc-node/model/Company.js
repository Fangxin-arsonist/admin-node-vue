const moment = require('moment');
class Company {
  constructor(data) {
    if (data) {
      this.createCompanyFromData(data);
    }
  }

  createCompanyFromData(data) {
    this.COMPANY_CODE = data.COMPANY_CODE;
    this.NAME = data.NAME;
    this.TEL1 = data.TEL1;
    this.TEL2 = data.TEL2;
    this.FAX = data.FAX;
    this.ADDR_WORKING = data.ADDR_WORKING;
    this.DISABLED = data.DISABLED;
    this.CREATE_BY = data.CREATE_BY;
    this.UPDATE_BY = data.UPDATE_BY;
    this.CREATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    this.UPDATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
  }

  toDb() {
    return {
      COMPANY_CODE: this.COMPANY_CODE,
      NAME: this.NAME,
      TEL1:this.TEL1,
      TEL2:this.TEL2,
      FAX:this.FAX,
      ADDR_WORKING:this.ADDR_WORKING,
      DISABLED:this.DISABLED,
      CREATE_BY: this.CREATE_BY,
      UPDATE_BY: this.UPDATE_BY,
      CREATE_ON: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      UPDATE_ON: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
    }
  }

}

module.exports = Company;
