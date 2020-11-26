import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}
export function roleSelectMenu(roleId) {
  return request({
    url: '/menu/roleSelect',
    method: 'get',
    params: { roleId }
  })
}
