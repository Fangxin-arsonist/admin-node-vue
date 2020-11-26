const express = require("express");
const router = require('./router');
const fs = require('fs');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', router);

// 创建服务器
const  httpServer = http.createServer(app);
httpServer.listen(9999,() => {
  console.log('Http服务启动成功：http://localhost:9999');
})
//
// const server = app.listen(5000, () => {
//     const { address, port } = server.address();
//     console.log('Http Server is running on http://%s:%s', address, port);
// })
