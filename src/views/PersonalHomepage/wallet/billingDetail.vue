<template>
  <div class="detail">
    <persHeader />
    <div class="detail-container">
      <div class="wallet-type-table">
        <div class="wallet-type-table-main">
          <div
            :class="['wallet-type-table-item', isType == item.value ? 'relievoShadow' : '']"
            v-for="(item, index) in walletTypeData"
            :key="index"
            @click="changeWalletType(item)"
          >{{ item.label }}</div>
        </div>
      </div>
      <div class="detail-header">
        <div class="detail-header-flex">
          <div class="detail-header-flex-l">
            <div class="detail-header-flex-l-main">
              <div class="detail-header-flex-r-main-stats">
                <span>总支出 ¥ {{ statsData.spend || 0 }}</span>
                <span>总收入 ¥ {{ statsData.income || 0 }}</span>
                <span>总提现 ¥ {{ statsData.totalWithdraw || 0 }}</span>
                <span>使用积分{{ statsData.pointSpend || 0 }}</span>
                <span>获得积分{{ statsData.pointIncome || 0 }}</span>
              </div>
            </div>
          </div>
          <div class="detail-header-flex-c"></div>
          <div class="detail-header-flex-r">
            <div class="detail-header-flex-r-main">
              <div class="order-time">
                <div class="order-time-icon">
                  <i class="icon font_family icon-rili24"></i>
                </div>
                <div class="order-time-main">
                  <el-date-picker
                    v-model="orderTime"
                    type="date"
                    format="YYYY-MM"
                    value-format="YYYY-MM"
                    placeholder="请选择日期"
                    :clearable="false"
                  />
                </div>
                <div class="order-time-pperation">
                  <div class="order-time-pperation-left relievoShadow" @click="addDays(-1)">
                    <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
                  </div>
                  <div class="order-time-pperation-right relievoShadow" @click="addDays(+1)">
                    <i class="icon font_family icon-a-jiantouxiangyouyue20"></i>
                  </div>
                </div>
              </div>
              <div class="detail-header-flex-r-main-orderType">
                <!-- <div
                  class="orderType-item"
                  :class="isFlag === index ? 'flag' : ''"
                  v-for="(item, index) in orderType"
                  :key="index"
                  @click="findFilterOrderTypeFun(item.value, index)"
                >{{ item.label }}</div> -->
                <BillingSelect
                  :options="selectList"
                  v-model="selectedValue"
                  placeholder="全部账单"
                  @open="handleOpen" 
                  @close="handleClose"
                  @update:modelValue="updateModelValue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-content">
        <div class="detail-content-main">
          <infinite-scroll-list 
            :fetchFunction="fetchNews" 
            :hasMore="hasMore"
            :filterCriteria="currentFilterCriteria"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="19" :cols="1">
                <div 
                  v-for="item in items" 
                  :key="item.id" 
                  class="list-item fade-up-item" 
                  data-aos="fade-up"
                  @click="findOrderInfoFun(item)"
                >
                  <div class="item-main">
                    <div class="item-main-content">
                      <div class="item-main-content-l">
                        <div class="trading-content">
                          <div class="trading-content-img">
                            <template v-if="isType == 2 && item.flowType == 4">
                              <template v-if="item.payWay == 1">
                                <i class="icon font_family icon-weixinbiankuang421"></i>
                              </template>
                              <template v-else-if="item.payWay == 2">
                                <i class="icon font_family icon-yinhangka421"></i>
                              </template>
                              <template v-else-if="item.payWay == 3">
                                <i class="icon font_family icon-icon-weixin421"></i>
                              </template>
                            </template>
                            <template v-else>
                              <img :src="item.cover" alt="" />
                            </template>
                          </div>
                          <!-- <div class="trading-content-text" :title="item.name">
                            {{ item.name }}
                          </div> -->
                        </div>
                      </div>
                      <div class="item-main-content-r">
                        <div class="content-r-main">
                          <div class="main-table">
                            <div class="table">
                              <div class="table-row">
                                <div class="table-cell">订单类型</div>
                                <div class="table-cell">订单时间</div>
                                <div class="table-cell">订单编号</div>
                                <div class="table-cell">订单金额</div>
                                <div class="table-cell">订单状态</div>
                              </div>
                              <div class="table-row">
                                <div class="table-cell cell-line-height">
                                  <template v-if="isType == 1">
                                    <div class="table-cell-main ">
                                      <template v-if="item.flowType == 1">发布任务：{{ item.name }}</template>
                                      <template v-if="item.flowType == 2">
                                        <template v-if="item.isIncome == 0">指定任务负责人：{{ item.name }}</template>
                                        <template v-if="item.isIncome == 1">参与任务：{{ item.name }}</template>
                                      </template>
                                      <template v-if="item.flowType == 3">创建团队：{{ item.name }}</template>
                                      <template v-if="item.flowType == 4">创建团队：{{ item.name }}</template>
                                      <template v-if="item.flowType == 5">发布子任务：{{ item.name }}</template>
                                      <template v-if="item.flowType == 6">指定子任务负责人：{{ item.name }}</template>
                                      <template v-if="item.flowType == 7">
                                        <template v-if="item.isIncome == 0">指定子任务负责人：{{ item.name }}</template>
                                        <template v-if="item.isIncome == 1">参与子任务：{{ item.name }}</template>
                                      </template>
                                    </div>
                                  </template>
                                  <template v-else-if="isType == 2">
                                    <div class="table-cell-main multi-line-1">
                                      <template v-if="item.flowType == 1">发布作品：{{ item.name }}</template>
                                      <template v-if="item.flowType == 2">
                                        <template v-if="item.isIncome == 0">购买作品：{{ item.name }}</template>
                                        <template v-if="item.isIncome == 1">出售作品：{{ item.name }}</template>
                                      </template>
                                      <template v-if="item.flowType == 3">
                                        <template v-if="item.isIncome == 0">分成支出：{{ item.name }}</template>
                                        <template v-if="item.isIncome == 1">出售作品：{{ item.name }}</template>
                                      </template>
                                    </div>
                                    <template  v-if="item.flowType == 4">
                                      余额提现到：
                                      <span>
                                        <template v-if="item.withdrawWay == 1">支付宝{{ parseValue(2, item.account) }} {{ parseValue(3, item.realName) }}</template>
                                        <template v-else-if="item.withdrawWay == 2">银行卡{{ parseValue(1, item.account) }} {{ parseValue(3, item.realName) }}</template>
                                        <template v-else-if="item.withdrawWay == 3">微信{{ parseValue(2, item.account) }} {{ parseValue(3, item.realName) }}</template>
                                      </span>
                                    </template>
                                  </template>
                                </div>
                                <div class="table-cell cell-line-height">{{ item.createTime }}</div>
                                <div class="table-cell cell-line-height">{{ item.orderNo }}</div>
                                <div class="table-cell cell-line-height">
                                  
                                  <p><span>{{ item.isIncome == '0' ? '-' : '+' }}</span><span :class="item.payWay == 1 ? 'text-line-through' : ''"> ¥{{ item.totalAmount }}</span></p>
                                  <!-- <template v-if="item.isIncome == '0'">
                                    <p class="table-cell-tips" v-if="item.payWay == 1">已使用积分{{ item.totalAmount }}抵扣<span class="text-line-through">¥{{ item.totalAmount }}</span></p>
                                  </template> -->
                                </div>
                                <div class="table-cell cell-line-height">
                                  <template v-if="item.status == 1">提现中</template>  
                                  <template v-else-if="item.status == 2">成功</template>  
                                  <template v-else-if="item.status == 3">失败</template>  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </wc-waterfall>
            </template>
          </infinite-scroll-list>
        </div>
      </div>
    </div>
    <OrderInfo v-if="isOrderInfo" :type="isType" :data="details" @back="findBack" />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, computed } from 'vue';
  import { showPopup } from '@/utils/usePopup';
  import { parseValue } from '@/utils/index';
  import { countList, flowSumMonth } from '@/api/pay';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import BillingSelect from '@/components/TreeSelect/billingSelect.vue'
  import OrderInfo from './orderInfo.vue';
  import { initAOS } from '@/animations/aos';

  const hasMore = ref(true);

   /** 类型切换 **/
   const walletTypeData = ref([
    { label: '任务', value: 1 },
    { label: '作品', value: 2 },
  ]);
  const isType = ref(1);
  const changeWalletType = (val: any) => {
    isType.value = val.value;
    currentFilterCriteria.value.publishType = val.value;
  };

  /** 订单时间 **/
  const orderTime = ref('');
  const addDays = async (days: any) => {
    if(orderTime.value !== '') {
      const date = new Date(orderTime.value);
      date.setMonth(date.getMonth() + days);
      orderTime.value = formatDate(date);
    }
    currentFilterCriteria.value.time = orderTime.value; // 更新 filterCriteria
  };
  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}`;
  };
  orderTime.value = formatDate(new Date());

  /**筛选订单类型 **/
  const isFlag = ref(0);
  const isIncome = ref('');
  /**点击筛选**/
  const findFilterOrderTypeFun = async (value: string, index: number) => {
    isFlag.value = index;
    isIncome.value = value;
    currentFilterCriteria.value.isIncome = value; // 更新 filterCriteria
    const result = await fetchNews(1);
  } 
  const currentFilterCriteria = ref({
    time: orderTime.value,
    dropDownType: isIncome.value,
    publishType: isType.value,
  }); 

  const fetchNews = async (page: number) => {
      let getData = {
        pageNum: page,
        pageSize: 8,
        time: orderTime.value,
        dropDownType: currentFilterCriteria.value.dropDownType,
        publishType: currentFilterCriteria.value.publishType,
      }
      
      console.log(getData);
      try {
        const response = await countList(getData);
        const { code, data, message } = response;

        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }
        findFlowSumMonthFun();
        if(data.rows.length == 0) {
          hasMore.value = false;
          return false;
        } else {
          return data.rows;
        }
        
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
  };

  // 获取月统计
  const statsData = ref({
    spend: '',
    income: '',
    pointSpend: '',
    pointIncome: '',
  });
  const findFlowSumMonthFun = () => {
    let reqData = {
      time: orderTime.value,
      publishType: isType.value
    }
    return new Promise<void>((resolve, reject) => {
      flowSumMonth(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        const res = response.data;
        statsData.value = res;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 下拉框数据
  const isSort = ref(false);
  const selectList = computed(() => {
    if (isType.value === 1) {
      return [
        { id: null, label: '全部账单' },
        { id: 0, label: '我的支出' },
        { id: 1, label: '我的收入' },
      ];
    } else if (isType.value === 2) {
      return [
        { id: null, label: '全部账单' },
        { id: 0, label: '我的支出' },
        { id: 1, label: '我的收入' },
        { id: 2, label: '我的提现' },
      ];
    }
    return []; // 默认返回空数组
  });

  const selectedValue = ref<string>('全部账单');
  // 展开时添加背景色
  const handleOpen = () => {
      isSort.value = true;
  };
  // 展开时移除背景色
  const handleClose = () => {
      isSort.value = false;
  };

  // 筛选列表
  const updateModelValue = (item: any) => {
    selectedValue.value = item.label;
    currentFilterCriteria.value.dropDownType = item.id;
  };


  /** 截取金额进行展示 ***/
  const formatAmount = (amount: number) => {
    const amounts = ref('');
    if(amount !== undefined){
      amounts.value = amount.toString();
    } else {
      return amount;
    }
    const parts = amounts.value.split('.');
    return parts[0];
  };
  const formatAmounts = (amount: number) => {
    const amounts = ref('');
    if(amount !== undefined){
      amounts.value = amount.toString();
    } else {
      return amount;
    }
    const parts = amounts.value.split('.');
    if (parts.length === 2) {
      return parts[1];
    } else {
      return '00';
    }
  };

  // 查看详情
  const isOrderInfo = ref(false);
  const details = ref({});
  const findOrderInfoFun = (item: any) => {
    details.value = item;
    isOrderInfo.value = true;
  };
  const findBack = () => {
    isOrderInfo.value = false;
  };

  onMounted(() => {
    initAOS();
  });
</script>

<style lang='scss' scoped>
  .detail{
    width: 100%;
    height: 100%;
    .detail-container{
      width: 100%;
      height: calc(100% - 100px);
      .wallet-type-table{
        width: auto;
        height: 73px;
        .wallet-type-table-main{
          width: 176px;
          height: 30px;
          padding: 10px;
          border-radius: 6px;
          margin: 12px 0 11px 30px;
          border: 1px solid rgba(255, 255, 255, 0.38);
          display: flex;
          justify-content: space-between;
          .wallet-type-table-item{
            width: 50%;
            height: 30px;
            border-radius: 6px;
            font-weight: 400;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.68);
            line-height: 30px;
            text-align: center;
            cursor: pointer;
          }
          .relievoShadow{
            color: #FFFFFF;
          }
        }
      }
      .detail-header{
        width: 100%;
        height: auto;
        .view-header{
          height: auto;
          padding-left: 30px;
          margin-bottom: 27px;
          display: flex;
          .view-header-icon{
            width: 24px;
            height: auto;
            margin-right: 7px;
            i{
              font-size: 28px;
              color: #FFFFFF;
              display: block;
              line-height: 28px;
            }
          }
          .view-header-title{
            font-weight: 400;
            font-size: 20px;
            color: #FFFFFF;
            line-height: 28px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
        }
        .detail-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .detail-header-flex-l{
            height: auto;
            flex-shrink: 0;
            padding-left: 30px;
            .detail-header-flex-l-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .detail-header-flex-r-main-stats{
                font-weight: 400;
                font-size: 14px;
                color: rgb(255, 255, 255, .7);
                line-height: 28px;
                text-align: left;
                display: inline-block;
                span{
                  margin-right: 20px;
                }
              }
              
            }
          }
          .detail-header-flex-c{
            flex-grow: 1;
          }
          .detail-header-flex-r{
            height: auto;
            flex-shrink: 0;
            padding-right: 46px;
            .detail-header-flex-r-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: flex-start;
              .order-time{
                width: 170px;
                height: auto;
                display: flex;
                justify-content: space-evenly;
                .order-time-icon{
                  width: 24px;
                  height: auto;
                  margin-right: 10px;
                  i{
                    font-size: 24px;
                    color: #FFFFFF;
                    display: block;
                    line-height: 30px;
                  }
                }
                .order-time-main{
                  width: 110px;
                  display: inline-block;
                  :deep(.el-input){
                    width: 100%;
                    height: 100%;
                    .el-input__wrapper{
                      border: none;
                      padding: 0;
                      box-shadow: none;
                      background-color: transparent;
                      &:hover{
                          box-shadow: none;
                      }
                      .el-input__prefix{
                          display: none;
                      }
                      .el-input__inner{
                        border: none;
                        padding: 0;
                        font-size: 16px;
                        line-height: 24px;
                        color: #FFFFFF;
                        background-color: transparent;
                      }
                    }
                  }
                  :deep(.el-date-editor .el-input__inner) {
                    border: 1px solid transparent;
                    border-radius: 4px;
                  }
                }
                .order-time-pperation{
                  display: inline-block;
                  display: flex;
                  .order-time-pperation-left,.order-time-pperation-right{
                    width: 20px;
                    height: 20px;
                    margin: 5px 7px;
                    cursor: pointer;
                    border-radius: 50%;
                    background-color: rgb(255, 255, 255, .06);
                    i{
                      font-size: 12px;
                      color: rgb(255, 255, 255, .7);
                      display: block;
                      line-height: 20px;
                      text-align: center;
                    }
                    &:hover{
                      background-color: rgb(255, 255, 255, .2);
                      i{
                        color: #FFFFFF;
                      }
                    }
                  }
                }
              }
              .detail-header-flex-r-main-orderType{
                width: 100px;
                height: auto;
                margin-left: 10px;
                display: flex;
                justify-content: flex-end;
                .orderType-item{
                  width: 55px;
                  font-weight: 400;
                  font-size: 14px;
                  color: rgb(255, 255, 255, .7);
                  line-height: 28px;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                  cursor: pointer;
                  border-right: 1px solid rgb(255, 255, 255, .38);
                  background-color: rgb(255, 255, 255, .16);
                  &:last-child{
                    border-right: none;
                  }
                }
                .flag{
                  color: #FFFFFF;
                  background-color: rgb(255, 255, 255, .06);
                }
              }
            }
          }
        }
      }
      .detail-content{
        padding: 0 30px;
        height: calc(100% - 25px);
        .detail-content-main{
          width: 100%;
          height: 100%;
          :deep(.el-scrollbar__view){
            padding-top: 32px;
          }
          .list-item{
            width: 100%;
            height: 96px;
            border-radius: 18px;
            overflow: hidden;
            break-inside: avoid;
            margin-bottom: 19px;
            box-shadow: 0px 0px 8px 9px rgb(0, 0, 0, .15);
            background: rgba(229, 229, 229, 0.08);
            backdrop-filter: blur(40px);
            border: 1px solid rgb(255, 255, 255, .38);
            transition: transform 0.2s ease, background 0.2s ease !important;
            &:hover {
              transform: translate(1px, -1px) !important;
              background: rgba(229, 229, 229, 0.18) !important;
            }
            .item-main{
              width: calc(100% - 42px);
              height: 52px;
              padding: 22px 21px;
              .item-main-content{
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                .item-main-content-l{
                  width: 60px;
                  height: 100%;
                  flex-shrink: 0;
                  .trading-content{
                    width: 100%;
                    display: flex;
                    .trading-content-img{
                      width: 52px;
                      height: 52px;
                      flex-shrink:0;
                      margin-right: 23px;
                      border-radius: 8px;
                      overflow: hidden;
                      img{
                        width: 100%;
                        height: 100%;
                        display: block;
                      }
                      i{
                        font-size: 24px;
                        color: rgb(255, 255, 255, .7);
                        text-align: center;
                        line-height: 52px;
                      }
                    }
                    .trading-content-text{
                      flex-grow: 1;
                      font-size: 16px;
                      color: #FFFFFF;
                      line-height: 29px;
                      text-align: left;
                      font-style: normal;
                      text-transform: none;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      line-clamp: 2;
                      -webkit-box-orient: vertical;
                    }
                  }
                }
                .item-main-content-r{
                  flex: 1;
                  width: 0;
                  height: 100%;
                  .content-r-main{
                    width: 100%;
                    height: 100%;
                    .main-table{
                        height: auto;
                        padding: 0 20px;
                        .table {
                            display: table;
                            width: 100%;
                            border-collapse: collapse;
                            table-layout: fixed;
                            .table-row {
                                display: table-row;
                                .table-cell {
                                    display: table-cell;
                                    padding: 8px;
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: left;
                                    &:nth-child(1){
                                      width: auto;
                                      display: block;
                                    }
                                    &:nth-child(2){
                                        width: 150px;
                                    }
                                    &:nth-child(3){
                                        width: 180px;
                                    }
                                    &:nth-child(4){
                                        width: 100px;
                                    }
                                    &:nth-child(5){
                                        width: 70px;
                                    }
                                    .table-cell-main{
                                      width: 100%;
                                      display: block;
                                      white-space: nowrap;
                                      overflow: hidden;
                                      text-overflow: ellipsis;
                                    }
                                }
                                &:last-child{
                                    .table-cell{
                                        vertical-align: middle;
                                    }
                                }
                                .cell-line-height{
                                    line-height: 1;
                                    .cell-main-but{
                                        width: 100%;
                                        height: 35px;
                                        margin: 15px 0;
                                        box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5), /* 外发光 */
                                            -1px 1px 3px rgba(255, 255, 255, 0.5) inset; /* 内发光 */
                                        border-radius: 8px 8px 8px 8px;
                                        border: 1px solid rgba(0, 0, 0, 0.01);
                                        background: rgba(0, 0, 0, 0.2);
                                        backdrop-filter: blur(9px);
                                        i{
                                        font-size: 24px;
                                        color: #FFFFFF;
                                        line-height: 35px;
                                        text-align: center;
                                        white-space: nowrap;
                                        display: block;
                                        }
                                    }
                                }
                                .table-cell-tips{
                                  font-weight: 400;
                                  font-size: 12px;
                                  color: rgb(255, 255, 255, .38);
                                  line-height: 24px;
                                  text-align: left;
                                  margin-top: -5px;
                                }
                            }
                        }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
