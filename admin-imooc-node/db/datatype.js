var databasetype = 'mysql'

var oracletypeconfig={
  user:'gmm',　　//用户名
  password:'gmm',　　//密码
  //IP:数据库IP地址，PORT:数据库端口，SCHEMA:数据库名称
  connectString : "localhost/ORCL"
}

var mysqltypeconfig={
    host:'localhost',
    user:'root',
    password:'123456',
    database:'cxj'
}


function database(){
    return databasetype;
}

function oracleconfig(){
    return oracletypeconfig;
}

function mysqlconfig(){
    return mysqltypeconfig;
}

module.exports = {
    database,
    oracleconfig,
    mysqlconfig
  };