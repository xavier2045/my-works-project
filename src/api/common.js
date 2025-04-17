/** 公共 API **/
import request from '@/utils/request'

/** 获取腾讯云数据存储参数 */
export function filesCos(data) {
  return request({
    url: '/files/cos/temp-token',
    method: 'GET',
    params: data
  })
}

/** 获取腾讯云语音识别参数 */
export function thirdSpeechTempToken(data) {
  return request({
    url: '/third/speech/temp-token',
    method: 'GET',
    params: data
  })
}


/** 获取行业 */
export function categoryGet(data) {
  return request({
    url: '/category/get',
    method: 'GET',
    params: data
  })
}

/** 发布搜索-查询任务广场和dao广场搜索数据 */
export function searchPublish(data) {
  return request({
      url: '/search/publish',
      method: 'GET',
      params: data
  })
}

/** 新增评论 */
export function commentAdd(data) {
  return request({
      url: '/comment/add',
      method: 'POST',
      data
  })
}
/** 评论列表 */
export function commentList(data) {
  return request({
      url: '/comment/list',
      method: 'GET',
      params: data
  })
}
/** 删除评论 */
export function commentDel(data) {
  return request({
      url: '/comment/'+data.commentId,
      method: 'DELETE',
      data
  })
}
/** 点赞评论 */
export function commentPoint(data) {
  return request({
      url: '/comment/point',
      method: 'POST',
      data
  })
}
/** 点赞取消 */
export function commentPointId(data) {
  return request({
      url: '/comment/point/'+data.commentId,
      method: 'DELETE',
  })
}
/** 举报评论 */
export function commentReport(data) {
  return request({
      url: '/comment/report',
      method: 'POST',
      data
  })
}

/** Ai 生成内容 */
export function aiGenerate(data) {
  return request({
      url: '/ai/generate',
      method: 'POST',
      data
  })
}

/** 意见反馈-保存 */
export function feedbackSave(data) {
  return request({
      url: '/feedback/save',
      method: 'POST',
      data
  })
}

/** 数字身份领取 */
export function nftReceiveValidate(data) {
  return request({
      url: '/nft/receive/validate',
      method: 'POST',
      data
  })
}

