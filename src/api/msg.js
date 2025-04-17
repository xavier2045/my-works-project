import request from '@/utils/request'

/** 消息通知列表 */
export function noticeList(data) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: data
  })
}

/** 消息已读操作 */
export function noticeRead(data) {
  return request({
    url: '/notice/read/'+data.id,
    method: 'Patch',
  })
}

/** 通知删除 */
export function delNotice(data) {
  return request({
    url: '/notice/'+data.id,
    method: 'DELETE',
  })
}

/** 未读通知数量 */
export function noticeUnreadCount(data) {
  return request({
    url: '/notice/unread/count',
    method: 'GET',
  })
}


