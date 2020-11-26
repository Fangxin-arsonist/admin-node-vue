const express = require('express');
const Result = require('../model/Result');
const Machine = require('../model/Machine');
const boom = require('boom');
const {decoded} = require('../utils/index');
const {GetList,GetInfo,exist,Add,Update,Deleted} = require('../services/machine');
const moment = require('moment');

const router = express.Router();

router.get('/list', (req, res, next) => {
  GetList(req.query).then(({list, count, page, pageSize}) => {
    new Result({list, count, page:+page, pageSize:+pageSize}, '获取设备成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});

router.get('/exist', (req, res, next) => {
  let {machineNo} = req.query;
  exist(machineNo).then((isExists) => {
    new Result(isExists, '检测设备编号是否存在成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
router.post('/add', (req, res, next) => {
  const decode = decoded(req);
  if (decode && decode.username) {
    req.body.CREATE_BY = decode.username;
    req.body.UPDATE_BY = decode.username;
    const machine = new Machine(req.body);
    Add(machine).then(() => {
      new Result('添加设备成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  } else {
    new Result(null, '添加设备失败').fail(res)
  }
});
router.get('/info', (req, res, next) => {
  let {id} = req.query;
  if (!id) {
    next(boom.badRequest(new Error('参数id不能为空')));
  } else {
    GetInfo(id).then((company) => {
      new Result(company, '获取设备信息成功').success(res)
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
    const machine = req.body;
    Update(machine).then(() => {
      new Result(null, '编辑设备成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  } else {
    new Result(null, '编辑设备失败').fail(res)
  }
});
router.post('/deleted', (req, res, next) => {
  let condition = req.body;
  Deleted(condition).then(() => {
    new Result(null, '删除设备成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
module.exports = router;
