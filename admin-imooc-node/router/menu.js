const express = require('express');
const Result = require('../model/Result');
const Role = require('../model/Role');
const boom = require('boom');
const {decoded} = require('../utils/index');
const moment = require('moment');
const {GetTree, GetSelectMenu} = require('../services/menu');

const router = express.Router();

router.get('/tree', (req, res, next) => {
  const decode = decoded(req);
  GetTree().then((tree) => {
    new Result(tree, '获取菜单数据成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
router.get('/roleSelect', (req, res, next) => {
  const decode = decoded(req);
  let {roleId} = req.query;
  GetSelectMenu(roleId).then((list) => {
    new Result(list, '获取角色所选菜单数据成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
module.exports = router;
