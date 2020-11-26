const express = require('express');
const Result = require('../model/Result');
const QueryRecord = require('../model/QueryRecord');
const boom = require('boom');
const {decoded} = require('../utils/index');
const moment = require('moment');
const {GetList, GetInfo, Add, Update,GetCRJJLList,addCRJJL,GetGroupList} = require('../services/queryRecord');

const router = express.Router();

/*获取查询机查询记录列表*/
router.get('/list', (req, res, next) => {
  const decode = decoded(req);
  GetList(req.query, decode.username).then(({list, count, page, pageSize}) => {
    new Result({list, count, page, pageSize}, '获取查询记录列表成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});


router.get('/Grouplist', (req, res, next) => {
  const decode = decoded(req);
  GetGroupList(req.query, decode.username).then(({list, count, page, pageSize}) => {
    new Result({list, count, page, pageSize}, '获取查询记录统计列表成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});


/*获取出入境记录列表*/
router.post('/CRJJLList', (req, res, next) => {
  const {id,listQuery} = req.body;
  GetCRJJLList(id,listQuery).then(({list, count, page, pageSize}) => {
    new Result({list, count, page, pageSize}, '获取查询记录列表成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
/*获取查询机查询记录详情信息*/
router.post('/info', (req, res, next) => {
  let params = req.body;
  console.log(params);
  if (!params.id) {
    next(boom.badRequest(new Error('参数id不能为空')));
  } else {
    GetInfo(params).then((result) => {
      new Result(result, '获取查询记录详情信息成功').success(res)
    }).catch((err) => {
      next(boom.badImplementation(err))
    })
  }
});
//添加查询机查询记录接口
router.post('/add', (req, res, next) => {
  const queryRecord = new QueryRecord(req.body);
  //console.log(queryRecord);
  Add(queryRecord).then((result) => {
    new Result(result, '添加查询机查询记录成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});

//查询机查询记录上传现场照片
router.post('/uploadXCZP', (req, res, next) => {
  const {id,photo} =req.body;
  console.log(photo);
  Update(id,'XCZP',photo).then(() => {
    new Result( '查询机查询记录上传现场照片成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});

//查询机查询记录添加打印数据接口
router.post('/addCRJJLForRecord', (req, res, next) => {
  const {id,CRJRecordData} = req.body;
  addCRJJL(id,CRJRecordData).then(() => {
    new Result('查询机查询记录添加打印数据成功').success(res)
  }).catch((err) => {
    next(boom.badImplementation(err))
  })
});
module.exports = router;
