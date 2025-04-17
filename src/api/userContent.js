/** 活动 API **/
import request from '@/utils/request'

/** 发布任务 */
export function missionsPublish(data) {
  return request({
    url: '/missions/save',
    method: 'post',
    data
  })
}

/** 发布活动 */
export function activitiesPublish(data) {
  return request({
    url: '/activities/publish',
    method: 'post',
    data
  })
}

/** 发布作品 */
export function worksPublish(data) {
  return request({
    url: '/works/publish',
    method: 'post',
    data
  })
}
