const moment = require('moment');
class CRJJL {
  constructor(data) {
    if (data) {
      this.createCRJJLFromData(data);
    }
  }

  createCRJJLFromData(data) {
    this.CRJBS = data.CRJBS;
    this.ZJMC = data.ZJMC;
    this.ZJHM = data.ZJHM;
    this.CRJSJ = moment(data.CRJSJ).format('YYYY-MM-DD HH:mm:ss');
    this.CRJKA = data.CRJKA;
    this.queryRecordId = data.queryRecordId;
  }
}

module.exports = CRJJL;
