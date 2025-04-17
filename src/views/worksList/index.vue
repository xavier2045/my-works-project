<template>
  <div class="taskList">
    <!-- 添加粒子背景组件 -->
    <ParticleWhirlpool class="particle-background" />
    <div class="main-content-header">
      <div class="content-header-main">
          <HeaderView
            :optionData= 'options'
            @update:searchQuery="handleSearchQueryUpdate"
            @update:selectedOption="handleSelectedOptionUpdate"
          />
      </div>
    </div>
    <div class="taskList-container" data-aos="fade-up">
      <div class="taskList-content">
        <SuspMenu />
        <div class="taskList-content-main">
          <infinite-scroll-list
            :fetchFunction="fetchNews"
            :hasMore="hasMore"
            :filterCriteria="currentFilterCriteria"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="30" :cols="6">
                <div 
                  v-for="item in items" 
                  :key="item.workId" 
                  class="list-item fade-up-item"
                  @click="toTaskDetail(item.workId)"
                >
                  <div class="list-item-main">
                    <div class="list-item-main-img">
                      <el-image
                        style="width: 100%; height: 100%"
                        :src="item.cover"
                        fit="cover"
                      >
                        <template #error>
                          <img src="@/assets/images/common/default.png" alt="Default Image" />
                        </template>
                      </el-image>
                    </div>
                    <div class="activities-ntf"
                      v-if="item.nft !== ''" 
                    >
                      <i class="icon font_family icon-lianjie24"></i>
                    </div>
                    <div class="list-item-main-content">
                      <div class="item-content-info">
                        <div class="item-content-info-main">
                          <div class="item-content-info-main-l">
                            <div class="info-main-l-name multi-line-1">{{ item.name }}</div>
                            <div class="info-main-l-item">
                              <div class="item-li">
                                <i class="icon font_family icon-zhuanfa20"></i>
                                <span>{{ item.seeNum || 0 }}</span>
                              </div>
                              <div class="item-li">
                                <i class="icon font_family icon-guanzhu20"></i>
                                <span>{{ item.followNum || 0 }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="item-content-info-main-r">
                            <div class="works-type relievoShadow">
                              <div class="works-type-icon">
                                <!-- 类型： 1 视频类 2 图片类 3 语音类 4 文档类 -->
                                <template v-if="item.type === 1">
                                  <i class="icon font_family icon-shipin68"></i>
                                </template>
                                <template v-if="item.type === 2">
                                  <i class="icon font_family icon-tupian68"></i>
                                </template>
                                <template v-if="item.type === 3">
                                  <i class="icon font_family icon-shangchuanyuyin24"></i>
                                </template>
                                <template v-if="item.type === 4">
                                  <i class="icon font_family icon-tianjiawenzi24"></i>
                                </template>
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
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, nextTick, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { worksList } from '@/api/work';
  import { aeUseStore } from '@/stores/user';
  import { aeWorksStore } from '@/stores/works';
  import { getItem, setItem, copyToClipboard } from '@/utils/index';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import HeaderView from '@/components/header/header.vue';
  import SuspMenu from '@/components/suspMenu/index.vue';
  import ParticleWhirlpool from '@/components/particleWhirlpool/index.vue';
  import { showPopup } from '@/utils/usePopup';
  import { initAOS } from '@/animations/aos';

  const router = useRouter();
  const userStore = aeUseStore();
  const worksStore = aeWorksStore();

  // 获取缓存数据
  const userInfo = ref({});
  if (userStore.userInfo.userName !== '' && userStore.userInfo.userName !== undefined && userStore.userInfo.userName !== null) {
      userInfo.value = userStore.getUserInfo;
      userInfo.value.avatar = userInfo.value.avatar || '';
  } else {
      if(getItem('userName') !== '' && getItem('userName') !== undefined && getItem('userName') !== null) {
          userInfo.value = getItem('userInfo');
          userInfo.value.avatar = userInfo.value.avatar || '';
      } 
  }

  const handleSearchQueryUpdate = (newSearchQuery: string) => {
    searchQuery.value = newSearchQuery;
  };
  const handleSelectedOptionUpdate = (newSelectedOption: string) => {
    selectedOption.value = newSelectedOption;
  };

  const searchQuery = ref(''); // 搜索框输入内容
  const selectedOption = ref(''); // 搜索框下拉选中的选项
  // 1 视频类 2 图片类 3 语音类 4 文档类
  const options = ref([
    {value: '', label: '所有的'},
    {value: 2, label: '图片类'},
    {value: 1, label: '视频类'},
    {value: 3, label: '语音类'},
    {value: 4, label: '文字类'},
    {value: 5, label: '链上作品'},
    {value: 6, label: '链下作品'},
  ]);

  const hasMore = ref(true);

  const currentFilterCriteria = ref({
    isOnChain: null,
    type: '',
    search: '',
  });

  watch([searchQuery, selectedOption], () => {
    // 当searchQuery或selectedOption变化时，执行搜索逻辑
    currentFilterCriteria.value.search = searchQuery;
    if(selectedOption.value == '5') {
      currentFilterCriteria.value.type = '';
      currentFilterCriteria.value.isOnChain = 1;
    } else if(selectedOption.value == '6') {
      currentFilterCriteria.value.type = '';
      currentFilterCriteria.value.isOnChain = 0;
    } else {
      currentFilterCriteria.value.isOnChain = null;
      currentFilterCriteria.value.type = selectedOption.value;
    }
    
  });

  const fetchNews = async (page: number) => {
      let getData = {
        pageNum: page,
        pageSize: 16
      } as { pageNum: number; pageSize: number; value?: string; isOnChain: number; type?: string };
      if(currentFilterCriteria.value.isOnChain !== null) {
        getData.isOnChain = currentFilterCriteria.value.isOnChain;
      }
      if(currentFilterCriteria.value.type !== '') {
        getData.type = currentFilterCriteria.value.type;
      }
      if(currentFilterCriteria.value.search !== '') {
        getData.value = currentFilterCriteria.value.search;
      }
      try {
        const response = await worksList(getData);
        const { code, data, message } = response;

        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }

        if(data.rows.length == 0) {
          hasMore.value = false;
          return false;
        } else {
          worksStore.worksInfo.params = getData;
          worksStore.worksInfo.worksIdList = data.rows.map((item: { workId: any; }) => item.workId);
          return data.rows;
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
  };

  // 点击任务详情
  const toTaskDetail = async (workId: string) => {
    try {
      worksStore.worksInfo.currentId = workId;
      worksStore.worksInfo.isRouterType = 1;
      await router.push({ 
        name: 'WorksDetails', 
        params: { id: workId }
      });
    } catch (error) {
      console.error('路由导航失败:', error);
      showPopup('导航失败，请稍后重试', 'error', 3000);
    }
  };

  onMounted(() => {
    initAOS();
  });
</script>

<style lang='scss' scoped>
  .taskList{
    height: 100%;
    // 移除原有背景，使用粒子背景
    position: relative;
    
    // 添加粒子背景样式
    .particle-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    
    .main-content-header{
        width: 100%;
        height: auto;
        margin: 0 auto;
        position: relative;
        z-index: 1;
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
                    opacity: 0.5;
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
                      padding: 11px 19px;
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
                              line-height: 32px;
                          }
                      }
                  }
              }
              .userInfo{
                  display: inline-block;
                  margin: 25px 14px 0 27px;
                  animation: bounceInDown;
                  animation-duration: 2s;
                  a{
                      width: 100%;
                      display: flex;
                      text-decoration: none;
                      .userInfo-avatar{
                          width: 46px;
                          height: 46px;
                          margin-right: 8px;
                          flex-shrink:0;
                          img{
                              width: 100%;
                              height: 100%;
                              display: inline-block;
                              border-radius: 50%;
                          }
                      }
                      .userInfo-content{
                          flex: 1;
                          display: inline-block;
                          .name{
                              font-weight: 400;
                              font-size: 20px;
                              color: #FFFFFF;
                              line-height: 1;
                          }
                          .numbering{
                              font-weight: 400;
                              font-size: 14px;
                              color: #FFFFFF;
                              line-height: 1;
                              margin-top: 8px;
                          }
                      }
                  }
              }
              .aetrix-menu{
                width: 68px;
                height: 68px;
                cursor: pointer;
                margin-top: 17px;
                .aetrix-menu-but{
                    width: 100%;
                    height: 100%;
                    animation: wobble;
                    animation-duration: 2s;
                    i{
                      font-size: 38px;
                      color: #FFFFFF;
                      display: inline-block;
                      line-height: 68px;
                    }
                }
                .menu-content{
                    width: 240px;
                    height: auto;
                    border-radius: 30px;
                    position: fixed;
                    top: 100px;
                    right: 300px;
                    z-index: 1;
                    transition: all 0.3s;
                    animation: fadeInDown;
                    animation-duration: 1s;
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(9px);
                    .menu-content-main{
                        width: 100%;
                        margin: 20px 0 20px 0;
                        ul{
                            margin: 0;
                            padding: 0 20px;
                            li{
                                width: 100%;
                                height: 58px;
                                font-weight: 400;
                                font-size: 22px;
                                color: #333333;
                                line-height: 58px;
                                list-style-type: none;
                                text-align: center;
                                
                                border-radius: 30px;
                                a{
                                    color: #333333;
                                    text-decoration: inherit;
                                }
                                &:hover{
                                    color: #333333;
                                    a{
                                        color: #333333;
                                    }
                                }
                            }
                            .flag{
                                background: rgba(131,131,131,0.15);
                                a{
                                  color: #333333;  
                                }
                            }
                        }
                    }
                }
              }
            }
        }
    }
    .taskList-container{
      position: relative;
      z-index: 1;
      
      .taskList-content {
        position: relative;
      }
      
      .taskList-content-main {
        position: relative;
        z-index: 2;
      }
      
      width: 100%;
      height: calc(100% - 100px);
      margin: 0 auto;
      .taskList-header{
        width: 100%;
        height: auto;
        margin-top: 30px;
        .taskList-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .taskList-header-flex-l{
            height: auto;
            flex-shrink: 0;
            padding-left: 52px;
            .taskList-header-flex-l-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .flex-l-main-typeList{
                width: auto;
                height: auto;
                margin-right: 30px;
                display: inline-block;
                &:last-child{
                  margin-right: 0;
                }
                .flex-l-main-typeList-item{
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  .flex-l-main-typeList-item-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 24px;
                    }
                  }
                  .flex-l-main-typeList-item-text{
                    display: inline-block;
                    font-weight: 500;
                    font-size: 16px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    margin-right: 5px;
                    white-space: nowrap;
                  }
                  .flex-l-main-typeList-item-line{
                    width: auto;
                    font-weight: 500;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                  }
                }
              }
            }
          }
          .taskList-header-flex-c{
            flex-grow: 1;
          }
          .taskList-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .taskList-header-flex-r-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .personal-list-sort{
                width: auto;
                height: auto;
                margin-right: 30px;
                display: inline-block;
                &:last-child{
                  margin-right: 50px;
                }
                .personal-list-sort-main{
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  .sort-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 24px;
                    }
                  }
                  .sort-select{
                    display: inline-block;
                    font-weight: 500;
                    font-size: 16px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    :deep(.cascader-input){
                      color: #FFFFFF;
                      .arrow{
                        i{
                          color: #FFFFFF
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
      .taskList-content{
        width: 100%;
        height: 100%;
        position: relative;
        .taskList-content-main{
          // width: 1200px;
          height: 100%;
          padding: 0 225px;
          .list-item{
            width: 270px;
            height: auto;
            border-radius: 24px;
            break-inside: avoid;
            margin-top: 30px;
            cursor: pointer;
            background-color: rgba(255, 255, 255, .06);
            backdrop-filter: blur(20px);
            box-shadow: 0px 0px 8px 9px rgb(0, 0, 0, .15);
            .list-item-main{
              width: 100%;
              height: auto;
              position: relative;
              .list-item-main-img{
                width: 100%;
                height: auto;
                display: block;
                border-radius: 24px;
                img, .el-image{
                  width: 100%;
                  height: auto;
                  display: block;
                  border-radius: 24px;
                }
              }
              .activities-ntf{
                width: 24px;
                height: auto;
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 1;
                cursor: pointer;
                i{
                  font-size: 24px;
                  color: #FFFFFF;
                  display: block;
                  line-height: 24px;
                }
              }
              .list-item-main-content{
                height: 46px;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                border-radius: 8px 8px 24px 24px;
                padding: 18px;
                background: rgba(255, 255, 255, .16);
                backdrop-filter: blur(52px);
                .item-content-info{
                  width: 100%;
                  height: auto;
                  .item-content-info-main{
                    width: 100%;
                    height: auto;
                    display: flex;
                    .item-content-info-main-l{
                      flex: 1;
                      width: 0;
                      .info-main-l-name{
                        width: 100%;
                        font-weight: 400;
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 20px;
                        text-align: left;
                        margin-bottom: 5px;
                      }
                      .info-main-l-item{
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                        .item-li{
                          cursor: pointer;
                          line-height: 30px;
                          display: inline-block;
                          &:last-child{
                            margin-left: 10px;
                          }
                          i{
                            font-size: 20px;
                            margin-right: 5px;
                            color: rgb(255, 255, 255, .7)
                          }
                          span{
                            font-size: 14px;
                            color: rgb(255, 255, 255, .7)
                          }
                        }
                      }
                    }
                    .item-content-info-main-r{
                      width: 40px;
                      .works-type{
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        .works-type-icon{
                          width: 100%;
                          height: 100%;
                          i{
                            font-size: 24px;
                            color: rgb(255, 255, 255, .9);
                            text-align: center;
                            line-height: 40px;
                            margin: 0 auto;
                            display: block;
                          }
                        }
                      }
                    }
                  }
                  .item-content-name{
                    width: 100%;
                    font-weight: 500;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 1;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .item-content-taskId{
                    width: 100%;
                    height: auto;
                    display: flex;
                    margin-top: 12px;
                    .item-content-taskId-id{
                      flex: 1;
                      font-weight: 400;
                      font-size: 14px;
                      color: rgb(255, 255, 255, .7);
                      line-height: 24px;
                      text-align: left;
                      font-style: normal;
                      text-transform: none;
                    }
                    .item-content-taskId-cmtcnt{
                      width: 73px;
                      height: auto;
                      .item-content-taskId-cmtcnt-item{
                        width: 100%;
                        height: auto;
                        display: flex;
                        .item-content-taskId-cmtcnt-item-icon{
                          width: 24px;
                          height: auto;
                          margin-right: 5px;
                          i{
                            font-size: 24px;
                            color: #FFFFFF;
                            display: block;
                            line-height: 24px;
                          }
                        }
                        .item-content-taskId-cmtcnt-item-num{
                          flex: 1;
                          font-weight: 400;
                          font-size: 14px;
                          color: rgb(255, 255, 255, .7);
                          line-height: 24px;
                          text-align: left;
                          font-style: normal;
                          text-transform: none;
                        }
                      }
                    }
                  }
                  .item-content-flex{
                    width: 100%;
                    height: auto;
                    .item-content-participant{
                      width: 100%;
                      height: auto;
                      display: flex;
                      justify-content: space-between;
                      .item-content-participant-num{
                        width: auto;
                        height: auto;
                        font-weight: 400;
                        font-size: 14px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 1;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        margin-top: 25px;
                        em{
                          color: rgb(255, 255, 255, .7);
                        }
                      }
                      .item-content-participant-user{
                        height: auto;
                        clear: both;
                        margin-top: 13px;
                        .user-list{
                          width: 34px;
                          height: 34px;
                          float: left;
                          margin-left: -10px;
                          border-radius: 50%;
                          overflow: hidden;
                          img{
                            width: 100%;
                            height: 100%;
                            display: block;
                          }
                        }
                      }
                    }
                  }
                }
              }
              .posInit{
                position: initial;
                .item-content-name{
                  width: calc(100% - 40px) !important;
                }
              }
              .ntfPos{
                top: 15px !important;
              }
            }
          }
        }
      }
    }
  }
</style>
