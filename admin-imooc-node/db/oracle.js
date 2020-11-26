var oracledb = require('oracledb');
const {debug} = require('../utils/constant');
const {oracleconfig} = require('./datatype')


var query = function(sql){
  return  new Promise((resolve, reject) => {
    try {
      oracledb.getConnection(
        oracleconfig(),
        function(err, connection)
        {
          if (err) {
            debug && console.log('执行失败，原因：' + JSON.stringify(err));
            console.error(err.message);
            return;
          }
          console.log("数据库开启")
          connection.execute(sql,
            function(err, result)
            {
              if (err) {
                debug && console.log('执行失败，原因：' + JSON.stringify(err));
                console.error(err.message);
                doRelease(connection);
                return;
              }
              console.log("result",result);
              doRelease(connection);
              resolve(
                  result.rows.map((v)=>
                            {                     
                                return result.metaData.reduce((p, key, i)=>
                                {
                                    p[key.name] = v[i];
                                    return p;
                                }, {})
                    })
                );
            });
        });
      }
      catch(e){
        reject(e)
      }
  })
}


var oracleinsert = function(sql){
  return new Promise((resolve, reject) => {
    try {
      oracledb.getConnection(
        oracleconfig(),
        function(err, connection)
        {
          if (err) {
            debug && console.log('执行失败，原因：' + JSON.stringify(err));
            console.error(err.message);
          }
          console.log("数据库开启")
          connection.execute(sql,
            function(err, result)
            {
              if (err) {
                debug && console.log('执行失败，原因：' + JSON.stringify(err));
                console.error(err.message);
                doRelease(connection);
                resolve();
              }
              console.log("result",result);
              connection.commit();
              console.log("提交数据库事务");
              doRelease(connection);
              resolve(result);
            });
            
        });
    } catch (e) {
      reject(e);
    }
  }) 
  }

function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        debug && console.log('执行失败，原因：' + JSON.stringify(err));
        console.error(err.message);
      }
    });
  console.log("数据库关闭")
}

module.exports ={
  query,
  oracleinsert
}