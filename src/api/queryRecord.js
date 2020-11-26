import request from '@/utils/request'

//获取角色列表
export function getList(params) {
  return request({
    url: '/queryRecord/list',
    method: 'get',
    params
  })
}

//获取统计列表
export function getGroupList(params) {
  return request({
    url: '/queryRecord/Grouplist',
    method: 'get',
    params
  })
}

//获取查询记录详细信息
export function getInfo(params) {
  return request({
    url: '/queryRecord/info',
    method: 'post',
    data: params
  })
}
//获取查询记录详细信息
export function getCRJJLList(params) {
  return request({
    url: '/queryRecord/CRJJLList',
    method: 'post',
    data: params
  })
}


//获取查询记录设备统计
export function getMachineList(params) {
  return request({
    url: '/queryRecord/MachineList',
    method: 'post',
    data: params
  })
}
