<template>
    <div class="popupModal" @click="findClose" v-if="isToBePaid">
      <div class="masking"></div>
      <div class="personInCharge-center toBePaid" @click.stop>
        <div class="personInCharge-center-inof">
          <div class="personInCharge-center-module"></div>
          <div class="personInCharge-center-main">
            <div class="personInCharge-center-title">待支付</div>
            <div class="personInCharge-center-list">
              <div class="applies-list">
                <div 
                  v-for="(item, index) in toBePaid" 
                  :key="item.id || index"
                  class="applies-list-item"
                >
                  <div class="item-content">
                    <div class="item-content-left">
                      <div class="item-content-left-main">
                        <div class="item-content-left-main-avatar">
                          <img :src="item.cover" alt="" />
                        </div>
                        <div class="item-content-left-main-info">
                          <div class="item-content-left-main-info-name">
                            <span>剩</span>
                            <CountdownComponent
                              :type="1"
                              :order-time="item.createTime"
                              :validity-minutes="item.minute"
                              @countdown-finished="handleCountdownFinished"
                            />
                            <span>自动取消</span>
                          </div>
                          <div class="item-content-left-main-info-tips">{{ item.name }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="item-content-right">
                      <div 
                        class="item-content-right-btn relievoShadow" 
                        @click="navigateToPayment(item)"
                      >
                        立即支付
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import CountdownComponent from '@/components/CountdownComponent/index.vue';
    import { showPopup } from '@/utils/usePopup';
    import { setItem } from '@/utils';
    import { orderPending } from '@/api/pay';
    import { aeUseStore } from '@/stores/user';
    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
  
    interface PaymentItem {
        id: number;
        businessId: number;
        businessType: number;
        minute: number;
        createTime: string;
        name: string;
        cover: string;
    }
  
  export default defineComponent({
    name: 'ToBePaid',
    components: {
      CountdownComponent,
    },
    
    setup() {
      const router = useRouter();
      const isToBePaid = ref(false);
      const toBePaid = ref<PaymentItem[]>([]);
  
      // 获取待支付数据
      const fetchPendingPayments = async (): Promise<void> => {
        try {
          const response = await orderPending({});
          const { code, data, message } = response;
          
          if (code !== 200) {
            showPopup(message, 'error', 3000);
            return;
          }
  
          toBePaid.value = data;
          checkAndShowPopup();
        } catch (error) {
          console.error('Failed to fetch pending payments:', error);
        }
      };
  
      // 检查是否显示弹窗
      const checkAndShowPopup = () => {
        if (toBePaid.value.length > 0) {
          isToBePaid.value = true;
        } else {
          showPopup('暂无待支付订单！', 'error', 3000);
        }
      };
      watch(() => userInfo.isToBePaid, (newVal) => {
          console.log('Works updated:', newVal);
          isToBePaid.value = newVal;
      });
  
      // 关闭弹窗
      const findClose = () => {
        isToBePaid.value = !userInfo.isToBePaid
        userInfo.isToBePaid = false;
      };
  
      // 处理倒计时结束
      const handleCountdownFinished = () => {
        fetchPendingPayments();
      };
  
      // 导航到支付页面
      const navigateToPayment = (item: PaymentItem) => {
        const routeMap: Record<number, { name: string; typeKey: string; typeValue: number }> = {
          2: { name: 'TataskDetails', typeKey: 'taskType', typeValue: 2 },
          4: { name: 'TataskDetails', typeKey: 'taskType', typeValue: 3 },
          6: { name: 'TeamDetails', typeKey: 'daoType', typeValue: 2 },
          8: { name: 'subTaskDetails', typeKey: 'subTaskType', typeValue: 2 },
          10: { name: 'DaoDetails', typeKey: 'subTaskType', typeValue: 2 },
          12: { name: 'DaoDetails', typeKey: 'subTaskType', typeValue: 2 },
        };
  
        const routeConfig = routeMap[item.businessType];
        if (!routeConfig) return;
  
        // 设置用户信息
        const userInfos = {
          minute: item.minute,
          createTime: item.createTime,
          businessType: item.businessType,
          [routeConfig.typeKey]: routeConfig.typeValue,
        };
  
        // 存储到本地
        Object.entries(userInfos).forEach(([key, value]) => {
          setItem(key, value);
        });
  
        // 导航
        router.push({ 
          name: routeConfig.name, 
          params: { id: String(item.businessId) }
        });
  
        if ([10, 12].includes(item.businessType)) {
          isToBePaid.value = false;
        }
      };
  
      return {
        userInfo,
        isToBePaid,
        toBePaid,
        findClose,
        navigateToPayment,
        handleCountdownFinished,
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
    .popupModal{
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9;
        .masking{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0,0,0,0);
        }
        .personInCharge-center{
            width: 543px;
            height: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .personInCharge-center-inof{
                height: auto;
                position: relative;
                border-radius: 24px;
                overflow: hidden;
                padding: 41px 0 40px 0;
                border: 1px solid rgb(255, 255, 255, .38);
                box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
                .personInCharge-center-module{
                    width: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    
                    background: rgba(0, 0, 0, 0.16);
                    backdrop-filter: blur(30px);
                }
                .personInCharge-center-main{
                    width: 100%;
                    height: auto;
                    .createTeam-center-title{
                        width: 100%;
                    }
                    .personInCharge-center-title{
                        width: 100%;
                        font-size: 20px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: center;
                        font-style: normal;
                        text-transform: none;
                        margin-bottom: 19px;
                    }
                    .personInCharge-center-list{
                        height: auto;
                        margin: 6px 20px 0 27px;
                        .applies-list{
                            max-height: 430px;
                            overflow-y: auto;
                            padding-right: 10px;
                            &:focus-visible{
                                outline: none;
                            }
                            @supports (-moz-appearance: none) {
                                scrollbar-width: thin;

                                ::-moz-scrollbar-track {
                                    background-color: rgba(225,225,225,0);  /* 轨道颜色 */
                                    border-radius: 2px;
                                }

                                ::-moz-scrollbar-thumb {
                                    background-color: rgba(225,225,225,0.2);  /* 滑块颜色 */
                                    border-radius: 2px;
                                    width: 4px;
                                }

                                ::-moz-scrollbar-thumb:hover {
                                background-color: rgba(225,225,225,0.2);  /* 悬停时滑块颜色 */
                                }
                            }
                            /* 通用滚动条样式 */
                            &::-webkit-scrollbar { /* 整个滚动条 */
                                width: 4px; /* 滚动条宽度 */
                            }
                            &::-webkit-scrollbar-track { /* 滚动条轨道 */
                                background: rgba(225,225,225,0); 
                            }
                            &::-webkit-scrollbar-thumb { /* 滚动条滑块 */
                                background: rgba(225,225,225,0.2); 
                                border-radius: 2px;
                            }
                            &::-webkit-scrollbar-thumb:hover { /* 鼠标悬停时滚动条滑块样式 */
                                background: rgba(225,225,225,0.2); 
                            }
                            .applies-list-item{
                                width: 100%;
                                height: auto;
                                padding: 16px 0;
                                border-top: 1px solid rgba(255, 255, 255, .2);
                                .item-content{
                                    width: 100%;
                                    height: auto;
                                    display: flex;
                                    .item-content-left{
                                        flex: 1;
                                        .item-content-left-main{
                                            width: 100%;
                                            height: auto;
                                            display: flex;
                                            .item-content-left-main-avatar{
                                                width: 52px;
                                                height: 52px;
                                                border-radius: 50%;
                                                overflow: hidden;
                                                margin-right: 10px;
                                                img{
                                                    width: 100%;
                                                    height: 100%;
                                                    object-fit: cover;
                                                    object-position: center;
                                                }
                                            }
                                            .item-content-left-main-info{
                                                flex: 1;
                                                .item-content-left-main-info-name{
                                                    width: 100%;
                                                    font-size: 16px;
                                                    line-height: 1;
                                                    text-align: left;
                                                    font-style: normal;
                                                    text-transform: none;
                                                    margin-top: 4px;
                                                    display: flex;
                                                    justify-content: flex-start;
                                                    span{
                                                        &:nth-child(1){
                                                            color: rgb(255, 255, 255, .7);
                                                        }
                                                        &:nth-child(2){
                                                            padding: 0 5px;
                                                            color: rgb(255, 255, 255, 1);
                                                        }
                                                        &:nth-child(3){
                                                            color: rgb(255, 255, 255, .7);
                                                        }
                                                    }
                                                }
                                                .item-content-left-main-info-tips{
                                                    width: 100%;
                                                    font-size: 14px;
                                                    color: #FFFFFF;
                                                    line-height: 1;
                                                    text-align: left;
                                                    font-style: normal;
                                                    text-transform: none;
                                                    margin-top: 13px;
                                                }
                                            }
                                        }
                                    }
                                    .item-content-right{
                                        width: 106px;
                                        flex-shrink: 0;
                                        margin-left: 10px;
                                        .item-content-right-btn{
                                            width: 100%;
                                            height: 38px;
                                            cursor: pointer;
                                            font-size: 16px;
                                            color: #FFFFFF;
                                            line-height: 38px;
                                            text-align: center;
                                            border-radius: 12px;
                                            border: 1px solid rgb(255, 255, 255, .38);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .close{
                width: 34px;
                height: 34px;
                cursor: pointer;
                margin: 30px auto 0 auto;
                i{
                    font-size: 34px;
                    color: #000000;
                    display: block;
                }
            }
        }
    }
  </style>