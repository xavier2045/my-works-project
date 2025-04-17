<template>
  <div class="wallet">
    <persHeader />
    <div class="wallet-center">
        <!-- <div class="wallet-center-header">
            <div class="header-icon">
              <i class="icon font_family icon-qianbao24" ></i>
            </div>
            <div class="header-title">我的钱包</div>
        </div> -->
        <div class="wallet-center-body">
          <div class="wallet-center-body-main">
            <div class="wallet-income-statistics">
              <div class="wallet-income-statistics-amount">
                <div class="wallet-income-statistics-main">
                  <div class="gross-revenue">
                    <div class="gross-revenue-title">
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
                    </div>
                    <div class="gross-revenue-content">
                      <div class="gross-revenue-content-l">
                        <div class="gross-revenue-content-amount">
                          <div class="amount-left">
                            <template v-if="isAmountVisible">
                              <div class="hidAmount"><span>¥</span>********</div>
                            </template>
                            <template v-else>
                                <template v-if="isType == 1">
                                  <el-statistic :value="Number(amountValue)">
                                    <template #prefix>
                                      ¥
                                    </template>
                                  </el-statistic>
                                </template>
                                <template v-else>
                                  <el-statistic :value="Number(workAmountValue)">
                                    <template #prefix>
                                      ¥
                                    </template>
                                  </el-statistic>
                                </template>
                            </template>
                          </div>
                          <div class="amount-right">
                            <div class="see-revenue back">
                              <div class="see-revenue-icon">
                                <template v-if="isAmountVisible">
                                  <i class="icon font_family icon-biyan24" @click="toggleAmountVisibility(false)"></i>
                                </template>
                                <template v-else>
                                  <i class="icon font_family icon-yingxiangli24" @click="toggleAmountVisibility(true)"></i>
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="gross-revenue-content-tips">恭喜！您日平均作品置信度目前已超过同级用户，请持续发布作品并提高更高的置信度。</div>
                      </div>
                      <div class="gross-revenue-content-r">
                        <div class="withdrawal-of-cash relievoShadow" @click="findWithdrawalOfCash">我要提现</div>
                      </div>
                    </div>
                  </div>
                  <div class="income-ratio">
                    <div class="income-ratio-content">
                      <div class="income-ratio-content-header">
                        <div class="income-ratio-content-header-title">
                          <div class="income-ratio-content-header-title-icon">
                            <div class="title-icon">
                              <i class="icon font_family icon-fenxi24"></i>
                            </div>
                            <div class="title-name">{{ incomeaName }}</div>
                            <div class="title-convert back" @click="toggleConvert">
                              <i class="icon font_family icon-zhuanhuan20"></i>
                            </div>
                          </div>
                        </div>
                        <div class="income-ratio-content-header-select">
                          <div class="income-ratio-content-header-select-main">
                            <!-- <TimeSelect
                              :options="selectList"
                              v-model="selectedValue"
                              @open="handleOpen" 
                              @close="handleClose"
                            /> -->
                            <div class="datePicker">
                              <el-date-picker
                                v-model="selectedValue"
                                type="month"
                                format="YYYY-MM"
                                value-format="YYYY-MM"
                                placeholder="选择月份"
                                :clearable="false"
                                @change="handleChange"
                                @visible-change="dropdownOpen = !dropdownOpen"
                              />
                            </div>
                            <div class="arrow" :class="{ 'open': dropdownOpen }">
                              <template v-if="dropdownOpen">
                                <i class="icon font_family icon-a-jiantouxiangshangshousuo24"></i>
                              </template>
                              <template v-else>
                                <i class="icon font_family icon-a-jiantouxiangxiazhankai24"></i>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="type-data-statistics">
                        <div class="income-statistics">
                          <div
                            class="income-statistics-item"
                            v-for="(item, index) in transitions" 
                            :key="index"
                            :class="isFlag == index ? 'flag' : ''"
                            @click="handleClick(index)"
                          >
                            <div class="item-header">
                              <div class="item-header-title">
                                <div class="item-header-title-name">
                                  <template v-if="item.type === 1"><span class="work"></span>我的作品</template>
                                  <template v-else-if="item.type === 2"><span class="task"></span>我的任务</template>
                                  <template v-else><span class="activity"></span>我的活动</template>
                                </div>
                              </div>
                              <div class="item-delta">
                                <div class="item-delta-main">
                                  <div class="delta-num">
                                    <template v-if="item.delta === 1">
                                      -
                                    </template>
                                    <template v-else-if="item.delta === 2">
                                      +
                                    </template>
                                    {{ item.yoy }}
                                  </div>
                                  <!-- <div class="delta-icon">
                                    <template v-if="item.delta === 1">
                                      <i class="icon font_family icon-xiajiang20"></i>
                                    </template>
                                    <template v-else-if="item.delta === 2">
                                      <i class="icon font_family icon-shangzhang20"></i>
                                    </template>
                                    <template v-else>
                                      <i class="icon font_family icon-jianhao24"></i>
                                    </template>
                                  </div> -->
                                </div>
                              </div>
                            </div>
                            <div class="item-content">
                              <!-- <el-statistic :value="item.outputValue">
                                <template #prefix>
                                  ¥
                                </template>
                              </el-statistic> -->
                              <div class="amount-value">
                                <span>¥</span>
                                <div class="amount-value-main">
                                  <Statistic :NumberData="Number(item.amount)" :amortized= 2 />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="income-share">
                      <EachartsBar v-if="lineTimeData.length > 0" :eachData="lineTimeData" :screen="isScreen" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="wallet-income-statistics-points">
                <div class="points-main">
                  <div class="points-content">
                    <div class="points-title">
                      <div class="points-title-icon">
                        <i class="icon font_family icon-jifen24"></i>
                      </div>
                      <div class="points-title-name">我的积分</div>
                    </div>
                    <div class="points-value">
                      <el-statistic :value="pointsValue">
                      </el-statistic>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="wallet-side-bar">
              <div class="weekly-statistics">
                <div class="weekly-statistics-header">
                  <div class="weekly-statistics-header-title">
                    <div class="weekly-statistics-header-title-icon">
                      <i class="icon font_family icon-xiaoliang24"></i>
                    </div>
                    <div class="weekly-statistics-header-title-name">本周盈收</div>
                  </div>
                </div>
                <div class="weekly-statistics-chart">
                  <FanDiagram v-if="barData.length > 0" :barData="barData" :extraIncome="extraIncome+''" />
                </div>
                <div class="weekly-statistics-footer">
                  <div 
                    class="weekly-statistics-footer-item"
                    v-for="(item, index) in legendData"
                    :key="index"
                  >
                  <template v-if="item.type == 1">
                    <span class="spanColor1"></span>
                  </template>
                  <template v-if="item.type == 2">
                    <span class="spanColor2"></span>
                  </template>
                  <template v-if="item.type == 3">
                    <span class="spanColor3"></span>
                  </template>
                    <div class="item-icon">
                      <i class="icon font_family" :class="`${item.icon}`"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="transaction-detail">
                <div class="transaction-detail-header">
                  <div class="transaction-detail-header-title">
                    <div class="transaction-detail-header-title-icon">
                      <i class="icon font_family icon-zhangdanmingxi24"></i>
                    </div>
                    <div class="transaction-detail-header-title-name">账单明细</div>
                  </div>
                </div>
                <div class="transaction-detail-content">
                  <div 
                    class="transaction-detail-content-item"
                    v-for="(item, index) in lastOrders" 
                    :key="index"
                  >
                    <div class="item-main">
                      <div class="item-main-content">
                        <div class="item-main-content-icon relievoShadow">
                          <!-- 1任务 2作品 3活动 -->
                          <template v-if="item.type === 2">
                            <i class="icon font_family icon-fabuzuopin34"></i>
                          </template>
                          <template v-else-if="item.type === 3">
                            <i class="icon font_family icon-fabuhuodong34"></i>
                          </template>
                          <template v-else-if="item.type === 1">
                            <i class="icon font_family icon-fabuxuqiu34"></i>
                          </template>
                        </div>
                        <div class="item-main-content-info">
                          <div class="item-main-content-info-name">{{ item.name }}</div>
                          <div class="item-main-content-info-money">
                            <span>
                              <template v-if="item.isIncome === 1">+</template>
                              <template v-else>-</template>
                            </span>
                            <div class="item-main-content-info-money-amount">{{ item.totalAmount }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="transaction-detail-header-more relievoShadow" v-if="lastOrders.length > 0" @click="routerPushDetail">
                  <div class="more-name">更多</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <WithdrawalAmount v-if="isWithdrawalAmount" @close="handleCloseWithdrawalAmount" />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import EachartsBar from '@/components/chart/incomeShare.vue'
  import FanDiagram from '@/components/chart/fanDiagram.vue'
  import TimeSelect from '@/components/TreeSelect/timeSelect.vue';
  import { useDynamicValueTransition } from '@/utils/index';
  import { useTransition } from '@vueuse/core';
  import persHeader from '@/components/header/persHeader.vue';
  import Statistic from '@/components/statisticModule/statistic.vue';
  import WithdrawalAmount from '@/components/WithdrawalAmount/index.vue';
  import { countIncomeWeek, countIncome, countList } from '@/api/pay';
  import { showPopup } from '@/utils/usePopup';

  const router = useRouter();
  const taskTotalAmount = ref(0); // 我的任务总营收金额
  const worktotalAmount = ref(0); // 我的作品总营收金额
  const points = ref(0); // 我的积分
  const extraIncome = ref(''); // 本周对比上周增加的金额
  const selectedValue = ref('');
  const isAmountVisible = ref(true);
  const dropdownOpen = ref(false);
  const isWithdrawalAmount = ref(false);
  interface BarDataItem {
    type: number;
    amount: any;
  }
  const barData = ref<BarDataItem[]>([]);

  interface LastOrdersItem {
    type: number;
    name: any;
    isIncome: any;
    totalAmount: any;
  }
  const lastOrders = ref<LastOrdersItem[]>([]);

  const amountValue = useTransition(taskTotalAmount, {
    duration: 3000,
  })
  const pointsValue = useTransition(points, {
    duration: 3000,
  })
  const workAmountValue = useTransition(worktotalAmount, {
    duration: 3000,
  })

  const toggleAmountVisibility = (visible: any) => {
    isAmountVisible.value = visible;
  };

  /** 类型切换 **/
  const walletTypeData = ref([
    { label: '任务总盈收', value: 1 },
    { label: '作品总盈收', value: 2 },
  ]);
  const isType = ref(1);
  const changeWalletType = (val: any) => {
    isType.value = val.value;
    findCountIncomeWeekFun(val.value)
  };
  
  /** 查询条件 **/
  const isSort = ref(false);
  const selectList = ref([
    { label: '最近30天', value: '1' },
    { label: '三个月', value: '2' },
    { label: '六个月', value: '3' },
    { label: '一年', value: '4' },
  ]);
  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}`;
  };
  selectedValue.value = formatDate(new Date());
  
  // 展开时添加背景色
  const handleOpen = () => {
    isSort.value = true;
  };
  // 展开时移除背景色
  const handleClose = () => {
    isSort.value = false;
  };

  const handleChange = (val: any) => {
    console.log('选择的月份值', val);
    findCountIncomeFun();
  };

  /** 获取营收+周数据+账单 **/
  const findCountIncomeWeekFun = (val: number) => {
    let reqData = {
      publishType: val
    }
      return new Promise<void>((resolve, reject) => {
        countIncomeWeek(reqData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              taskTotalAmount.value = Number(resultData.missionAllIncome) || 0;
              worktotalAmount.value = Number(resultData.workAllIncome) || 0;
              points.value = Number(resultData.point) || 0;
              extraIncome.value = resultData.extraIncome;

              barData.value.push(
                {
                  type: 1,
                  amount: resultData.workPercentage
                },
                {
                  type: 2,
                  amount: resultData.missionPercentage
                },
                {
                  type: 3,
                  amount: resultData.activityPercentage
                }
              )
              lastOrders.value = resultData.lastOrders;
              resolve()
          }).catch((error: any) => {
              reject(error)
          })
      })
  };

  interface isIncomeItem {
    type: number;
    amount: any;
    yoy: any;
  }
  const incomeStatistics = ref<isIncomeItem[]>([]);
  /** 收益统计 1作品 2任务 3活动 ***/
  // const incomeStatistics = ref([
  //   {
  //     type: 1,
  //     amount: 564984.041,
  //     yoy: '25%',
  //     delta: 1, // 0:不增不减 1: 减少 2: 增加
  //   },
  //   {
  //     type: 2,
  //     amount: 5984.041,
  //     yoy: '50%',
  //     delta: 2,
  //   },
  //   {
  //     type: 3,
  //     amount: 3467.041,
  //     yoy: '0',
  //     delta: 0,
  //   },
  // ]);

  const isFlag = ref(0); // 默认选中第一个
  const isScreen = ref(0); // 修改图表排序
  const handleClick = (index: number) => {
    isFlag.value = index;
    isScreen.value = index + 1;
  };

  // 为每个item创建outputValue和setTargetValue
  // const transitions = incomeStatistics.value.map(item => {
  //   const { outputValue, setTargetValue } = useDynamicValueTransition(3000);
  //   setTargetValue(item.amount); // 传入每个item的目标值
  //   return {
  //     type: item.type,
  //     amount: item.amount,
  //     yoy: item.yoy,
  //     outputValue,
  //   };
  // });
  const transitions= ref();

  const incomeaName = ref('我的收入分析');
  const isConvert = ref(true);
  const toggleConvert = () => {
    isConvert.value = !isConvert.value;
    if(isConvert.value) {
      incomeaName.value = '我的收入分析';
    } else {
      incomeaName.value = '我的支出分析';
    }
    findCountIncomeFun();
  };

  const lineTimeData = ref([]);
  /** 我的收支出比例+柱状 **/
  const findCountIncomeFun = () => {
    let reqData = {
      time: selectedValue.value,
      isIncome: isConvert.value ? 1 : 0
    }
      return new Promise<void>((resolve, reject) => {
        countIncome(reqData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              incomeStatistics.value = [];
              incomeStatistics.value.push(
                {
                  type: 1,
                  amount: Number(resultData.workAmount) || 0,
                  yoy: Number(resultData.workAmountSequential) || 0,
                },
                {
                  type: 2,
                  amount: Number(resultData.missionAmount) || 0,
                  yoy: Number(resultData.missionAmountSequential) || 0,
                },
                {
                  type: 3,
                  amount: Number(resultData.activityAmount) || 0,
                  yoy: Number(resultData.activityAmountSequential) || 0,
                }
              )
              transitions.value = (incomeStatistics.value || []).map(item => {
                const { outputValue, setTargetValue } = useDynamicValueTransition(3000);
                setTargetValue(item.amount); // 传入每个item的目标值
                return {
                  type: item.type,
                  amount: item.amount,
                  yoy: item.yoy,
                  outputValue,
                };
              });
              lineTimeData.value= [];
              isScreen.value = 0;
              lineTimeData.value = resultData.lineTimeData;
              resolve()
          }).catch((error: any) => {
              reject(error)
          })
      })
  };


  /** 饼图图例 **/
  const legendData = ref([
    {
      type: 1,
      name: '作品',
      color: '#FFFFFF',
      icon: 'icon-fabuzuopin34',
    },
    {
      type: 2,
      name: '任务',
      icon: 'icon-fabuxuqiu34',
      color: 'rgba(255, 255, 255, 0.68)',
    },
    {
      type: 3,
      name: '活动',
      icon: 'icon-fabuhuodong34',
      color: 'rgba(255, 255, 255, 0.38)',
    }
  ])

  /** 跳转账单明细 ***/
  const routerPushDetail = () => {
    router.push({
      name: 'BillingDetail'
    })
  }

  /** 提现 **/
  const findWithdrawalOfCash = () => {
    isWithdrawalAmount.value = !isWithdrawalAmount.value;
  }

  const handleCloseWithdrawalAmount = () => {
    isWithdrawalAmount.value = false;
  }
    
  onMounted(() => {
    findCountIncomeWeekFun(1);
    findCountIncomeFun();
  })
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/common.scss';
  .wallet{
    width: 100%;
    height: calc(100% - 65px);
    .wallet-center{
      height: calc(100% - 90px);
      padding: 0 30px;
      .wallet-center-header{
        width: 100%;
        display: flex;
        .header-icon{
          width: 32px;
          height: auto;
          flex-shrink: 0;
          i{
            font-size: 24px;
            color: #FFFFFF;
            margin-right: 10px;
            text-align: left;
            line-height: 1;
          }
        }
        .header-title{
          flex: 1;
          font-weight: 400;
          font-size: 20px;
          color: #FFFFFF;
          line-height: 1;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
      .wallet-center-body{
        width: 100%;
        height: calc(100% - 25px);
        padding-top: 22px;
        .wallet-center-body-main{
          width: 100%;
          height: 100%;
          display: flex;
          .wallet-income-statistics{
            flex: 1;
            width: 0;
            position: relative;
            border-radius: 24px;
            
            .wallet-income-statistics-amount{
              width: 100%;
              height: 100%;
              mask-image: url(@/assets/images/common/purseBg.png);
              -webkit-mask-image: url(@/assets/images/common/purseBg.png);
              mask-repeat: no-repeat;
              -webkit-mask-repeat: no-repeat;
              mask-size: 100% 100%;
              background-color: rgba(229,229,229,0.16);
              backdrop-filter: blur(40px);
              background: url(@/assets/images/common/purseBg_bg.png) no-repeat;
              background-size: 100% 100%;
              box-shadow: 8px 0px 38px 0px rgb(0, 0, 0, .15);
              .wallet-income-statistics-main{
                width: calc(100% - 60px);
                height: calc(100% - 42px);
                padding: 12px 30px 30px 34px;
                .gross-revenue{
                  width: 100%;
                  height: auto;
                  .gross-revenue-title{
                    width: 100%;
                    height: auto;
                    display: flex;
                    margin-bottom: 6.5px;
                    .gross-revenue-title-icon{
                      width: 24px;
                      height: auto;
                      margin-right: 10px;
                      i{
                        font-size: 24px;
                        color: #FFFFFF;
                        display: block;
                        line-height: 73px;
                      }
                    }
                    .gross-revenue-title-text{
                      font-size: 20px;
                      color: #FFFFFF;
                      line-height: 73px;
                      text-align: left;
                      font-style: normal;
                      text-transform: none;
                      display: flex;
                      justify-content: flex-start;
                    }
                    .wallet-type-table{
                      width: auto;
                      height: 73px;
                      .wallet-type-table-main{
                        width: 210px;
                        height: 30px;
                        padding: 10px;
                        border-radius: 6px;
                        margin: 12px 0 11px 0;
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
                  }
                  .gross-revenue-content{
                    width: 100%;
                    height: auto;
                    display: flex;
                    .gross-revenue-content-l {
                      flex: 1;
                      width: 0;
                      .gross-revenue-content-amount{
                        width: 100%;
                        height: auto;
                        display: flex;
                        justify-content: flex-start;
                        .amount-left{
                          display: inline-block;
                          .hidAmount{
                            width: 100%;
                            height: 65px;
                            font-weight: 400;
                            font-size: 58px;
                            color: #FFFFFF;
                            line-height: 65px;
                            text-align: left;
                            font-style: normal;
                            text-transform: none;
                            span{
                              margin-right: 7px;
                            }
                          }
                          .amount-value{
                            width: 100%;
                            height: 65px;
                            font-weight: 400;
                            font-size: 58px;
                            color: #FFFFFF;
                            line-height: 1;
                            text-align: left;
                            font-style: normal;
                            text-transform: none;
                            span{
                              margin-right: 7px;
                              display: inline-block;
                            }
                            .amount-value-main{
                              display: inline-block;
                            }
                          }
                          :deep(.el-statistic){
                            font-size: 58px;
                            .el-statistic__content{
                              .el-statistic__number{
                                font-size: 58px;
                              }
                              .el-statistic__prefix{
                                font-size: 58px;
                              }
                              .el-statistic__suffix{
                                span{
                                  font-size: 58px;
                                }
                              }
                            }
                          }
                        }
                        .amount-right {
                          display: inline-block;
                          .see-revenue{
                            line-height: 65px;
                            display: inline-block;
                            .see-revenue-icon{
                              width: 100%;
                              height: 100%;
                              i{
                                font-size: 18px;
                                color: #FFFFFF;
                                display: block;
                                text-align: center;
                              }
                            }
                          }
                        }
                      }
                      .gross-revenue-content-tips{
                        font-weight: 400;
                        font-size: 14px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 1.5;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        margin-top: 0;
                      }
                    }
                    .gross-revenue-content-r {
                      width: 92px;
                      height: auto;
                      flex-shrink: 0;
                      margin-left: 50px;
                      .withdrawal-of-cash{
                        width: 82px;
                        height: 42px;
                        margin-top: 25px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 400;
                        font-size: 14px;
                        color: rgb(255, 255, 255, 1);
                        text-align: center;
                        line-height: 42px;
                      }
                    }
                  }
                }
                .income-ratio{
                  width: 100%;
                  height: auto;
                  margin-top: 25px;
                  .income-ratio-content{
                    width: 100%;
                    height: auto;
                    .income-ratio-content-header{
                      width: 100%;
                      height: auto;
                      display: flex;
                      justify-content: space-between;
                      .income-ratio-content-header-title{
                        display: inline-block;
                        .income-ratio-content-header-title-icon{
                          display: flex;
                          justify-content: center;
                          .title-icon{
                            width: 24px;
                            height: auto;
                            margin-right: 7px;
                            i{
                              font-size: 24px;
                              color: #FFFFFF;
                              display: block;
                              line-height: 73px;
                            }
                          }
                          .title-name{
                            font-weight: 400;
                            font-size: 20px;
                            color: #FFFFFF;
                            line-height: 73px;
                            text-align: left;
                            font-style: normal;
                            text-transform: none;
                          }
                          .title-convert{
                            width: 73px;
                            height: auto;
                            margin-left: 7px;
                            cursor: pointer;
                            i{
                              font-size: 24px;
                              color: #FFFFFF;
                              display: block;
                              line-height: 73px;
                              text-align: center;
                            }
                          }
                        }
                      }
                      .income-ratio-content-header-select{
                        display: inline-block;
                        .income-ratio-content-header-select-main{
                          width: 125px;
                          border-radius: 16px;
                          font-weight: 400;
                          font-size: 14px;
                          color: #FFFFFF;
                          line-height: 73px;
                          text-align: left;
                          font-style: normal;
                          text-transform: none;
                          cursor: pointer;
                          position: relative;
                          .datePicker {
                            width: 100%;
                          }
                          .arrow {
                            width: 30px;
                            height: 30px;
                            flex-shrink: 0;
                            margin: 0 2.5px;
                            position: absolute;
                            top: 22px;
                            right: 10px;
                            z-index: -1;
                            display: inline-block;
                            transition: transform 0.2s;
                            background: url(@/assets/images/task/back_bg.png) no-repeat center center;
                            background-size: 100% 100%;
                            &:hover{
                                background: url(@/assets/images/task/back_bg_hover.png) no-repeat center center;
                                background-size: 100% 100%;
                            }
                            i {
                              font-size: 14px;
                              color: #FFFFFF;
                              line-height: 30px;
                              display: block;
                              text-align: center;
                            }
                          }
                          .open {
                            transition: transform 0.2s;
                          }
                          :deep(.el-input__suffix){
                            width: 12px;
                            display: none;
                            .el-input__suffix-inner{
                              width: 12px;
                              i{
                                font-size: 14px;
                              }
                            }
                          } 
                          :deep(.el-input){
                              width: 100%;
                              height: 100%;
                              .el-input__wrapper{
                                  border: none;
                                  box-shadow: none;
                                  background-color: transparent;
                                  &:hover{
                                      box-shadow: none;
                                  }
                                  .el-input__prefix{
                                      display: none;
                                  }
                              }
                          }
                          :deep(.el-input__inner){
                              border: none;
                              font-size: 16px;
                              line-height: 48px;
                              color: #FFFFFF;
                              padding-left: 0;
                              padding-right: 0;
                              background-color: transparent;
                          }
                        }
                      }
                    }
                    .type-data-statistics{
                      width: 100%;
                      height: auto;
                      padding-top: 21px;
                      .income-statistics{
                        width: 100%;
                        height: auto;
                        display: flex;
                        justify-content: space-between;
                        .income-statistics-item{
                          width: 191px;
                          cursor: pointer;
                          display: inline-block;
                          padding: 18px 20px 30px 20px;
                          border-radius: 18px;
                          border: 1px solid transparent;
                          background-color: rgb(0, 0, 0, .12);
                          backdrop-filter: blur(24px);
                          &:hover{
                            background-color: rgb(0, 0, 0, .06);
                            // transition: transform 0.3s ease;
                          }
                          .item-header{
                            width: 100%;
                            height: auto;
                            display: flex;
                            justify-content: space-between;
                            .item-header-title{
                              display: inline-block;
                              .item-header-title-name{
                                font-weight: 400;
                                font-size: 16px;
                                color: #FFFFFF;
                                line-height: 24px;
                                text-align: left;
                                font-style: normal;
                                text-transform: none;
                                display: flex;
                                span{
                                  width: 8px;
                                  height: 8px;
                                  display: block;
                                  border-radius: 4px;
                                  margin: 8px 8px 8px 0;
                                }
                                .task{background-color: rgba(255, 255, 255, 0.68);}
                                .work{background-color: #FFFFFF;}
                                .activity{background-color: rgba(255, 255, 255, 0.38);}
                              }
                            }
                            .item-delta{
                              display: inline-block;
                              .item-delta-main{
                                display: flex;
                                justify-content: flex-end;
                                .delta-num{
                                  font-weight: 400;
                                  font-size: 14px;
                                  color: #FFFFFF;
                                  line-height: 24px;
                                  text-align: left;
                                  font-style: normal;
                                  text-transform: none;
                                }
                                .delta-icon{
                                  width: 24px;
                                  height: auto;
                                  margin-left: 7px;
                                  i{
                                    font-size: 24px;
                                    color: rgb(255, 255, 255, .7);
                                    display: block;
                                    line-height: 24px;
                                    text-align: center;
                                  }
                                }
                              }
                            }
                          }
                          .item-content{
                            width: 100%;
                            height: auto;
                            margin-top: 15px;
                            .amount-value{
                              width: 100%;
                              font-weight: 400;
                              font-size: 28px;
                              color: #FFFFFF;
                              line-height: 28px;
                              text-align: left;
                              font-style: normal;
                              text-transform: none;
                              span{
                                margin-right: 7px;
                                display: inline-block;
                              }
                              .amount-value-main{
                                display: inline-block;
                              }
                            }
                            :deep(.el-statistic){
                              font-size: 28px;
                              .el-statistic__content{
                                .el-statistic__number{
                                  font-size: 28px;
                                }
                                .el-statistic__prefix{
                                  font-size: 28px;
                                }
                                .el-statistic__suffix{
                                  span{
                                    font-size: 28px;
                                  }
                                }
                              }
                            }
                          }
                        }
                        .flag {
                          border: 1px solid rgba(255,255,255,0.38);
                          background-color: rgb(0, 0, 0, .06);
                          backdrop-filter: blur(65px);
                        }
                      }
                    }
                  }
                  .income-share{
                    width: 100%;
                  }
                }
              }
            }
            .wallet-income-statistics-points{
              width: 260px;
              height: 58px;
              mask-image: url(@/assets/images/common/pointsBg.png);
              -webkit-mask-image: url(@/assets/images/common/pointsBg.png);
              mask-repeat: no-repeat;
              -webkit-mask-repeat: no-repeat;
              mask-size: 100% 100%;
              background: rgba(229,229,229,0.16);
              backdrop-filter: blur(40px);
              background: url(@/assets/images/common/pointsBg_bg.png) no-repeat;
              background-size: 100% 100%;
              box-shadow: 8px 0px 38px 0px rgb(0, 0, 0, .15);
              position: absolute;
              top: 0;
              right: 0;
              .points-main{
                width: 100%;
                height: 100%;
                .points-content{
                  display: flex;
                  justify-content: center;
                  .points-title{
                    display: flex;
                    justify-content: center;
                    .points-title-icon{
                      width: 24px;
                      height: auto;
                      i{
                        font-size: 24px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 58px;
                        display: block;
                      }
                    }
                    .points-title-name{
                      font-weight: 400;
                      font-size: 20px;
                      color: #FFFFFF;
                      line-height: 58px;
                      text-align: left;
                      margin: 0 10px;
                    }
                  }
                  .points-value{
                    font-weight: 500;
                    font-size: 30px;
                    color: #FFFFFF;
                    line-height: 58px;
                    text-align: left;
                  }
                }
              }
            }
          }
          .wallet-side-bar{
            width: 301px;
            flex-shrink: 0;
            height: auto;
            margin-left: 20px;
            .weekly-statistics{
              width: 299px;
              height: 365px;
              border-radius: 24px;
              box-shadow: 8px 0px 38px 0px rgb(0, 0, 0, .15);
              border: 1px solid rgb(255, 255, 255, .38);
              background: rgba(229,229,229,0.16);
              backdrop-filter: blur(40px);
              .weekly-statistics-header{
                height: auto;
                padding: 30px 33px 0 33px;
                .weekly-statistics-header-title{
                  width: 100%;
                  height: auto;
                  display: flex;
                  justify-content: flex-start;
                  .weekly-statistics-header-title-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 24px;
                      text-align: center;
                    }
                  }
                  .weekly-statistics-header-title-name{
                    font-weight: 400;
                    font-size: 18px;
                    color: #FFFFFF;
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                  }
                }
              }
              .weekly-statistics-chart{
                width: 100%;
                height: 251px;
              }
              .weekly-statistics-footer{
                width: 100%;
                height: 60px;
                display: flex;
                justify-content: space-evenly;
                .weekly-statistics-footer-item{
                  display: flex;
                  span{
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    display: block;
                    margin: 7.5px 0;
                  }
                  .spanColor1{
                    background-color: #FFFFFF;
                  }
                  .spanColor2{
                    background-color: rgba(255, 255, 255, 0.68);
                  }
                  .spanColor3{
                    background-color: rgba(255, 255, 255, 0.38);
                  }
                  .item-icon{
                    width: 24px;
                    height: auto;
                    margin-left: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 24px;
                      text-align: center;
                    }
                  }
                }
              }
            }
            .transaction-detail{
              width: 257px;
              height: calc(100% - 400px);
              margin-top: 30px;
              border-radius: 24px;
              padding: 0 21px;
              box-shadow: 8px 0px 38px 0px rgb(0, 0, 0, .15);
              border: 1px solid rgb(255, 255, 255, .38);
              background: rgba(229,229,229,0.16);
              backdrop-filter: blur(40px);
              .transaction-detail-header{
                width: 100%;
                height: auto;
                display: flex;
                padding: 26px 0;
                justify-content: space-between;
                .transaction-detail-header-title{
                  display: flex;
                  .transaction-detail-header-title-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 28px;
                      text-align: center;
                    }
                  }
                  .transaction-detail-header-title-name{
                    font-weight: 400;
                    font-size: 18px;
                    color: #FFFFFF;
                    line-height: 28px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                  }
                }
              }
              .transaction-detail-content{
                width: 100%;
                .transaction-detail-content-item{
                  width: 100%;
                  height: auto;
                  padding-top: 12px;
                  border-top: 1px solid rgba(255,255,255,0.38);
                  &:last-child{
                    border-bottom: 1px solid rgba(255,255,255,0.38);
                  }
                  .item-main{
                    width: 100%;
                    height: auto;
                    .item-main-content{
                      width: 100%;
                      height: auto;
                      padding-bottom: 12px;
                      display: flex;
                      .item-main-content-icon{
                        width: 42px;
                        height: 42px;
                        flex-shrink: 0;
                        margin-right: 15px;
                        border-radius: 50%;
                        i{
                          font-size: 24px;
                          color: rgba(255, 255, 255, 0.8);
                          display: block;
                          line-height: 42px;
                          text-align: center;
                        }
                      }
                      .item-main-content-info{
                        flex: 1;
                        width: 0;
                        .item-main-content-info-name{
                          width: 100%;
                          height: auto;
                          font-weight: 400;
                          font-size: 16px;
                          color: #FFFFFF;
                          line-height: 24px;
                          text-align: left;
                          font-style: normal;
                          text-transform: none;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        }
                        .item-main-content-info-money{
                          width: 100%;
                          height: auto;
                          font-weight: 400;
                          font-size: 16px;
                          color: #FFFFFF;
                          line-height: 1;
                          text-align: left;
                          font-style: normal;
                          text-transform: none;
                          display: flex;
                          span{
                            display: inline-block;
                            margin-right: 3px;
                          }
                          .item-main-content-info-money-amount{
                            flex: 1;
                          }
                        }
                      }
                    }
                  }
                }
              }
              .transaction-detail-header-more{
                width: 83px;
                height: 32px;
                margin: 0 auto;
                border-radius: 12px;
                margin-top: 19px;
                cursor: pointer;
                border: 1px solid rgb(255, 255, 255, .38);
                .more-name{
                  font-weight: 400;
                  font-size: 14px;
                  color: #FFFFFF;
                  line-height: 32px;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                }
              }
            }
          }
        }
      }
    }
  }
  :deep(.el-statistic){
    font-size: 58px;
    .el-statistic__content{
      .el-statistic__number{
        font-weight: 500;
        color: #FFFFFF;
        line-height: 1;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .el-statistic__prefix{
        margin-right: 9px;
        color: rgba(255, 255, 255, 0.8);
      }
      .el-statistic__suffix{
        color: rgba(255, 255, 255, 0.8);
        span{
        }
      }
    }
  }
</style>
