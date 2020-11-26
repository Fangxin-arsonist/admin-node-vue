import request from '@/utils/request'

//获取设备列表
export function getList(params) {
  return request({
    url: '/machine/list',
    method: 'get',
    params
  })
}
//获取设备下拉列表
export function getSelectList(params) {
  return request({
    url: '/company/selectList',
    method: 'get',
    params
  })
}

//检测设备编号是否存在
export function exist(machineNo) {
  return request({
    url: '/machine/exist',
    method: 'get',
    params: { machineNo }
  })
}
//添加设备
export function add(machine) {
  return request({
    url: '/machine/add',
    method: 'post',
    data:machine
  })
}

//获取设备详细信息
export function getInfo(id) {
  return request({
    url: '/machine/info',
    method: 'get',
    params: { id }
  })
}
//更新设备信息
export function update(machine) {
  return request({
    url: '/machine/update',
    method: 'post',
    data: machine
  })
}
//删除设备信息
export function deleted(deleteParams) {
  return request({
    url: '/machine/deleted',
    method: 'post',
    data: deleteParams
  })
}
