const moment = require('moment');
class Machine {
  constructor(data) {
    if (data) {
      this.createMachineFromData(data);
    }
  }

  createMachineFromData(data) {
    this.MACHINENO = data.MACHINENO;
    this.SSDW = data.SSDW;
    this.SBFZR = data.SBFZR;
    this.MAKECARD_ID = data.MAKECARD_ID;
    this.MakeCard_Com_Name = data.MakeCard_Com_Name;
    this.CREATE_BY = data.CREATE_BY;
    this.UPDATE_BY = data.UPDATE_BY;
    this.CREATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    this.UPDATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = Machine;
