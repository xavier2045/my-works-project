<template>
    <div class="main-content" @click="handleClick">
      <div class="main-content-header">
        <div class="content-header-main">
          <div class="aetrix-logo">
              <router-link to='/'>
                  <img :src="logo" alt="AETRIX" />
              </router-link>
          </div>
          <div class="content-header-right">
            <div class="exhibit-five-search">
              <template v-if="optionData.length > 0">
                <SearchComboBox 
                  :options="options" 
                  v-model:searchQuery="searchQuery" 
                  v-model:selectedOption="selectedOption"
                  @update:searchQuery="onSearchQueryChange"
                  @update:selectedOption="onSelectedOptionChange"
                />
              </template>
              <template v-else>
                <div class="search">
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
              </template>
            </div>
            <div class="exhibit-publish ae-btn">
              <div class="exhibit-publish-main" @click="findRouterPath('SelectPublishType')">
                <div class="exhibit-publish-icon">
                  <i class="icon font_family icon-shangchuanzuopin24"></i>
                </div>
                <div class="exhibit-publish-name">发布</div>
              </div>
            </div>
            <template v-if="userInfo.id !== ''">
              <div class="exhibit-notifications relievoShadow" title="待支付" @click.stop @click="findToBePaidFun">
                <template v-if="toBePaid">
                    <i class="icon font_family icon-daizhifu20"></i>
                    <span></span>
                </template>
                <template v-else>
                    <i class="icon font_family icon-daizhifu20"></i>
                </template>
              </div>
              <div class="exhibit-notifications relievoShadow" title="消息通知" @click.stop @click="userInfo.isMsgShow = !userInfo.isMsgShow">
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
            <div class="userInfo" @mouseenter="openUserInfo" @mouseleave="closeUserInfo">
              <template v-if="isLoggedIn || userInfo.userName !== ''">
                  <router-link to='/personalHomepage'>
                      <div class="userInfo-avatar relievoShadow">
                          <el-image
                              :src="userInfo.avatar"
                              fit="cover"
                              >
                              <template #error>
                                  <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                              </template>
                          </el-image>
                      </div>
                  </router-link>
                  <div class="userInof-content" v-if="isUserInfo">
                    <div class="userInof-content-main">
                      <div class="main-header">
                        <div class="user-avatar relievoShadow">
                          <el-image
                            :src="userInfo.avatar"
                            fit="cover"
                            >
                            <template #error>
                                <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                            </template>
                          </el-image>
                        </div>
                        <div class="user-info">
                          <div class="user-name">{{ userInfo.userName }}</div>
                          <div class="user-id">{{ userInfo.uuid }}</div>
                        </div>
                      </div>
                      <div class="maun-list">
                        <div 
                          class="maun-list-item"
                          v-for="(item, index) in menuData"
                          :key="index"
                          @click.stop 
                          @click="findRouterMaunPath(item)"
                        >
                          <div class="item-main">
                            <div class="item-main-l">
                              <div class="item-main-l-main">
                                <div class="item-main-l-icon">
                                  <i :class="['icon font_family', item.icon]"></i>
                                </div>
                                <div class="item-main-l-name">{{ item.name }}</div>
                              </div>
                            </div>
                            <div class="item-main-r">
                              {{ item.count }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </template>
              <template v-else>
                  <div class="userInfo-login ae-btn" @click="openLoginPopup">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                          <i class="icon font_family icon-geren24"></i>
                        </div>
                        <div class="exhibit-publish-name">登录</div>
                      </div>
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
      <Login :isOpen="isLoginOpen" @close="closeLogin"  />

      <MessageModal
        @click.stop
        v-if="userInfo.isMsgShow"
        :isVisible="userInfo.isMsgShow"
      />

      
    </div>
  </template>
  
  <script lang="ts">
  import { ref, defineComponent, onMounted, nextTick, watch, onUnmounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  import { orderPendingCount } from '@/api/pay';
  import { homeDetail } from '@/api/user';
  import logo from '/logo.svg';
  import menu from '@/assets/images/home/menu.png';
  import search_icon from '@/assets/images/home/search_icon.png';
  import SearchComboBox from '@/components/SearchComboBox/index.vue';
  import ToBePaidModal from '@/components/toBePaid/index.vue';
  import Login from '@/components/login/login.vue';
  import MessageModal  from '@/components/message/index.vue';
import { use } from 'echarts';
  
  export default defineComponent({
    name: 'Header',
    components: {
      Login,
      MessageModal,
      ToBePaidModal,
      SearchComboBox
    },
    props: {
      optionData: {
        type: Array,
        default: false,
      },
    },
    setup(props, { emit }) {
      const userStore = aeUseStore();
      const userInfo = userStore.getUserInfo;
      const isFlag = ref(0);
      const isMenuShow = ref(false);
      const isSearchOpen = ref(false);
      const isShallow = ref(false);
      const isLoggedIn = ref(false);
      const inputRefs = ref<HTMLInputElement | null>(null);
      const search = ref(''); // 搜索框输入的值
      const path = window.location.pathname;
      console.log('path', path);
      if(path === '/personalList') {
        isShallow.value = false;
      } else {
        isShallow.value = true;
        isSearchOpen.value = true;
      }

      const searchQuery = ref(''); // 搜索框输入内容
      const selectedOption = ref(''); // 搜索框下拉选中的选项
      const options = ref<Array<any>>(props.optionData);
  
      const getFlagFun = (index: number) => {
        isFlag.value = index;
      };
  
      const findMenuShowFun = () => {
        isMenuShow.value = !isMenuShow.value;
      };
  
      const findSearchOpenFun = () => {
        isSearchOpen.value = !isSearchOpen.value;
        nextTick(() => {
          if (inputRefs.value) {
            inputRefs.value.focus();
          }
        });
      };
  
      const handleEnter = () => {
        console.log('Enter key pressed');
        console.log('search', search.value);
      };

      const onSearchQueryChange = (newSearchQuery: string) => {
        searchQuery.value = newSearchQuery;
        emit('update:searchQuery', searchQuery.value);
      };
      const onSelectedOptionChange = (newSelectedOption: string) => {
        selectedOption.value = newSelectedOption;
        emit('update:selectedOption', selectedOption.value);
      };

      watch(() => props.optionData, (newVal, oldVal) => {
        options.value = newVal;
      });

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

      // 点击发布按钮
      const router = useRouter();
      const findRouterPath = (item: any) => {
        let pathUrl = '';
        pathUrl = item;
        console.log('userInfo', userInfo);
        if(userInfo.id !== ''){
          // 需要进行校验是否实名认证
          if(userInfo.isAuth == 1) {
            // 跳转到子应用根路由
            router.push({ path: '/personalHomepage/buz-main' });
          } else {
              openLogin();
          }
        } else {
          showPopup('请先进行登录再进行发布操作，谢谢！', 'error', 3000);
        }
      }

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
      
      /**
       * 登录弹窗
       * 
      */
      const isLoginOpen = ref(false);

      const openLoginPopup = () => {
          isLoginOpen.value = true;
      };

      const closeLogin = () => {
          isLoginOpen.value = false;
          if(userInfo.userName === '') {
            isLoggedIn.value = false;
          } else {
            isLoggedIn.value = true;
          }
      };

      // 监听是否登录
      watch(() => userInfo.userName, (newVal) => {
          console.log('newVal:', newVal);
          if(newVal === '') {
            isLoggedIn.value = false;
          } else {
            isLoggedIn.value = true;
          }
      });

      // 消息通知
      const notifications = ref(userInfo.notifications); // 根据推送消息判断是否有新消息
      watch(() => userInfo.notifications, (newVal) => {
          console.log('Works updated:', newVal);
          notifications.value = newVal;
      });

      const handleClick = () => {
        userInfo.isToBePaid = false;
        userInfo.isMsgShow = false;
        userInfo.isUserInfo = false;
      };

      // 用户信息
      const isUserInfo = ref(userInfo.isUserInfo);
      const openUserInfo = () => {
        isUserInfo.value = true;
        userInfo.isUserInfo = true;
      };
      const closeUserInfo = () => {
        isUserInfo.value = false;
        userInfo.isUserInfo = false;
      };
      watch(() => userInfo.isUserInfo, (newVal) => {
          console.log('Works updated:', newVal);
          isUserInfo.value = newVal;
      });
      const menuData = [
        { id: 1, name: '我的任务', count: 0, path: 'MyTask', icon: 'icon-woderenwu24-2' },
        { id: 2, name: '我的活动', count: 0, path: 'ActivitiesToJoin', icon: 'icon-fabuhuodong34' },
        { id: 3, name: '我的作品', count: 0, path: 'PersonalWorks', icon: 'icon-fabuzuopin34' },
        { id: 4, name: '退出登录', count: '', path: '/', icon: 'icon-tuichudenglu24' },
      ];

      const count = ref<{ pendingNum: number, unreadNum: number, activityNum: number; missionNum: number; workNum: number }>({
        pendingNum: 0,
        unreadNum: 0,
        activityNum: 0,
        missionNum: 0,
        workNum: 0
      });
      const fidCountFun = () => {
        return new Promise<void>((resolve, reject) => {
          homeDetail({}).then((response: any) => {
              const { code, data, message } = response;
              if (code !== 200) {
                  showPopup(message, 'error', 3000);
              return;
              }
              count.value = data;
              if(Number(data.pendingNum) > 0) {
                toBePaid.value = true;
              } else {
                toBePaid.value = false;
              }
              menuData.map((item: any) => {
                if(item.id === 1) {
                  return item.count = count.value.missionNum;
                } else if(item.id === 2) {
                  return item.count = count.value.activityNum;
                } else if(item.id === 3) {
                  return item.count = count.value.workNum;
                }else {
                  return item.count = '';
                }
              })
              resolve()
          }).catch((error: any) => {
              reject(error)
          })
        })
      };

      const findRouterMaunPath = (item: any) => {
        if(item.id === 4) {
          userInfo.id = '';
          userInfo.avatar = '';
          userInfo.userName = '';
          userInfo.token = '';
          userInfo.refreshToken = '';
          router.push('/');
        } else {
          router.push({ name: item.path });
        }
      };

      onMounted(() => {
        if(userInfo.id !== '') {
          fidCountFun();
        }
        document.addEventListener('click', handleOutsideClick);
      })

      onUnmounted(() => {
        document.removeEventListener('click', handleOutsideClick);
      });

      const handleOutsideClick = (event) => {
        const userInfoContent = document.querySelector('.userInof-content');
        if (userInfoContent && !userInfoContent.contains(event.target)) {
          isUserInfo.value = false;
          userInfo.isUserInfo = false;
        }
      };
  
      return {
        logo,
        menu,
        search_icon,
        userInfo,
        isFlag,
        isShallow,
        isMenuShow,
        isSearchOpen,
        inputRefs,
        search,
        menuData,
        searchQuery,
        selectedOption,
        options,
        isKycOpen,
        isToBePaid,
        toBePaid,
        notifications,
        isLoginOpen,
        isUserInfo,
        count,
        isLoggedIn,
        SearchComboBox,
        getFlagFun,
        findMenuShowFun,
        findSearchOpenFun,
        handleEnter,
        findRouterPath,
        onSearchQueryChange,
        onSelectedOptionChange,
        openLogin,
        closeKyc,
        handleClose,
        openLoginPopup,
        closeLogin,
        findToBePaidFun,
        handleClick,
        findOrderPendingCountFun,
        openUserInfo,
        closeUserInfo,
        findRouterMaunPath,
        fidCountFun
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  @use '@/assets/styles/common.scss';
  .main-content {
    width: 1500px;
    height: auto;
    margin: 0 auto;
    .main-content-header{
        width: 100%;
        height: auto;
        .content-header-main{
            height: 85px;
            display: flex;
            padding: 0 32px;
            justify-content: space-between;
            .aetrix-logo{
                width: 68px;
                height: 50px;
                flex-shrink:0;
                margin: 17.5px 0;
                a{
                  width: 100%;
                  height: 100%;
                  display: inline-block;
                  img{
                    width: 220px;
                    height: 50px;
                    opacity: 0.8;
                    display: inline-block;
                  }
                }
            }
            .content-header-right{
              min-width: 520px;
              display: flex;
              justify-content: space-between;
              .exhibit-five-search{
                  width: 346px;
                  height: 72px;
                  border-radius: 26px;
                  background: rgba(0, 0, 0, .18);
                  // box-shadow: inset 1px -1px 4px rgba(0, 0, 0, 0.24), inset 1px 1px 2px rgba(255, 255, 255, 0.52);

                  margin: 10px 0 10px 27px;
                  background: url(@/assets/images/task/search_bg.png) no-repeat center center;
                  background-size: 100% 100%;
                  &:hover{
                    background: url(@/assets/images/task/search_bg_hover.png) no-repeat center center;
                    background-size: 100% 100%;
                  }
                  .search-main{
                      // padding: 11px 19px;
                      display: flex;
                      cursor: pointer;
                      .search-icon{
                          width: 24px;
                          i{
                              font-size: 24px;
                              color: rgba(255, 255, 255, .8);
                              display: block;
                              margin-right: 6px;
                          }
                      }
                      .search-input{
                          flex-grow: 1;
                          width: 0;
                          height: 32px;
                          margin-top: 20px;
                          input{
                              width: 100%;
                              height: 100%;
                              border: none;
                              outline: none;
                              font-size: 16px;
                              color: rgba(255, 255, 255, .9);
                              line-height: 32px;
                              display: block;
                              background-color: inherit;
                          }
                          input[type="text"]::placeholder {
                              color: rgb(255, 255, 255, 0.68);
                              font-size: 16px;
                          }
                      }
                      .search-clear{
                          width: 24px;
                          i{
                              font-size: 24px;
                              color: rgba(255, 255, 255, .6);
                              display: block;
                              margin-right: 6px;
                              line-height: 72px;
                          }
                      }
                  }
              }
              .exhibit-publish{
                width: 140px;
                height: 72px;
                flex-shrink: 0;
                margin: 9px 0 0 0;
              }
              .userInfo{
                display: inline-block;
                animation: bounceInDown;
                animation-duration: 2s;
                position: relative;
                margin-left: 10px;
                a{
                    width: 100%;
                    display: flex;
                    text-decoration: none;
                    .userInfo-avatar{
                        width: 46px;
                        height: 46px;
                        border-radius: 50%;
                        flex-shrink:0;
                        margin-top: 23px;
                        .el-image, img{
                            width: 80%;
                            height: 80%;
                            margin: 10%;
                            display: block;
                            border-radius: 50%;
                        }
                    }
                }
                .userInfo-login{
                  width: 140px;
                  height: 72px;
                  flex-shrink: 0;
                  margin: 9px 0 0 0;
                }
                .userInof-content{
                  width: 178px;
                  height: auto;
                  cursor: pointer;
                  border-radius: 24px;
                  padding: 20px;
                  background: rgba(255, 255, 255, 0.08);
                  backdrop-filter: blur(36px);
                  border: 1px solid rgba(255, 255, 255, .38);
                  position: absolute;
                  top: 82px;
                  right: 0;
                  z-index: 10;
                  .userInof-content-main{
                    width: 100%;
                    height: 100%;
                    .main-header{
                      width: 100%;
                      height: auto;
                      display: flex;
                      margin-bottom: 11px;
                      .user-avatar{
                        width: 46px;
                        height: 46px;
                        border-radius: 50%;
                        flex-shrink:0;
                        margin-right: 8px;
                        .el-image, img{
                            width: 80%;
                            height: 80%;
                            margin: 10%;
                            display: block;
                            border-radius: 50%;
                        }
                      }
                      .user-info{
                        flex: 1;
                        width: 0;
                        height: auto;
                        line-height: 1;
                        text-align: left;
                        .user-name{
                          font-size: 16px;
                          color: #FFFFFF;
                          margin: 5px 0 8px 0
                        }
                        .user-id{
                          font-size: 12px;
                          color: rgb(255, 255, 255, .7);
                        }
                      }
                    }
                    .maun-list{
                      width: 100%;
                      height: auto;
                      .maun-list-item{
                        width: 100%;
                        height: auto;
                        cursor: pointer;
                        border-top: 1px solid rgba(255, 255, 255, .36);
                        &:hover{
                          background: radial-gradient(circle, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
                        }
                        .item-main{
                          width: 100%;
                          height: auto;
                          display: flex;
                          .item-main-l{
                            flex: 1;
                            width: 0;
                            .item-main-l-main{
                              width: 100%;
                              height: auto;
                              display: flex;
                              .item-main-l-icon{
                                width: 24px;
                                height: 36px;
                                flex-shrink: 0;
                                margin-right: 5px;
                                i{
                                  font-size: 24px;
                                  line-height: 36px;
                                  text-align: center;
                                  color: rgba(255, 255, 255, .7);
                                }
                              }
                              .item-main-l-name{
                                flex: 1;
                                width: 0;
                                font-weight: 400;
                                font-size: 14px;
                                color: #FFFFFF;
                                line-height: 36px;
                                text-align: left;
                              }
                            }
                          }
                          .item-main-r{
                            width: 60px;
                            font-weight: 400;
                            font-size: 14px;
                            color: #FFFFFF;
                            line-height: 36px;
                            text-align: right;
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
  .exhibit-notifications{
    width: 42px;
    height: 42px;
    cursor: pointer;
    position: relative;
    border-radius: 50%;
    margin: 25px 10px;
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
        font-size: 34px;
        line-height: 42px;
        color: rgba(255, 255, 255, .8);
        display: block;
        text-align: center;
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
        top: 5px;
        right: 5px;
    }
  }
  .messageModal{
    width: 456px;
    height: 60%;
    border-radius: 28px;
    position: absolute;
    top: 80px !important;
    right: 100px !important;
    z-index: 1;
  }
  </style>
  