<template>
    <div class="popupModal" @click="findShowApy">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper" @click.stop>
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="password-from">
                  <!-- 0 关闭，1 开启 -->
                  <template v-if="isType == 2">
                    <div class="points-open ">
                      <div class="pay-bg-mask"></div>
                      <div class="pay-bg">
                        <div class="pay-content">
                          <div class="pay-content-body">
                            <div class="pay-make-up">
                              <div class="pay-make-up-amount">¥<span>{{ payAmount }}</span></div>
                              <div class="pay-make-up-tips">使用{{ payAmount }}积分抵{{ payAmount }}元</div>
                              <div class="pay-make-up-btn-group">
                                <div class="pay-make-up-close ae-btn" @click="findShowApy">取消</div>
                                <div class="pay-make-up-btn ae-btn" @click="pointsDeduction">立即支付</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="points-close">
                      <div class="pay-bg-mask default-mask"></div>
                      <div class="pay-bg">
                        <div class="pay-content">
                          <div class="pay-content-body">
                            <div class="pay-make-up">
                              <div class="pay-make-up-title">
                                <span>支付剩余时间：</span>
                                <span>
                                  <template v-if="!hiddenTime">
                                    <CountdownComponent
                                      :type="1"
                                      :orderTime="createTime"
                                      :validityMinutes="minute"
                                      @countdownFinished="handleCountdownFinished"
                                    />
                                  </template>
                                  <template v-else>
                                    该订单已到期
                                  </template>
                                </span>
                              </div>
                              <div class="pay-make-up-amount">¥{{ payAmount }}</div>
                              <div class="pay-qr-code" v-if="qrCodeData.payUrl !== ''">
                                <template v-if="!hiddenTime">
                                  <PayQrCode
                                    :qrData="qrCodeData"
                                    :size="128"
                                    foregroundColor="#FFFFFF"
                                  />
                                </template>
                                <template v-else>
                                  <span>该订单已到期,请重新发起订单</span>
                                </template>
                              </div>
                              <div class="pay-make-up-icon">
                                <div class="pay-make-up-icon-main">
                                  <div class="icon-line-l"></div>
                                  <div class="icon-line-c">
                                    <div class="icon-line-c-main">
                                      <div class="icon-line-c-main-bg"></div>
                                      <div class="icon-line-c-main-img">
                                        <img :src="payIconUrl" alt="" />
                                      </div>
                                    </div>
                                  </div>
                                  <div class="icon-line-r"></div>
                                </div>
                              </div>
                              <div class="pay-make-up-tips">支持支付宝、微信、数字人民币、云闪付扫码支付</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
    import { defineComponent, onMounted, ref,  } from 'vue';
    import PayQrCode from '@/components/pay/payQrCode.vue';
    import payIconUrl from '@/assets/images/common/pay.png';
    import CountdownComponent from '@/components/CountdownComponent/index.vue';
    import { aeUseStore } from '@/stores/user';
  
    export default defineComponent({
      name: 'payBg',
      components: {
        PayQrCode,
        CountdownComponent
      },
      props: {
        payData: {
            type: Object,
            required: true
        },
      },
      setup(props, { emit }) {
        const payAmount = ref(0); // 总金额
        const poundage = ref(0);  // 手续费
        const isType = ref(0); // 支付方式  1: 聚合支付 2：积分支付
        const mps = ref(0);  // 质押金
        const tips = ref(''); // 提示
        const createTime = ref(''); // 订单开启时间
        const minute = ref(0); // 倒计时分钟数
        const isShowApy = ref(true);
        const contain = ref('含');
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;

        payAmount.value = props.payData.payAmount;
        poundage.value = props.payData.poundage;
        isType.value = props.payData.type;
        mps.value = props.payData.mps;
        createTime.value = props.payData.createTime;
        minute.value = Number(props.payData.minute);

        if (poundage.value !==0 && poundage.value  !== null && poundage.value  !== undefined) {
          tips.value = contain.value + `手续费${poundage.value}元`;
          if (mps.value  !==0 && mps.value  !== null && mps.value  !== undefined) {
            tips.value = contain.value +`质押金${mps.value}元`+ ',' + `手续费${poundage.value}元`;
          }
        }

        const pointsDeduction = () => {
          emit('button-click');
        };

        // 获取二维码数据
        const qrCodeData = ref('');
        console.log(props);
        qrCodeData.value = props.payData.payUrl;
        
         /**  倒计时结束回调 **/
        const hiddenTime = ref(false);
        const handleCountdownFinished = () => {
            console.log('倒计时结束');
            hiddenTime.value = true;
            emit('close'); 
        };

        /** 关闭弹框 **/
        const findShowApy = () => {
          userInfo.personaHome += 1;
          emit('close'); 
        };

        onMounted(() => {
          
        })
    
        return {
          mps,
          tips,
          minute,
          isType,
          contain,
          poundage,
          payAmount,
          qrCodeData,
          isShowApy,
          payIconUrl,
          createTime,
          hiddenTime,
          findShowApy,
          pointsDeduction,
          handleCountdownFinished
        };
      },
    });
  </script>
  
  <style scoped lang="scss">
  @use '@/assets/styles/common.scss';
  .popupModal{
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99 !important;
    .modal-mask{
        width: 100%;
        height: 100%;
        position: relative;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,0);
    }
    .popupModal-wrapper{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .popupModal-wapper-center{
        position: relative;
        overflow: hidden;
        .popupModal-wrapper-mask{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
        }
        .password-from{
          width: 100%;
          height: auto;
          isolation: isolate;
          border-radius: 32px;
          .pay-bg-mask{
            position: absolute;
            top: 48px;
            left: 60px;
            z-index: -1;
            border-radius: 32px;
            overflow: hidden;
            background-color: rgb(0, 0, 0, .16);
            backdrop-filter: blur(24px);
          }
          .pay-bg{
            .pay-content{
              padding: 0 42px;
              height: 100%;
              .pay-content-body{
                width: 100%;
                height: 100%;
                .pay-make-up{
                  width: 100%;
                  height: 100%;
                  .pay-make-up-title{
                    width: 100%;
                    font-size: 18px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 1;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                    padding-top: 55px;
                    display: flex;
                    justify-content: center;
                    span:last-child{
                      color: #FFFFFF;
                    }
                  }
                  .pay-make-up-amount{
                    font-weight: 500;
                    font-size: 52px;
                    color: #FFFFFF;
                    line-height: 1;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                    margin-top: 12px;
                  }
                  .pay-qr-code{
                    width: 182px;
                    height: 182px;
                    margin: 14px auto 0 auto;
                    span{
                      width: 100%;
                      font-size: 18px;
                      color: rgb(255, 255, 255, .7);
                      line-height: 1.5;
                      text-align: center;
                      font-style: normal;
                      text-transform: none;
                      display: block;
                      padding-top: 60px;
                    }
                  }
                  .pay-make-up-icon{
                    width: 100%;
                    height: 53px;
                    margin-top: 41px;
                    .pay-make-up-icon-main{
                      width: 100%;
                      height: 100%;
                      display: flex;
                      justify-content: space-between;
                      .icon-line-l{
                        flex: 1;
                        height: 1px;
                        margin-top: 26px;
                        background: rgb(255, 255, 255, .38);
                      }
                      .icon-line-c{
                        width: 53px;
                        height: 53px;
                        margin: 0 10px;
                        .icon-line-c-main{
                          width: 100%;
                          height: 100%;
                          position: relative;
                          .icon-line-c-main-bg{
                            width: 53px;
                            height: 53px;
                            border-radius: 50%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: -1;
                            background: rgba(255, 255, 255, .16);
                            backdrop-filter: blur(20px);
                          }
                          .icon-line-c-main-img{
                            width: 30px;
                            height: 53px;
                            margin: 0 auto;
                            img{
                              width: 100%;
                              height: 100%;
                              display: block;
                            }
                          }
                        }
                      }
                      .icon-line-r{
                        flex: 1;
                        height: 1px;
                        margin-top: 26px;
                        background: rgb(255, 255, 255, .38);
                      }
                    }
                  }
                  .pay-make-up-tips{
                    font-size: 14px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 1.5;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                    margin-top: 14px;
                  }
                  .pay-make-up-btn-group{
                    width: 100%;
                    height: auto;
                    display: flex;
                    justify-content: center;
                  }
                  .pay-make-up-close{
                    width: 132px;
                    height: 64px;
                    font-weight: 400;
                    font-size: 16px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 64px;
                    text-align: center;
                    cursor: pointer;
                    margin: 40px auto 0 auto;
                    // background-color: rgb(255, 255, 255, .18);
                    // border-radius: 23px;
                    // border: 1px solid rgb(255, 255, 255, .18);
                  }
                  .pay-make-up-btn{
                    width: 132px;
                    height: 64px;
                    font-weight: 400;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 64px;
                    text-align: center;
                    cursor: pointer;
                    margin: 40px auto 0 auto;
                    // background-color: rgb(255, 255, 255, .28);
                    // border-radius: 23px;
                    // border: 1px solid rgb(255, 255, 255, .38);
                  }
                  
                }
              }
            }
          }
          .points-open{
            width: 420px;
            height: 290px;
            border-radius: 36px;
            .pay-bg-mask{
              width: 415px;
              height: 285px;
              top: 1px;
              left: 1px;
              z-index: -1;
              border: 2px solid rgb(255, 255, 255, .38);
            }
            .pay-bg{
              width: 420px;
              height: 290px;
              .pay-make-up-amount{
                span{
                  text-decoration: line-through;
                }
              }
              .pay-make-up-tips{
                font-size: 16px !important;
              }
              .pay-make-up-amount{
                padding-top: 53px;
                margin-top: 0 !important;
              }
            }
          }
          .points-close{
            width: 420px;
            height: 515px;
            isolation: isolate;
            position: relative;
            .pay-bg-mask{
              width: 415px;
              height: 510px;
              top: 1px;
              left: 1px;
              z-index: -1;
              border: 2px solid rgb(255, 255, 255, .38);
            }
            .pay-bg{
              width: 420px;
              height: 515px;
              .pay-content{
                .pay-content-head{
                  display: none;
                }
                .pay-content-body{
                  width: 100%;
                  height: 100%;
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
  