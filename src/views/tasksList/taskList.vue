<template>
  <div class="taskList">
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
              <wc-waterfall :gap="30" :cols="4">
                <div 
                  v-for="item in items" 
                  :key="item.missionId" 
                  class="list-item fade-up-item"
                  @click="toTaskDetail(item.missionId)"
                >
                  <div class="subTask-item-type">
                    <template v-if="item.isUrgent == 1">
                      <img :src="TaskExigency" alt="紧急" title="紧急任务" />  
                    </template>
                    <template v-if="item.status == 2">
                      <img :src="TaskComplete" alt="完成" title="任务已完成" />
                    </template>
                  </div>
                  <template v-if="item.cover !== ''">
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
                      <!-- <div class="activities-ntf"
                        v-if="item.nft !== ''" 
                        @click="copyContent(item.nft)">
                        <i class="icon font_family icon-lianjie24"></i>
                      </div> -->
                      <div class="list-item-main-content">
                        <div class="item-content-info">
                          <div class="item-content-name">{{ item.name }}</div>
                          <div class="item-content-taskId">
                            <div class="item-content-taskId-id">任务ID：{{ item.missionId }}</div>
                            <div class="item-content-taskId-cmtcnt">
                              <div class="item-content-taskId-cmtcnt-item">
                                <div class="item-content-taskId-cmtcnt-item-icon">
                                   <!-- 0 未启动 1执行中 2已完成 3暂停 4取消  -->
                                  <template v-if="item.status === 0">
                                    <i class="icon font_family icon-shaloushijian24"></i>
                                  </template>
                                  <template v-else-if="item.status === 1">
                                    <i class="icon font_family icon-jinhangzhong"></i>
                                  </template>
                                  <template v-else-if="item.status === 2">
                                    <i class="icon font_family icon-gouxuanyuanxingbiankuang24"></i>
                                  </template>
                                  <template v-else-if="item.status === 3">
                                    <i class="icon font_family icon-shaloushijian24"></i>
                                  </template>
                                  <template v-else-if="item.status === 4">
                                    <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                                  </template>
                                </div>
                                <div class="item-content-taskId-cmtcnt-item-num">
                                  <template v-if="item.status === 0">
                                    未开始
                                  </template>
                                  <template v-else-if="item.status === 1">
                                    执行中
                                  </template>
                                  <template v-else-if="item.status === 2">
                                    已结束
                                  </template>
                                  <template v-else-if="item.status === 3">
                                    暂未开启
                                  </template>
                                  <template v-else-if="item.status === 4">
                                    已取消
                                  </template>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="item-content-flex">
                            <div class="item-content-participant">
                              <div class="item-content-participant-num">
                                <template v-if="item.no < 1">
                                  暂无人接收任务
                                </template>
                                <template v-else>
                                  <template v-if="item.status === 0">
                                    <em>{{ item.no }}</em>人已申请任务
                                  </template>
                                  <template v-else-if="item.status == 2">
                                  <em>{{ item.partCnt }}</em>人已执行任务
                                </template>
                                  <template v-else>
                                    <em>{{ item.no }}</em>人参与任务
                                  </template>
                                </template>
                              </div>
                              <div class="item-content-participant-user">
                                <div
                                  class="user-list"
                                  v-for="(user, index) in item.users.slice(0, 3)"
                                  :key="index"
                                >
                                  <img :src="user.avatar" alt="" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="list-item-main">
                      <!-- <div class="activities-ntf ntfPos"
                        v-if="item.nft !== ''" 
                        @click="copyContent(item.nft)">
                        <i class="icon font_family icon-lianjie24"></i>
                      </div> -->
                      <div class="list-item-main-content posInit">
                        <div class="item-content-info">
                          <div class="item-content-name">{{ item.name }}</div>
                          <div class="item-content-taskId">
                            <div class="item-content-taskId-id">任务ID：{{ item.missionId }}</div>
                            <div class="item-content-taskId-cmtcnt">
                              <div class="item-content-taskId-cmtcnt-item">
                                <div class="item-content-taskId-cmtcnt-item-icon">
                                  <!-- 0 未启动 1执行中 2已完成 3暂停 4取消  -->
                                  <template v-if="item.status === 0">
                                    <i class="icon font_family icon-shaloushijian24"></i>
                                  </template>
                                  <template v-else-if="item.status === 1">
                                    <i class="icon font_family icon-renwujinhangzhong44"></i>
                                  </template>
                                  <template v-else-if="item.status === 2">
                                    <i class="icon font_family icon-gouxuanyuanxingbiankuang24"></i>
                                  </template>
                                  <template v-else-if="item.status === 3">
                                    <i class="icon font_family icon-shaloushijian24"></i>
                                  </template>
                                  <template v-else-if="item.status === 4">
                                    <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                                  </template>
                                </div>
                                <div class="item-content-taskId-cmtcnt-item-num">
                                  <template v-if="item.status === 0">
                                    未开始
                                  </template>
                                  <template v-else-if="item.status === 1">
                                    执行中
                                  </template>
                                  <template v-else-if="item.status === 2">
                                    已结束
                                  </template>
                                  <template v-else-if="item.status === 3">
                                    暂未开启
                                  </template>
                                  <template v-else-if="item.status === 4">
                                    已取消
                                  </template>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="item-content-flex">
                            <div class="item-content-participant">
                              <div class="item-content-participant-num">
                                <template v-if="item.no < 1">
                                  暂无人接收任务
                                </template>
                                <template v-else>
                                  <template v-if="item.status === 0">
                                    <em>{{ item.no }}</em>人已申请任务
                                  </template>
                                  <template v-else-if="item.status == 2">
                                  <em>{{ item.partCnt }}</em>人已执行任务
                                </template>
                                  <template v-else>
                                    <em>{{ item.no }}</em>人参与任务
                                  </template>
                                </template>
                              </div>
                              <div class="item-content-participant-user">
                                <div
                                  class="user-list"
                                  v-for="(user, index) in item.participant.slice(0, 3)"
                                  :key="index"
                                >
                                  <img :src="user.avatar" alt="" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
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
  import { taskList } from '@/api/task';
  import { aeUseStore } from '@/stores/user';
  import { getItem, setItem } from '@/utils/index';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import SuspMenu from '@/components/suspMenu/index.vue';
  import HeaderView from '@/components/header/header.vue';
  import { showPopup } from '@/utils/usePopup';
  import { initAOS } from '@/animations/aos';
  import TaskExigency from '@/assets/images/common/exigency.png';
  import TaskComplete from '@/assets/images/common/complete.png';

  const router = useRouter();
  const isMenuShow= ref(false);
  const userStore = aeUseStore();

  // 获取缓存数据
  const userInfo = ref({});
  if (userStore.userInfo.userName !== '' && userStore.userInfo.userName !== undefined && userStore.userInfo.userName !== null) {
      userInfo.value = userStore.getUserInfo;
      userInfo.value.avatar = userInfo.value.avatar || '';
      console.log('userInfo.value.active1',userInfo.value);
  } else {
      if(getItem('userName') !== '' && getItem('userName') !== undefined && getItem('userName') !== null) {
          userInfo.value = getItem('userInfo');
          userInfo.value.avatar = userInfo.value.avatar || '';
          console.log('userInfo.value.active2',userInfo.value);
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
  const options = ref([
    {value: '', label: '所有的'},
    {value: '0', label: '未开始'},
    {value: '1', label: '执行中'},
    {value: '2', label: '已结束'},
    {value: '3', label: '已取消'},
  ]);

  const taskData = ref({
    taskStatus: 0,
    screenData: '',
    concern: 0,
    ongoing: 0,
    completed: 0,
  });

  const hasMore = ref(true);

  const currentFilterCriteria = ref({
    businessType: 1,
    value: '',
    status: ''
  });

  watch([searchQuery, selectedOption], () => {
    // 当searchQuery或selectedOption变化时，执行搜索逻辑
    currentFilterCriteria.value.status = selectedOption.value;
    currentFilterCriteria.value.value = searchQuery.value;
  });

  const fetchNews = async (page: number) => {
      let getData = {
        pageNum: page,
        pageSize: 16
      } as { pageNum: number; pageSize: number; status?: string; value?: string };
      if(currentFilterCriteria.value.status !== '') {
        getData.status = currentFilterCriteria.value.status;
      }
      if(currentFilterCriteria.value.value !== '') {
        getData.value = currentFilterCriteria.value.value;
      }
      console.log(getData);
      try {
        const response = await taskList(getData);
        const { code, data, message } = response;

        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }
        taskData.value.concern = data.followNum;
        taskData.value.ongoing = data.statusIngNum;
        taskData.value.completed = data.statusDoneNum;

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

  // 点击任务详情
  const toTaskDetail = async (missionId: string) => {
    let id = missionId;
    userStore.userInfo.taskType = 1;
    setItem('taskType', 1);
    router.push({ name: 'TataskDetails', params: { id } });
  };

  onMounted(() => {
    initAOS();
  });
</script>

<style lang='scss' scoped>
  .taskList{
    height: 100%;
    // padding: 0 225px;
    background: url(@/assets/images/pc/pcBg.jpg) no-repeat;
    background-size: 100% 100%;
    .main-content-header{
        width: 100%;
        height: auto;
        margin: 0 auto;
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
      width: 100%;
      height: calc(100% - 120px);
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
        height: calc(100% - 25px);
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
            .subTask-item-type{
              width: 89px;
              height: 89px;
              position: absolute;
              top: -5px;
              right: -5px;
              z-index: 1;
              img{
                width: 100%;
                height: 100%;
                display: block;
              }
            }
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
                height: 100px;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                border-radius: 8px 8px 24px 24px;
                padding: 20px 20px 16px 20px;
                background: rgba(255, 255, 255, .16);
                backdrop-filter: blur(52px);
                .item-content-info{
                  width: 100%;
                  height: auto;
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
