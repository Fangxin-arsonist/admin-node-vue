const jwt = require('express-jwt');
const {PRIVATE_KEY} = require('../utils/constant');

const jwtAuth = jwt({
  secret:PRIVATE_KEY,
  credentialsRequired:true,
  algorithms:['HS256']
}).unless({
  path:[
    '/',
    '/user/login',
    '/queryRecord/add',
    '/queryRecord/addCRJJLForRecord',
    '/queryRecord/uploadXCZP',
  ],
  algorithms:false
});
module.exports = jwtAuth;
