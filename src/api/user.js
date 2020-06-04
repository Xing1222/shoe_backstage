import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/admins/login',
    method: 'get',
    params: params
  })
}

export function getInfo(token) {
  return request({
    url: '/admins/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admins/logout',
    method: 'post'
  })
}
export function selectApprovalLists(data) {
  return request({
    url: '/user/selectApprovalLists',
    method: 'post',
    data: data
  })
}
export function approvalPass(data) {
  return request({
    url: '/user/approvalPass',
    method: 'post',
    data: data
  })
}
export function approvalRej(data) {
  return request({
    url: '/user/approvalRej',
    method: 'post',
    data: data
  })
}
export function delApproval(data) {
  return request({
    url: '/user/delApproval',
    method: 'post',
    data: data
  })
}
