const express = require('express');
const Result = require('../model/Result');
const User = require('../model/User');
const {md5, aesEncrypt, aesDecrypt, decoded} = require('../utils/index');
const {PWD_SALT, PRIVATE_KEY, JWT_EXPIRED, md5Key} = require('../utils/constant');
const {body, validationResult} = require('express-validator');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const {login, GetList,GetSelectList, QueryUserInfo, GetUserInfo,exist, Add, Update, Deleted} = require('../services/user');
const {GetModule} = require('../services/role');
const moment = require('moment');

const router = express.Router();

router.post('/login', [
    body('username').isString().withMessage('用户名必须为字符'),
    body('password').isString().withMessage('密码必须为字符')
  ],
  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{msg}] = err.errors;
      next(boom.badRequest(msg));
    } else {
      let {username, password} = req.body;
      password = aesEncrypt(password, md5Key);
      login(username, password).then(user => {
        if (!user || user.length === 0) {
          new Result('用户名不存在或密码错误').fail(res);
        } else {
          const token = jwt.sign(
            {username},
            PRIVATE_KEY,
            {expiresIn: JWT_EXPIRED}
          );
          new Result({token}, '登录成功').success(res);
        }
      });
    }
  });
router.get('/info', (req, res, next) => {
  const decode = decoded(req);
  if (decode && decode.username) {
    QueryUserInfo(decode.username).then(user => {
      if (user) {
        user.roles = [user.role];
        GetModule(decode.username).then(module => {
          console.log(module.length);
          if(module.length === 0){
            module = ['null']
          }

          const returnDate = {
            user:user,
            roles:module
          };
          new Result(returnDate, '用户信息查询成功').success(res)
        })
      } else {
        new Result(null, '用户信息查询失败').fail(res)
      }
    })
  } else {
    new Result(null, '用户信息查询失败').fail(res)
  }
});
router.get('/list', (req, res, next) => {
  const decode = decoded(req);
  //console.log('decode',decode);
  GetList(req.query, decode.username).then(({list, count, page, pageSize}) => {
    new Result({list, count, page: +page, pageSize: +pageSize}, '获取用户列表成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});

router.get('/exist', (req, res, next) => {
  let {userId} = req.query;
  exist(userId).then((isExists) => {
    new Result(isExists, '检测登录账号是否存在成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});

router.get('/selectList', (req, res, next) => {
  const decode = decoded(req);
  GetSelectList(decode.username).then(( list ) => {
    new Result(list, '获取用户下拉列表成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
router.post('/add', (req, res, next) => {
  const decode = decoded(req);
  if (decode && decode.username) {
    req.body.CREATE_BY = decode.username;
    req.body.UPDATE_BY = decode.username;
    req.body.USER_PASSWD = aesEncrypt(req.body.USER_PASSWD, md5Key);
    const user = new User(req.body);
    Add(user).then(() => {
      new Result(user, '添加用户成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  } else {
    new Result(null, '添加用户失败').fail(res)
  }
});
router.get('/userInfo', (req, res, next) => {
  let {id} = req.query;
  //console.log(id);
  if (!id) {
    next(boom.badRequest(new Error('参数id不能为空')));
  } else {
    GetUserInfo(id).then((userInfo) => {
      new Result(userInfo, '获取用户信息成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  }
});
router.post('/update', (req, res, next) => {
  const decode = decoded(req);
  if (decode && decode.username) {
    req.body.UPDATE_BY = decode.username;
    req.body.USER_PASSWD = aesEncrypt(req.body.USER_PASSWD, md5Key);
    req.body.UPDATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    let user = req.body;
    Update(user).then(() => {
      new Result(null, '编辑用户成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  } else {
    new Result(null, '编辑用户失败').fail(res)
  }
});
router.post('/deleted', (req, res, next) => {
  let condition = req.body;
  console.log(condition);
  Deleted(condition).then(() => {
    new Result(null, '删除用户成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
module.exports = router;
