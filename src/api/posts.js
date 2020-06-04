import request from '@/utils/request'

export function addPostsClass(data) {
  return request({
    url: '/posts/addclassification',
    method: 'post',
    data: data
  })
}

export function addPosts(data) {
  return request({
    url: '/posts/addPosts',
    method: 'post',
    data: data
  })
}
export function delPosts(data) {
  return request({
    url: '/posts/delPosts',
    method: 'post',
    data: data
  })
}
export function getPostsClass(data) {
  return request({
    url: '/posts/selectClassification',
    method: 'post',
    data: data
  })
}

export function selectPosts(data) {
  return request({
    url: '/posts/selectPosts',
    method: 'post',
    data: data
  })
}

export function classificationLists(data) {
  return request({
    url: '/posts/classificationLists',
    method: 'post',
    data: data
  })
}

export function infoClassification(data) {
  return request({
    url: '/posts/infoClassification',
    method: 'post',
    data: data
  })
}

export function infoPosts(data) {
  return request({
    url: '/posts/infoPosts',
    method: 'post',
    data: data
  })
}

export function editClassification(data) {
  return request({
    url: '/posts/editClassification',
    method: 'post',
    data: data
  })
}

export function editPosts(data) {
  return request({
    url: '/posts/editPosts',
    method: 'post',
    data: data
  })
}

export function delClassification(data) {
  return request({
    url: '/posts/delClassification',
    method: 'post',
    data: data
  })
}

