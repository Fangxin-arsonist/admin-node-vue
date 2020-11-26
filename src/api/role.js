import request from '@/utils/request'

//获取角色列表
export function getList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}
//获取角色下拉列表
export function getRoleSelectList(params) {
  return request({
    url: '/role/selectList',
    method: 'get',
    params
  })
}

//获取角色详细信息
export function getInfo(id) {
  return request({
    url: '/role/info',
    method: 'get',
    params: { id }
  })
}

//检测角色编号是否存在
export function exist(sortCode) {
  return request({
    url: '/role/exist',
    method: 'get',
    params: { sortCode }
  })
}
export function add(role) {
  return request({
    url: '/role/add',
    method: 'post',
    data:role
  })
}

export function update(role) {
  return request({
    url: `/role/update`,
    method: 'post',
    data:role
  })
}

export function deleted(deleteParams) {
  return request({
    url: `/role/deleted`,
    method: 'post',
    data: deleteParams
  })
}
