import request from '@/utils/request'

/** 用户搜索 */
export function searchUser(data) {
    return request({
        url: '/users/search',
        method: 'GET',
        params: data
    })
}

/** 作品创建-中心化 */
export function worksSave(data) {
    return request({
        url: '/works/save',
        method: 'POST',
        data
    })
}

/** 作品广场 */
export function worksList(data) {
    return request({
        url: '/works/list',
        method: 'GET',
        params: data
    })
}


/** 作品列表-我的 */
export function worksMineList(data) {
    return request({
        url: '/works/mine/list',
        method: 'GET',
        params: data
    })
}

/** 作品列表-统计 */
export function worksMineListCount(data) {
    return request({
        url: '/works/mine/list/count',
        method: 'GET',
        params: data
    })
}

/** 作品详情 */
export function worksDetails(data) {
    return request({
        url: '/works/'+ data.id,
        method: 'GET',
        params: data
    })
}

/** 标签搜索 */
export function worksTagsPrefix(data) {
    return request({
        url: '/works/tags/prefix/'+ data.name,
        method: 'GET',
    })
}

/** 保存作品草稿 */
export function worksDraft(data) {
    return request({
        url: '/works/draft',
        method: 'PUT',
        data
    })
}

/** 获取作品草稿 */
export function worksDraftData(data) {
    return request({
        url: '/works/draft/'+ data.id,
        method: 'GET',
        params: data
    })
}

/** 获取作品草稿列表 */
export function worksDraftList(data) {
    return request({
        url: '/works/draft/list',
        method: 'GET',
        params: data
    })
}

/** 共创者列表 */
export function worksCoCreator(data) {
    return request({
        url: '/works/co-creator/'+ data.id,
        method: 'GET',
        params: data
    })
}

/** 作品详情-统计 */
export function worksRightCount(data) {
    return request({
        url: '/works/right-count/'+ data.id,
        method: 'GET',
        params: data
    })
}

/** 转发作品-增加次数 */
export function worksShare(data) {
    return request({
        url: '/works/share/'+ data.id,
        method: 'POST',
        data
    })
}

/** 作品引用搜索 */
export function worksSearch(data) {
    return request({
        url: '/works/search/'+ data.name,
        method: 'GET',
    })
}

/** 关注用户 */
export function worksFollowAdd(data) {
    return request({
      url: '/works/follow/add/'+data.id,
      method: 'Put',
    })
}
  
  /** 取消关注用户 */
export function worksFollowCancel(data) {
    return request({
      url: '/works/follow/cancel/'+data.id,
      method: 'DELETE',
    })
}

/** 作品上下架、可见权限、删除 */
export function worksUpdate(data) {
    return request({
      url: '/works/update',
      method: 'Put',
      data
    })
}

/** 作品交易记录列表 */
export function worksBuyList(data) {
    return request({
        url: '/works/buy/list/'+ data.id,
        method: 'GET',
        params: data
    })
}

/** 作品交易记录统计 */
export function worksBuyListCount(data) {
    return request({
        url: '/works/buy/list/count/'+ data.id,
        method: 'GET',
        params: data
    })
}

/** 二创库添加、删除*/
export function worksRecreate(data) {
    return request({
      url: '/works/recreate',
      method: 'Put',
      data
    })
}


