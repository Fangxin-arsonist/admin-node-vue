const moment = require('moment');
class QueryRecord {
  constructor(data) {
    if (data) {
      this.createQueryRecordFromData(data);
    }
  }

  createQueryRecordFromData(data) {
    this.MachineNo = data.MachineNo;
    this.XM = data.XM;
    this.SFZH = data.SFZH;
    this.XB = data.XB;
    this.Age = data.Age;
    this.queryDate = moment(data.queryDate).format('YYYY-MM-DD HH:mm:ss');
    this.CRJRecordData = data.CRJRecordData;
    this.XCZP = data.XCZP;
  }
}

module.exports = QueryRecord;
