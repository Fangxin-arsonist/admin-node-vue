import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
//获取用户详细信息
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
//获取用户列表
export function getList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
//获取单位下拉列表
export function getSelectList(params) {
  return request({
    url: '/user/selectList',
    method: 'get',
    params
  })
}
//创建用户
export function add(user) {
  return request({
    url: '/user/add',
    method: 'post',
    data:user
  })
}

//获取用户详细信息
export function getUserInfo(id) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    params: { id }
  })
}
//更新用户信息
export function update(user) {
  return request({
    url: '/user/update',
    method: 'post',
    data: user
  })
}
//删除用户信息
export function deleted(deleteParams) {
  return request({
    url: '/user/deleted',
    method: 'post',
    data: deleteParams
  })
}

//检测用户登录账号是否存在
export function exist(userId) {
  return request({
    url: '/user/exist',
    method: 'get',
    params: { userId }
  })
}
//退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
export function upload() {
  return request({
    url: '/book/upload',
    method: 'post'
  })
}


