const express = require('express');
const Result = require('../model/Result');
const Company = require('../model/Company');
const boom = require('boom');
const {decoded} = require('../utils/index');
const {GetList,GetSelectList,GetInfo,exist,Add,Update,Deleted} = require('../services/company');
const moment = require('moment');

const router = express.Router();

router.get('/list', (req, res, next) => {
  GetList(req.query).then(({list, count, page, pageSize}) => {
    new Result({list, count, page:+page, pageSize:+pageSize}, '获取单位成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
router.get('/selectList', (req, res, next) => {
  GetSelectList().then(( list ) => {
    new Result(list, '获取单位成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});

router.get('/exist', (req, res, next) => {
  let {companyCode} = req.query;
  exist(companyCode).then((isExists) => {
    new Result(isExists, '检测单位编号是否存在成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});

router.post('/add', (req, res, next) => {
  const decode = decoded(req);
  if (decode && decode.username) {
    req.body.CREATE_BY = decode.username;
    req.body.UPDATE_BY = decode.username;
    const company = new Company(req.body);
    Add(company).then(() => {
      new Result('添加单位成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  } else {
    new Result(null, '添加单位失败').fail(res)
  }
});
router.get('/info', (req, res, next) => {
  let {id} = req.query;
  if (!id) {
    next(boom.badRequest(new Error('参数id不能为空')));
  } else {
    GetInfo(id).then((company) => {
      new Result(company, '获取单位信息成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  }
});
router.post('/update', (req, res, next) => {
  const decode = decoded(req);
  if (decode && decode.username) {
    req.body.UPDATE_BY = decode.username;
    req.body.UPDATE_ON = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    const company = req.body;
    Update(company).then(() => {
      new Result(null, '编辑单位成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  } else {
    new Result(null, '编辑单位失败').fail(res)
  }
});
router.post('/deleted', (req, res, next) => {
  let condition = req.body;
  console.log(condition);
  Deleted(condition).then(() => {
    new Result(null, '删除单位成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
module.exports = router;
