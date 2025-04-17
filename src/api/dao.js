import request from '@/utils/request'

/** 创建DAO */
export function daosSave(data) {
    return request({
        url: '/missions/daos/save',
        method: 'POST',
        data
    })
}

/** DAO详情 */
export function getDaoDetails(data) {
    return request({
        url: '/missions/daos/get/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 创建DAO子任务 */
export function tasksSave(data) {
    return request({
        url: '/missions/daos/tasks/save',
        method: 'POST',
        data
    })
}

/** 发起提案 */
export function proposalsSave(data) {
    return request({
        url: '/missions/daos/proposals/save',
        method: 'POST',
        data
    })
}

/** 提案投票 */
export function proposaproposalsVotelsSave(data) {
    return request({
        url: '/missions/daos/proposals/vote',
        method: 'POST',
        data
    })
}

/** 指定子任务责任人 */
export function applyChoose(data) {
    return request({
        url: '/missions/daos/tasks/assign',
        method: 'Put',
        data
    })
}

/** DAO子任务申请 */
export function applyAdd(data) {
    return request({
        url: '/missions/daos/tasks/apply/add',
        method: 'POST',
        data
    })
}

/** DAO子任务申请列表 */
export function applyList(data) {
    return request({
        url: '/missions/daos/tasks/apply/list',
        method: 'GET',
        params: data
    })
}

/** DAO子任务详情 */
export function daosTasksGetDetail(data) {
    return request({
        url: '/missions/daos/tasks/get/detail/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 创建个人任务 */

/** DAO子任务列表 */
export function subTasksList(data) {
    return request({
        url: '/missions/daos/tasks/list/'+data.id,
        method: 'GET',
    })
}

/** 发起提案子任务名称列表 */
export function listProposal(data) {
    return request({
        url: '/missions/daos/tasks/list/proposal/'+data.id,
        method: 'GET',
    })
}

/** 上传节点 */
export function nodeDataAdd(data) {
    return request({
        url: '/missions/node/data/add',
        method: 'POST',
        data
    })
}


/** 节点周期列表 */
export function nodePeriodList(data) {
    return request({
        url: '/missions/node/period/list/'+data.id,
        method: 'GET',
    })
}

/** 节点列表 */
export function nodeDataList(data) {
    return request({
        url: '/missions/node/data/list',
        method: 'GET',
        params: data
    })
}

/** 节点列表-日历 */
export function nodeDataListCalendar(data) {
    return request({
        url: '/missions/node/data/calendar',
        method: 'GET',
        params: data
    })
}

/** 节点列表下拉任务列表 */
export function tasksListNodeData(data) {
    return request({
        url: '/missions/daos/tasks/list/node-data/'+data.id,
        method: 'GET',
    })
}

/** 节点详情 */
export function nodeDataGet(data) {
    return request({
        url: '/missions/node/data/get/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 节点审核 */
export function nodeDataAudit(data) {
    return request({
        url: '/missions/node/data/audit',
        method: 'POST',
        data
    })
}


/** DAO团队管理列表 */
export function memberList(data) {
    return request({
        url: '/missions/daos/member/list/'+data.id,
        method: 'GET',
    })
}

/** DAO添加成员 */
export function memberAdd(data) {
    return request({
        url: '/missions/daos/member/add',
        method: 'POST',
        data
    })
}

/** DAO删除成员 */
export function memberDelete(data) {
    return request({
        url: '/missions/daos/member/delete',
        method: 'DELETE',
        data
    })
}

/** DAO可指定任务列表 */
export function tasksListAdmin(data) {
    return request({
        url: '/missions/daos/tasks/list/admin/'+data.id,
        method: 'GET',
    })
}

/** DAO团队管理用户搜索 */
export function searchUser(data) {
    return request({
        url: '/users/search',
        method: 'GET',
        params: data
    })
}
/** 知识库提交 */
export function knowledgeAdd(data) {
    return request({
        url: '/missions/knowledge/add',
        method: 'POST',
        data
    })
}

/** DAO知识库列表 */
export function knowledgeList(data) {
    return request({
        url: '/missions/knowledge/list',
        method: 'GET',
        params: data
    })
}

/** 我的知识库列表 */
export function knowledgeMineList(data) {
    return request({
        url: '/missions/knowledge/mine/list',
        method: 'GET',
        params: data
    })
}

/** 子任务详情 */
export function daosTasksGet(data) {
    return request({
        url: '/missions/daos/tasks/get/'+data.id,
        method: 'GET',
        params: data
    })
}

/** 提案列表 */
export function proposalsList(data) {
    return request({
        url: '/missions/daos/proposals/list',
        method: 'GET',
        params: data
    })
}

/** DAO列表 */
export function daosList(data) {
    return request({
        url: '/missions/daos/list',
        method: 'GET',
        params: data
    })
}

/** 我的DAO列表 */
export function daosMineList(data) {
    return request({
        url: '/missions/daos/mine/list',
        method: 'GET',
        params: data
    })
}

/** 取消DAO子任务 */
export function daosTasksCancel(data) {
    return request({
        url: 'missions/daos/tasks/cancel/'+data.id,
        method: 'POST',
        data
    })
}

