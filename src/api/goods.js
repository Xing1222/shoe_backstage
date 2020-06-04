import request from '@/utils/request'

export function addGoodsClass(data) {
  return request({
    url: '/goods/addclassification',
    method: 'post',
    data: data
  })
}

export function addGoods(data) {
  return request({
    url: '/goods/addGoods',
    method: 'post',
    data: data
  })
}

export function getGoodsClass(data) {
  return request({
    url: '/goods/selectClassification',
    method: 'post',
    data: data
  })
}

export function selectGoods(data) {
  return request({
    url: '/goods/selectGoods',
    method: 'post',
    data: data
  })
}

export function classificationLists(data) {
  return request({
    url: '/goods/classificationLists',
    method: 'post',
    data: data
  })
}

export function infoClassification(data) {
  return request({
    url: '/goods/infoClassification',
    method: 'post',
    data: data
  })
}

export function infoGoods(data) {
  return request({
    url: '/goods/infoGoods',
    method: 'post',
    data: data
  })
}

export function editClassification(data) {
  return request({
    url: '/goods/editClassification',
    method: 'post',
    data: data
  })
}

export function editGoods(data) {
  return request({
    url: '/goods/editGoods',
    method: 'post',
    data: data
  })
}

export function delClassification(data) {
  return request({
    url: '/goods/delClassification',
    method: 'post',
    data: data
  })
}

export function delGoods(data) {
  return request({
    url: '/goods/delGoods',
    method: 'post',
    data: data
  })
}
