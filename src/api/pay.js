/** 支付 API **/
import request from '@/utils/request'

/** 获取上链手续费用 */
export function upChainPoundages(data) {
  return request({
    url: '/publish/up-chain/poundage',
    method: 'get',
    params: data
  })
}

/** 是否开启积分抵扣上链费用 */
export function pointIsOpen(data) {
  return request({
    url: '/publish/point/is-open',
    method: 'get',
    params: data

    
  })
}

/** 支付订单统一创建 */
export function orderSave(data) {
  return request({
    url: '/order/save',
    method: 'POST',
    data
  })
}

/** 支付订单统一取消 */
export function orderCancel(data) {
  return request({
    url: '/order/cancel/'+data.orderNo,
    method: 'DELETE',
    params: data
  })
}

/** 支付订单统一查询订单结果 */
export function orderQuery(data) {
  return request({
    url: '/order/query',
    method: 'get',
    params: data
  })
}


/** 查询积分余额 */
export function chainBalance(data) {
  return request({
    url: '/users/wallet/chain/balance',
    method: 'get',
    params: data
  })
}

/** 查询待支付列表 */
export function orderPending(data) {
  return request({
    url: '/order/pending',
    method: 'get',
    params: data
  })
}

/** 我的收支出比例+柱状 */
export function countIncome(data) {
  return request({
    url: '/flow/income',
    method: 'get',
    params: data
  })
}

/** 营收+周数据+账单 */
export function countIncomeWeek(data) {
  return request({
    url: '/flow/income/week',
    method: 'get',
    params: data
  })
}

/** 账单明细-列表 */
export function countList(data) {
  return request({
    url: '/flow/list',
    method: 'get',
    params: data
  })
}

/** 账单明细-月统计 */
export function flowSumMonth(data) {
  return request({
    url: '/flow/sum/month',
    method: 'get',
    params: data
  })
}

/** 作品提现 */
export function orderWithdrawSave(data) {
  return request({
    url: '/order/withdraw/save',
    method: 'POST',
    data
  })
}

/** 待支付订单数量 */
export function orderPendingCount() {
  return request({
    url: '/order/pending/count',
    method: 'GET',
  })
}


