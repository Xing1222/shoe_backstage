import request from '@/utils/request'

export const uploadFile = req => {
  const env = process.env.NODE_ENV
  let $domain = ''
  if (env === 'development') {
    // 开发模式
    $domain = '/dev-api/'
  } else {
    // 发布模式
    $domain = '/dev-api/'
  }
  return $domain + 'commom/upload'
}

export function addGoods(data) {
  return request({
    url: '/goods/addGoods',
    method: 'post',
    data: data
  })
}
