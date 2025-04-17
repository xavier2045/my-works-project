import request from '@/utils/request'

/** 全部任务列表 */
export function taskList(data) {
    return request({
        url: '/missions/list',
        method: 'GET',
        params: data
    })
}

/** 我的任务列表 */
export function mineList(data) {
    return request({
        url: '/missions/mine/list',
        method: 'GET',
        params: data
    })
}

/** 支付任务报酬二维码 */
export function payQrcode(data) {
    return request({
        url: '/missions/reward/pay/qrcode',
        method: 'POST',
        data
    })
}

/** 支付任务报酬结果查询 */
export function payQuery(data) {
    return request({
        url: '/missions/reward/pay/query',
        method: 'GET',
        params: data
    })
}

/** 设置节点次数 */
export function periodAdd(data) {
    return request({
        url: '/missions/period/add',
        method: 'POST',
        data
    })
}

/** 设置任务模式 */
export function missionsType(data) {
    return request({
        url: '/missions/type',
        method: 'POST',
        data
    })
}

/** 任务详情接口 */
export function details(data) {
    return request({
        url: '/missions/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 任务申请 */
export function applyAdd(data) {
    return request({
        url: '/missions/apply/add/'+data.id,
        method: 'POST',
    })
}

/** 任务用户申请列表接口 */
export function applyList(data) {
    return request({
        url: '/missions/apply/list',
        method: 'GET',
        params: data
    })
}

/** 任务指定责任人 */
export function applyChoose(data) {
    return request({
        url: '/missions/apply/choose',
        method: 'patch',
        data
    })
}

/** 关注任务 */
export function followAdd(data) {
    return request({
        url: '/missions/follow/add/'+data.id,
        method: 'POST',
        data
    })
}

/** 取消关注任务 */
export function followCancel(data) {
    return request({
        url: '/missions/follow/cancel/'+data.id,
        method: 'DELETE',
        data
    })
}

/** 任务用户申请列表搜索 */
export function applyListSearch(data) {
    return request({
        url: '/missions/apply/list/search',
        method: 'GET',
        params: data
    })
}

/** 任务评论 */
export function commentAdd(data) {
    return request({
        url: '/missions/comment/add',
        method: 'POST',
        data
    })
}

/** 任务评论列表 */
export function commentList(data) {
    return request({
        url: '/missions/comment/list',
        method: 'GET',
        params: data
    })
}

/** 任务评论点赞 */
export function commentPointAdd(data) {
    return request({
        url: '/missions/comment/point/add',
        method: 'POST',
        data
    })
}

/** 取消任务 */
export function cancelTask(data) {
    return request({
        url: '/missions/cancel/'+data.id,
        method: 'POST',
        data
    })
}

/** 任务详情-个人 */
export function missionsDetail(data) {
    return request({
        url: '/missions/detail/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 保存任务草稿 */
export function setMissionsDraft(data) {
    return request({
        url: '/missions/draft',
        method: 'PUT',
        data
    })
}

/** 获取任务草稿 */
export function getMissionsDraft(data) {
    return request({
        url: '/missions/draft/'+data.id,
        method: 'GET',
    })
}

/** 获取任务草稿列表 */
export function missionsDraftOList(data) {
    return request({
        url: '/missions/draft/list',
        method: 'GET',
        params: data
    })
}

/** 保存子任务草稿 */
export function missionsDaosTasksDraft(data) {
    return request({
        url: '/missions/daos/tasks/draft',
        method: 'PUT',
        data
    })
}

/** 获取子任务草稿 */
export function getMissionsDaosTasksDraft(data) {
    return request({
        url: '/missions/daos/tasks/draft/'+data.id,
        method: 'GET',
    })
}

/** 子任务草稿列表 */
export function missionsDaosTasksDraftList(data) {
    return request({
        url: '/missions/daos/tasks/draft/list',
        method: 'GET',
        params: data
    })
}
