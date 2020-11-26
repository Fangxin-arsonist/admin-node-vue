import request from '@/utils/request'

//获取单位列表
export function getList(params) {
  return request({
    url: '/company/list',
    method: 'get',
    params
  })
}
//获取单位下拉列表
export function getSelectList(params) {
  return request({
    url: '/company/selectList',
    method: 'get',
    params
  })
}

//检测单位编号是否存在
export function exist(companyCode) {
  return request({
    url: '/company/exist',
    method: 'get',
    params: { companyCode }
  })
}
//添加单位
export function add(user) {
  return request({
    url: '/company/add',
    method: 'post',
    data:user
  })
}

//获取单位详细信息
export function getInfo(id) {
  return request({
    url: '/company/info',
    method: 'get',
    params: { id }
  })
}
//更新单位信息
export function update(user) {
  return request({
    url: '/company/update',
    method: 'post',
    data: user
  })
}
//删除单位信息
export function deleted(deleteParams) {
  return request({
    url: '/company/deleted',
    method: 'post',
    data: deleteParams
  })
}
