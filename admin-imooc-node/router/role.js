const express = require('express');
const Result = require('../model/Result');
const Role = require('../model/Role');
const boom = require('boom');
const {decoded} = require('../utils/index');
const moment = require('moment');
const {GetList,GetSelectList,GetInfo,exist,Add,Update,Deleted} = require('../services/role');
const {AddSelectMenu} = require('../services/menu');

const router = express.Router();

router.get('/list', (req, res, next) => {
  const decode = decoded(req);
  GetList(req.query,decode.username).then(({list, count, page, pageSize}) => {
    new Result({list, count, page, pageSize}, '获取角色成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
router.get('/selectList', (req, res, next) => {
  const decode = decoded(req);
  GetSelectList(decode.username).then(( list ) => {
    new Result(list, '获取角色成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});

router.get('/info', (req, res, next) => {
  let {id} = req.query;
  if (!id) {
    next(boom.badRequest(new Error('参数id不能为空')));
  } else {
    GetInfo(id).then((company) => {
      new Result(company, '获取角色信息成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  }
});

router.get('/exist', (req, res, next) => {
  let {sortCode} = req.query;
  exist(sortCode).then((isExists) => {
    new Result(isExists, '检测角色编号是否存在成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
router.post('/add', (req, res, next) => {
  const decode = decoded(req);
  if (decode && decode.username) {
    req.body.roleForm.CREATE_BY = decode.username;
    req.body.roleForm.UPDATE_BY = decode.username;
    const role = new Role(req.body.roleForm);
    AddSelectMenu(req.body.roleForm.SORT_CODE,req.body.menu).then(()=>{
      Add(role).then(() => {
        new Result( '添加角色成功').success(res)
      }).catch((err) => {
        next(boom.badImplementation(err))
      })
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  } else {
    new Result(null, '添加角色失败').fail(res)
  }
});
router.post('/update', (req, res, next) => {
  const decode = decoded(req);
  if (decode && decode.username) {
    req.body.roleForm.UPDATE_BY = decode.username;
    req.body.roleForm.UPDATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    const role = req.body.roleForm;
    AddSelectMenu(req.body.roleForm.SORT_CODE,req.body.menu).then(()=>{
      Update(role).then(() => {
        new Result( '编辑角色成功').success(res)
      }).catch((err) => {
        next(boom.badImplementation(err))
      })
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  } else {
    new Result(null, '编辑角色失败').fail(res)
  }
});
router.post('/deleted', (req, res, next) => {
  let condition = req.body;
  console.log(condition);
  Deleted(condition).then(() => {
    new Result(null, '删除角色成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
module.exports = router;
