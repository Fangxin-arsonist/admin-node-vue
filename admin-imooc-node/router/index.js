const express = require("express");
const boom = require("boom");
const jwtAuth = require('./jwt');
const Result = require('../model/Result');
const userRouter = require('./user');
const roleRouter = require('./role');
const companyRouter = require('./company');
const machineRouter = require('./machine');
const menuRouter = require('./menu');
const queryRecordRouter = require('./queryRecord');
//注册路由
const router = express.Router();

router.use(jwtAuth);
router.get('/', (req, res) => {
  res.send("欢迎使用查询机查询记录管理后台");
});
router.use('/user', userRouter);
router.use('/role', roleRouter);
router.use('/menu', menuRouter);
router.use('/company', companyRouter);
router.use('/machine', machineRouter);
router.use('/queryRecord', queryRecordRouter);
/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理请求流程之后，否则，会拦截正常请求
 */
router.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
});
/**
 * 自定义路由异常处理中间件
 * 注意：该方法必须放在路由最后，并且方法的参数不能减少
 */
router.use((err, req, res, next) => {
  if (err.name && err.name === 'UnauthorizedError') {
    const {status = 401,message} = err;
    new Result(null,'Token验证失败',{
      error:status,
      errorMsg: message
    }).jwtError(res.status(status));
  } else {
    const msg = (err && err.message) || '系统错误';
    const statusCode = (err.output && err.output.statusCode) || 500;
    const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message;
    new Result(null,msg,{
      error: statusCode,
      errorMsg
    }).fail(res.status(statusCode));
  }
});

module.exports = router;
