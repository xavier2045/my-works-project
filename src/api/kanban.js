import request from '@/utils/request'

/** 任务看板基础数据（新） */
export function missionsDashboard(data) {
    return request({
        url: '/missions/dashboard/'+data.id,
        method: 'GET',
        params: data
    })
}

/** DAO子任务列表（新） */
export function missionsDaosTasksList(data) {
    return request({
        url: '/missions/daos/tasks/list/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 任务看板用户记录-大任务（新） */
export function missionsProgress(data) {
    return request({
        url: '/missions/progress/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 任务看板用户记录-子任务（新） */
export function missionsDaosTasksProgress(data) {
    return request({
        url: '/missions/daos/tasks/progress/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 任务下拉列表（新） */
export function missionsDaosTasksDrop(data) {
    return request({
        url: '/missions/daos/tasks/drop/'+data.businessId,
        method: 'GET',
        params: data
    })
}

/** 任务下拉列表（新） */
export function missionsKnowledgeList(data) {
    return request({
        url: '/missions/knowledge/list',
        method: 'GET',
        params: data
    })
}

/** 节点详情（新） */
export function missionsNodeDataGet(data) {
    return request({
        url: '/missions/node/data/get/'+data.id,
        method: 'GET',
    })
}

/** 提案详情（新） */
export function missionsDaosProposalsGet(data) {
    return request({
        url: '/missions/daos/proposals/get/'+data.id,
        method: 'GET',
    })
}

/** 标签列表 */
export function markTagList(data) {
    return request({
        url: '/mark/tag/list',
        method: 'GET',
    })
}

/** 添加标记 */
export function markAdd(data) {
    return request({
        url: '/mark/add',
        method: 'POST',
        data
    })
}

/** 取消标记 */
export function markCancel(data) {
    return request({
        url: '/mark/cancel/'+data.id,
        method: 'DELETE',
    })
}

/** 节点周期下拉列表 */
export function missionsNodePeriodDrop(data) {
    return request({
        url: '/missions/node/period/drop/'+data.id,
        method: 'GET',
        params: data
    })
}


/** 奇点详情（新） */
export function missionsKnowledgeGet(data) {
    return request({
        url: '/missions/knowledge/get/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 奇点审核 */
export function missionsKnowledgeAudit(data) {
    return request({
        url: '/missions/knowledge/audit',
        method: 'POST',
        data
    })
}


