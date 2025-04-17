import request from '@/utils/request'

/** 用户登录 */
export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

/** 发送短信 */
export function smsSendCode(data) {
  return request({
    url: '/sms/send-code',
    method: 'post',
    data
  })
}

/** 实名认证 */
export function realNameAuth(data) {
  return request({
    url: '/users/real-name/auth',
    method: 'put',
    data
  })
}

/** 刷新accessToken */
export function refreshTokenUrl(data) {
  return request({
    url: '/users/refresh-token',
    method: 'post',
    data
  })
}


/** 获取手机号的地区区号,如+86 */
export function smsCountryCode(data) {
  return request({
    url: '/sms/country-code',
    method: 'Get',
  })
}


/** 忘记登陆密码 */
export function passwordForget(data) {
  return request({
    url: '/users/password/forget',
    method: 'Patch',
    data
  })
}

/** 设置登陆密码 */
export function usersPassword(data) {
  return request({
    url: '/users/password',
    method: 'Put',
    data
  })
}

/** 修改登陆密码 */
export function editUsersPassword(data) {
  return request({
    url: '/users/password',
    method: 'Patch',
    data
  })
}

/** 退出登陆 */
export function logout(data) {
  return request({
    url: '/users/logout',
    method: 'Delete',
    data
  })
}

/** 首页接口 */
export function homeInfo(data) {
  return request({
    url: '/home/index',
    method: 'Get',
  })
}

/** 修改个人信息 */
export function editUsersDetail(data) {
  return request({
    url: '/users/detail',
    method: 'Patch',
    data
  })
}

/** 获取个人信息 */
export function getUsersDetail(data) {
  return request({
    url: '/users/detail/'+data.id,
    method: 'Get',
  })
}

/** 个人中心-我的关注 */
export function followLeft(data) {
  return request({
    url: '/users/follow/left/'+data.id,
    method: 'Get',
  })
}

/** 关注/收藏 */
export function followAdd(data) {
  return request({
    url: '/users/follow/add/'+data.followUserId,
    method: 'Put',
  })
}

/** 取消关注/收藏 */
export function followCancel(data) {
  return request({
    url: '/users/follow/cancel/'+data.followUserId,
    method: 'DELETE',
  })
}

export function heartBeat() {
  return request({
    url: '/heart/beat',
    method: 'get'
  })
}

/** 充值 */
export function rechargeQrcode(data) {
  return request({
    url: '/users/wallet/recharge/qrcode',
    method: 'POST',
    data
  })
}

/** 充值结果查询 */
export function rechargeQuery(data) {
  return request({
    url: '/users/wallet/recharge/query',
    method: 'GET',
    params: data
  })
}

/** 我的数字身份列表 */
export function nftList(data) {
  return request({
    url: '/nft/list',
    method: 'GET',
    params: data
  })
}

/** 我的个人首页 */
export function personalOneself(data) {
  return request({
    url: '/personal/index',
    method: 'GET',
  })
}

/** 查看他人首页 */
export function personalOthers(data) {
  return request({
    url: '/personal/index/'+data.userId,
    method: 'GET',
  })
}

/** 我的互关好友 */
export function usersFollowMutual(data) {
  return request({
    url: '/users/follow/mutual',
    method: 'Get',
  })
}

/** 邀请码验证 */
export function usersInviteValidate(data) {
  return request({
    url: '/users/invite/validate',
    method: 'POST',
    data
  })
}

/** 首页提示详情 */
export function homeDetail(data) {
  return request({
      url: '/home/detail',
      method: 'GET',
      params: data
  })
}


