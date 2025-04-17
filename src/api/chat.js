import request from '@/utils/request'

/** 好友列表 */
export function friendsList() {
  return request({
    url: '/im/friends/list',
    method: 'get'
  })
}

/** 添加好友 */
export function addFriends(data) {
  return request({
    url: '/im/friends/add',
    method: 'post',
    data
  })
}

/** 发送私聊消息 */
export function send(data) {
  return request({
    url: '/im/private/send',
    method: 'put',
    data
  })
}
/** 获取离线消息 */
export function offlineMessage(data) {
  return request({
    url: '/im/private/offline-message',
    method: 'post',
    data
  })
}
/** 将会话中接收的消息状态置为已读 */
export function read(data) {
  return request({
    url: '/im/private/read',
    method: 'post',
    data
  })
}
/** 历史聊天记录 */
export function privateSend(data) {
  return request({
    url: '/im/private/history',
    method: 'GET',
    params: data
  })
}



