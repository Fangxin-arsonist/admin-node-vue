const mysql = require('mysql');
const {mysqlconfig} = require('./datatype');

function connect() {
    const config = mysqlconfig();
    return mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      multipleStatements: true
    })
}

module.exports = {
    connect
  };