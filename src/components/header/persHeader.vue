<template>
    <div class="main-content">
        <div class="contentArea-main-header">
            <div class="contentArea-main-header-main">
                <div class="aetrix-center">
                    <div class="exhibit-five-back back">
                        <button class="button" @click="goBack">
                            <span class="button-elem">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                    <div class="exhibit-five-center"></div>
                    <div class="exhibit-five-feature">
                        <div class="exhibit-five-search search">
                            <div class="search-main">
                                <div class="search-icon">
                                    <i class="icon font_family icon-fangdajing24"></i>
                                </div>
                                <div class="search-input">
                                    <input 
                                        ref="inputRefs"
                                        type="text" 
                                        v-model="search" 
                                        placeholder="Search..." 
                                        @keyup.enter="handleEnter"
                                    />
                                </div>
                                <div class="search-clear">
                                    <i 
                                        class="icon font_family icon-guanbi24" 
                                        v-if="search !== ''"
                                        @click="search = ''"
                                    ></i>
                                </div>
                            </div>
                        </div>
                        <template v-if="Number(userInfo.id) !== Number(userId)">
                            <div class="exhibit-publish ae-btn">
                                <div class="exhibit-publish-main" @click="findIsFollow()">
                                    <div class="exhibit-publish-icon">
                                        <i class="icon font_family icon-guanzhu20"></i>
                                    </div>
                                    <div class="exhibit-publish-name">
                                        
                                        <template v-if="isFollow == 0">关注Ta</template>
                                        <template v-else>取消关注</template>
                                    </div>
                                </div>
                            </div>
                            <div class="exhibit-publish ae-btn">
                                <div class="exhibit-publish-main" @click="findShequhudong()">
                                    <div class="exhibit-publish-icon">
                                        <i class="icon font_family icon-shequhudong24"></i>
                                    </div>
                                    <div class="exhibit-publish-name">私信Ta</div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <template v-if="isShow">
                                <div class="exhibit-publish ae-btn">
                                    <div class="exhibit-publish-main" @click="findRouterPath('SelectPublishType')">
                                        <div class="exhibit-publish-icon">
                                            <i class="icon font_family icon-shangchuanzuopin24"></i>
                                        </div>
                                        <div class="exhibit-publish-name">我要发布</div>
                                    </div>
                                </div>
                            </template>
                            <div class="exhibit-notifications relievoShadow" title="待支付" @click.stop @click="findToBePaidFun">
                                <template v-if="toBePaid">
                                    <i class="icon font_family icon-daizhifu20"></i>
                                    <span></span>
                                </template>
                                <template v-else>
                                    <i class="icon font_family icon-daizhifu20"></i>
                                </template>
                            </div>
                            <div class="exhibit-notifications relievoShadow" @click.stop @click="userInfo.isMsgShow = !userInfo.isMsgShow">
                                <template v-if="notifications">
                                    <!-- <img :src="messageIcon" alt="" /> -->
                                    <i class="icon font_family icon-a-xiaoxitongzhi34"></i>
                                    <span></span>
                                </template>
                                <template v-else>
                                    <!-- <img :src="messageIcons" alt="" /> -->
                                    <i class="icon font_family icon-a-xiaoxitongzhi34"></i>
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <Kyc :isOpen="isKycOpen" @close="closeKyc" />
        <!-- 待支付弹窗 -->
        <ToBePaidModal
            :isToBePaid="isToBePaid"
            @close="handleClose"
        />
    </div>
  </template>
  
  <script lang="ts">
    import { ref, defineComponent, onMounted, watch } from 'vue';
    import { aeUseStore } from '@/stores/user';
    import { useRouter } from 'vue-router';
    import { followAdd, followCancel } from '@/api/user';
    import { orderPendingCount } from '@/api/pay';
    import Kyc from '@/components/kyc/index.vue';
    import { showPopup } from '@/utils/usePopup';
    import ToBePaidModal from '@/components/toBePaid/index.vue';
    import logo from '/logo.svg';
    import menu from '@/assets/images/home/menu.png';
    import search_icon from '@/assets/images/home/search_icon.png';
    import messageIcon from '@/assets/images/common/msg.png';
    import messageIcons from '@/assets/images/common/msgs.png';
  
  export default defineComponent({
    name: 'Header',
    components: {
        Kyc,
        ToBePaidModal
    },
    setup() {
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;
        const userId = ref(''); // 查看他人的用户id
        const isFollow = ref(0); // 是否关注 0 未关注 1 已关注
        const notifications = ref(userInfo.notifications); // 根据推送消息判断是否有新消息
        // 如果没有他人id，则取登录人id
        if(userInfo.othersId !== '') {
            userId.value = userInfo.othersId;
        } else {
            userId.value = userInfo.id;
        }
        isFollow.value = userInfo.isFollow;

        // 返回上一页
        const goBack = () => {
            router.go(-1);
        };
  
        /**
         * 输入框搜索
         * **/
        const search = ref(''); // 搜索框输入的值
        // 处理回车事件
        const handleEnter = () => {
            console.log('Enter key pressed');
            console.log('search', search.value);
        };

        /** 根据url判断显示发布按钮 **/
        const isShow = ref(false);
        const findSuspMenuPath = () => {
            const currentUrl = window.location.href;
            if(currentUrl.includes('personalCenter') || currentUrl.includes('postATask') || currentUrl.includes('personalHomepage/task') || currentUrl.includes('personalHomepage/myTask') || currentUrl.includes('personalHomepage/personalWorks')){
                isShow.value = true;
            } else {
                isShow.value = false;
            }
        }

        // 关注
        const findIsFollow = () => {
            let reqData = {
                followUserId: userId.value,
            }
            if(isFollow.value !== 0) {
                return new Promise<void>((resolve, reject) => {
                    followCancel(reqData).then((response: any) => {
                        const { code, message } = response;
                        
                        if (code !== 200) {
                            showPopup(message, 'error', 3000);
                            return;
                        }
                        userInfo.isFollow = 0;
                        isFollow.value = 0;
                        showPopup('关注成功', 'success', 3000);
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            } else {
                return new Promise<void>((resolve, reject) => {
                    followAdd(reqData).then((response: any) => {
                        const { code, message } = response;
                        
                        if (code !== 200) {
                            showPopup(message, 'error', 3000);
                            return;
                        }
                        userInfo.isFollow = 1;
                        isFollow.value = 1;
                        showPopup(message, 'success', 3000);
                        resolve()
                    }).catch((error: any) => {
                        reject(error)
                    })
                })
            }
            
        };
        
        // 私信
        const findShequhudong = () => {
            showPopup('功能开发中，敬请期待！', 'error', 3000);
        }

        const router = useRouter();
        const findRouterPath = (item: any) => {
            let pathUrl = '';
            pathUrl = item;
            console.log('userInfo', userInfo);
            // 需要进行校验是否实名认证
            if(userInfo.isAuth == 1) {
                // 跳转到子应用根路由
                router.push({ path: '/personalHomepage/buz-main' });
            } else {
                openLogin();
            }
        }

        /**
         * 实名认证
         * 
         */
        const isKycOpen = ref(false);
        const openLogin = () => {
            isKycOpen.value = true;
        };
        const closeKyc = () => {
            isKycOpen.value = false;
        };
        
        watch(() => userInfo.notifications, (newVal) => {
            console.log('Works updated:', newVal);
            notifications.value = newVal;
        });

        // 待支付弹窗
        const toBePaid = ref(false);
        const isToBePaid = ref(userInfo.isToBePaid);
        console.log('userInfo.isToBePaid',userInfo.isToBePaid);
        const findToBePaidFun = () => {
            if(toBePaid.value){
                userInfo.isToBePaid = !userInfo.isToBePaid
            }
        };  

        watch(() => userInfo.isToBePaid, (newVal) => {
            console.log('Works updated:', newVal);
            isToBePaid.value = newVal;
        });
        const handleClose = () => {
            userInfo.isToBePaid = !userInfo.isToBePaid
        };

        const findOrderPendingCountFun = () => {
            orderPendingCount().then((res: any) => {
            if(res.code === 200) {
                if(res.data > 0) {
                toBePaid.value = true;
                } else {
                toBePaid.value = false;
                }
            }
            })
        }

        onMounted(() => {
            console.log('onMounted');
            userInfo.isMsgShow = false;
            findSuspMenuPath();
        });
  
        return {
            logo,
            menu,
            isShow,
            search,
            userId,
            isFollow,
            userInfo,
            notifications,
            search_icon,
            isKycOpen,
            messageIcon,
            messageIcons,
            toBePaid,
            isToBePaid,
            goBack,
            findIsFollow,
            findShequhudong,
            handleEnter,
            findRouterPath,
            closeKyc,
            findToBePaidFun,
            handleClose,
            findOrderPendingCountFun
        };
    },
  });
  </script>
  
  <style lang="scss" scoped>
    @use '@/assets/styles/common.scss';
    .main-content{
        width: 100%;
        height: auto;
        margin-bottom: 21px;
        .contentArea-main-header{
            height: 72px;
            .contentArea-main-header-main{
                width: 100%;
                height: 100%;
                .aetrix-center{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    .exhibit-five-back{
                        width: 72px;
                        height: 72px;
                        flex-shrink: 0;
                        margin-left: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        
                        .button {
                          display: flex;
                          position: relative;
                          width: 42px;
                          height: 42px;
                          margin: 0;
                          align-items: center;
                          justify-content: center;
                          outline: none;
                          background-color: transparent;
                          cursor: pointer;
                          border: 0;
                        }

                        .button:before,
                        .button:after {
                          content: "";
                          position: absolute;
                          border-radius: 50%;
                          inset: 0;
                        }

                        .button:before {
                          border: 3px solid #f0eeef;
                          transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
                            transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
                        }

                        .button:after {
                          border: 3px solid #96daf0;
                          transform: scale(1.3);
                          transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
                            transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                          opacity: 0;
                        }

                        .button:hover:before,
                        .button:focus:before {
                          opacity: 0;
                          transform: scale(0.7);
                          transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
                            transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        }

                        .button:hover:after,
                        .button:focus:after {
                          opacity: 1;
                          transform: scale(1);
                          transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
                            transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
                        }

                        .button-elem {
                          display: flex;
                          width: 22px;
                          height: 22px;
                          align-items: center;
                          justify-content: center;
                          position: relative;
                          z-index: 2;
                        }

                        .button svg {
                          width: 100%;
                          height: 100%;
                          fill: #f0eeef;
                          stroke: #f0eeef;
                          stroke-width: 0.5;
                        }
                    }
                    
                    .exhibit-five-center{
                        flex-grow: 1;
                    }
                    .exhibit-five-feature{
                        width: auto;
                        height: 72px;
                        display: flex;
                        justify-content: flex-end;
                        .exhibit-five-search{
                            width: 346px;
                            height: 72px;
                        }
                        .exhibit-notifications{
                            width: 48px;
                            height: 48px;
                            cursor: pointer;
                            position: relative;
                            border-radius: 50%;
                            margin: 12px 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: rgba(40, 44, 52, 0.6);
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                            
                            &:hover {
                                background-color: rgba(50, 55, 65, 0.8);
                            }
                            
                            img{
                                width: 42px;
                                height: 42px;
                                margin: 10px auto;
                                display: block;
                            }
                            &:hover{
                                i{
                                    background-image: linear-gradient(to bottom, rgb(255, 255, 255, 1), rgba(117, 117, 117, 0.2), rgba(0, 0, 0, .7));
                                }
                            }
                            i{
                                font-size: 28px;
                                line-height: 48px;
                                text-align: center;
                                color: rgba(255, 255, 255, .8);
                                display: block;
                                background-image: linear-gradient(to bottom, rgb(255, 255, 255, 1), rgba(78, 78, 78, .3), rgba(0, 0, 0, .8));
                                background-clip: text;
                                -webkit-background-clip: text;
                                color: transparent;
                            }
                            span{
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background: red;
                                position: absolute;
                                top: 8px;
                                right: 8px;
                            }
                        }
                        .exhibit-publish{
                            width: 160px;
                            height: 48px;
                            flex-shrink: 0;
                            margin: 12px 20px 0 0;
                            display: flex;
                            align-items: center;
                            border-radius: 24px;
                            background-color: rgba(40, 44, 52, 0.6);
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                            overflow: hidden;
                            transition: all 0.2s ease;
                            
                            &:hover {
                                background-color: rgba(50, 55, 65, 0.8);
                                transform: translateY(-2px);
                            }
                            
                            .exhibit-publish-main {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                
                                .exhibit-publish-icon {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    margin-right: 8px;
                                    
                                    i {
                                        font-size: 20px;
                                        color: rgba(255, 255, 255, 0.8);
                                    }
                                }
                                
                                .exhibit-publish-name {
                                    font-size: 15px;
                                    color: rgba(255, 255, 255, 0.9);
                                    font-weight: 500;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  </style>
  