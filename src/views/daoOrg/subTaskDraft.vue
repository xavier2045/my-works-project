<template>
  <div class="taskList">
    <persHeader />
    <div class="taskList-container">
      <div class="taskList-content">
        <div class="taskList-content-main">
          <infinite-scroll-list
            :fetchFunction="fetchNews"
            :hasMore="hasMore"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="30" :cols="3">
                <div 
                  v-for="(item, index) in items" 
                  :key="item.missionId" 
                  class="subTask-item fade-up-item"
                >
                <div class="subTask-item-content">
                  <div class="subTask-item-pic">
                    <div class="subTask-item-pic-main">
                      <img :src="item.cover" alt="" />
                      <div class="sunTaskName">{{ item.name }}</div>
                    </div>
                  </div>
                  <div class="subTask-item-info">
                    <div class="item-info-datas">
                      <div class="datas-item">
                        <div class="datas-item-icon">
                            <i class="icon font_family icon-rili24"></i>
                        </div>
                        <div class="datas-item-progress">
                          <div class="progress-bar">
                              <div class="progress-bar-display">
                                  <div class="link-l"></div>
                                  <div class="link-c">{{ item.day }}天</div>
                                  <div class="link-r"></div>
                              </div>
                          </div>
                        </div>
                        <div class="progress-name">任务周期</div>
                      </div>
                      <div class="datas-item">
                        <div class="datas-item-icon">
                            <i class="icon font_family icon-jiedian24_1"></i>
                        </div>
                        <div class="datas-item-progress">
                          <div class="progress-bar">
                              <div class="progress-bar-display">
                                  <div class="link-l"></div>
                                  <div class="link-c">{{ item.nodePeriod }}天</div>
                                  <div class="link-r"></div>
                              </div>
                          </div>
                        </div>
                        <div class="progress-name">节点周期</div>
                      </div>
                      <div class="datas-item">
                        <div class="datas-item-icon">
                            <i class="icon font_family icon-xinren24"></i>
                        </div>
                        <div class="datas-item-progress">
                          <div class="progress-text" :style="{left: (Number(item.trustValue) ? Number(item.trustValue) - 6 : 0) +'%'}">{{ item.trustValue || 0 }}</div>
                            <div class="progress-bar">
                                <ScaleProgressBar :max="100" :progress="Number(item.trustValue) || 0" :showPercentage="true" />
                            </div>
                        </div>
                        <div class="progress-name">信任值</div>
                      </div>
                    </div>
                    <div class="item-info-operation">
                      <div class="item-info-operation-icon">
                      </div>
                    </div>
                  </div>
                  <div class="subTask-item-receive">
                    <div class="receive-content">
                      <div class="receive-content-left">
                        <!-- <div class="task-draft-main flag" @click="handleReleaseTask(item)">
                          <div class="task-draft-text">发布任务</div>
                        </div> -->
                      </div>
                      <div class="receive-content-right">
                        <div class="operation-bot">
                          <div class="flex-main-select" @click="toTaskEdit(item)">
                              编辑草稿
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
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { missionsDaosTasksDraftList } from '@/api/task';
  import { subTasksList } from '@/api/dao';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  import { extractIdFromUrl } from '@/utils';

  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  const hasDraft = ref(0);
  const router = useRouter();
  const hasMore = ref(true);

  const fetchNews = async (page: number) => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
      let getData = {
        missionId: id,
        pageNum: page,
        pageSize: 16,
      }
      console.log(getData);
      try {
        const response = await missionsDaosTasksDraftList(getData);
        const { code, data, message } = response;

        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }
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

  // 立即发布
  const handleReleaseTask = (item: any) => {
    console.log(item);
  }

  // 编辑子任务
  const toTaskEdit = async (item: string) => {
    userInfo.subTaskDraftId = item.taskId;
    userInfo.openCreateSubTaskType = 2;
    router.push({ name: 'CreateSubtask'});
  };

  onMounted(() => {
    
  });
</script>

<style lang='scss' scoped>
  .taskList{
    padding-left: 20px;
    height: 100%;
    .taskList-container{
      width: 100%;
      height: calc(100% - 90px);
      .taskList-content{
        width: 100%;
        height: 100%;
        .taskList-content-main{
          width: 100%;
          height: 100%;
          .subTask-item {
            width: 232px;
            height: auto;
            padding: 10px;
            cursor: pointer;
            border-radius: 28px;
            :hover{
              border-color: #FFFFFF;
              .subTask-item-pic {
                .subTask-item-pic-main{
                  img {
                    transform: scale(1.1);
                  }
                }
                
              }
            }
            .subTask-item-content {
              width: calc(100% - 40px);
              position: relative;
              border-radius: 18px;
              overflow: hidden;
              padding: 20px;
              background: rgba(229, 229, 229, 0.08);
              backdrop-filter: blur(40px);
              border: 1px solid rgb(255, 255, 255, .38);
              box-shadow: 0px 0px 56px 1px rgba(0,0,0,0.12);
              .subTask-item-pic {
                padding: 6px;
                .subTask-item-pic-main{
                  width: 100%;
                  height: 208px;
                  border-radius: 18px;
                  overflow: hidden;
                  position: relative;
                  img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    border-radius: 18px;
                    transition: all 1s;
                  }
                  .sunTaskName{
                    width: 136px;
                    height: 34px;
                    font-weight: 400;
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 34px;
                    text-align: center;
                    position: absolute;
                    left: 10px;
                    bottom: 10px;
                    z-index: 1;
                    box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5), /* 外发光 */
                          -1px 1px 3px rgba(255, 255, 255, 0.5) inset; /* 内发光 */
                    border-radius: 8px 8px 8px 8px;
                    border: 1px solid rgba(0, 0, 0, 0.01);
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(9px);
                  }
                }
              }
              .subTask-item-info{
                width: 100%;
                height: auto;
                display: flex;
                justify-content: space-between;
                .item-info-datas{
                  flex: 1;
                  width: 0;
                  .datas-item{
                    width: 100%;
                    height: auto;
                    display: flex;
                    margin-top: 15px;
                    justify-content: flex-start;
                    .datas-item-icon{
                      width: 57px;
                      height: 58px;
                      flex-shrink: 0;
                      background: url(@/assets/images/task/icon_bg.png) no-repeat center center;
                      background-size: 100% 100%;
                      i{
                          font-size: 24px;
                          line-height: 1;
                          display: block;
                          padding: 14px 0 0 14px;
                          color: rgb(255, 255, 255, .7);
                      }
                    }
                    .datas-item-progress{
                      flex: 1;
                      width: 0;
                      position: relative;
                      .progress-text{
                          font-weight: 400;
                          font-size: 16px;
                          color: rgb(255, 255, 255, .7);
                          line-height: 1;
                          text-align: left;
                          display: inline-block;
                          position: absolute;
                          top: 0;
                          left: 0;
                      }
                      .progress-bar{
                          width: 100%;
                          margin-top: 15px;
                          .progress-bar-display{
                              width: 100%;
                              height: auto;
                              display: flex;
                              justify-content: space-between;
                              .link-l{
                                  flex-grow: 1;
                                  height: 1px;
                                  margin-top: 12px;
                                  position: relative;
                                  background-color: rgb(255, 255, 255, .38);
                                  &::before{
                                      content: '';  // 必须设置 content 属性
                                      display: inline-block;
                                      width: 7px;
                                      height: 7px;
                                      border-radius: 50%;
                                      background-color: rgba(255, 255, 255, 1);
                                      vertical-align: middle;
                                      position: absolute;
                                      top: 50%;
                                      transform: translateY(-50%);
                                      left: 0;
                                      z-index: 2;
                                  }
                              }
                              .link-c{
                                  width: 60px;
                                  height: 24px;
                                  font-weight: 400;
                                  font-size: 16px;
                                  color: #FFFFFF;
                                  line-height: 26px;
                                  text-align: center;
                                  border-radius: 4px;
                                  border: 1px solid rgb(255, 255, 255, .38);
                              }
                              .link-r{
                                  flex-grow: 1;
                                  height: 1px;
                                  margin-top: 12px;
                                  position: relative;
                                  background-color: rgb(255, 255, 255, .38);
                                  &::before{
                                      content: '';  // 必须设置 content 属性
                                      display: inline-block;
                                      width: 7px;
                                      height: 7px;
                                      border-radius: 50%;
                                      background-color: rgba(255, 255, 255, 1);
                                      vertical-align: middle;
                                      position: absolute;
                                      top: 50%;
                                      transform: translateY(-50%);
                                      right: 0;
                                      z-index: 2;
                                  }
                              }
                          }
                      }
                    }
                    .progress-name{
                      font-weight: 400;
                      font-size: 14px;
                      color: rgb(255, 255, 255, .7);
                      line-height: 58px;
                      text-align: right;
                      margin-left: 10px;
                    }
                    .datas-item-two{
                        width: 100%;
                        height: auto;
                        display: flex;
                        justify-content: space-between;
                        .datas-item-two-li{
                            width: 50%;
                            height: auto;
                            .datas-item-two-li-m{
                                width: 100%;
                                height: auto;
                                display: flex;
                                .li-m-icon{
                                    width: 57px;
                                    height: auto;
                                    flex-shrink: 0;
                                }
                                .li-m-text{
                                    flex: 1;
                                    width: 0;
                                    .li-m-text-name{
                                        width: 100%;
                                        font-weight: 400;
                                        font-size: 14px;
                                        color: rgb(255, 255, 255, .7);
                                        line-height: 1;
                                        text-align: left;
                                        margin-top: 10px;
                                    }
                                    .li-m-text-data{
                                        width: 100%;
                                        font-weight: 400;
                                        font-size: 14px;
                                        color: rgb(255, 255, 255, 1);
                                        line-height: 1;
                                        text-align: left;
                                        margin-top: 10px;
                                    }
                                }
                            }
                        }
                    }
                  }
                }
                .item-info-operation{
                  width: 60px;
                  flex-shrink: 0;
                  .item-info-operation-icon{
                    width: 32px;
                    height: auto;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      line-height: 32px;
                      text-align: center;
                    }
                  }
                }
              }
              .subTask-item-receive{
                width: 100%;
                height: auto;
                .receive-content{
                  width: 100%;
                  height: auto;
                  display: flex;
                  justify-content: space-between;
                  .receive-content-left{
                    width: 120px;
                    .task-draft-main{
                      width: auto;
                      height: 32px;
                      padding: 0 20px;
                      margin-top: 5px;
                      border-radius: 19px;
                      box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5), /* 外发光 */
                                -1px 1px 3px rgba(255, 255, 255, 0.5) inset; /* 内发光 */
                      background: rgba(0, 0, 0, 0.26);
                      backdrop-filter: blur(20px);
                      &:hover {
                        background: rgba(0, 0, 0, 0.16);
                      }
                      .task-draft-text{
                        font-weight: 400;
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 32px;
                        text-align: center;
                      }
                    }
                    .flag{
                      box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.3),
                                -1px 1px 3px rgba(255, 255, 255, 0.3) inset;
                      background: rgba(0, 0, 0, 0.16);
                      .task-draft-text{
                        color: rgba(255, 255, 255, 0.68);
                      }
                    }
                  }
                  .receive-content-right{
                    width: 100px;
                    .operation-bot{
                      width: 93px;
                      height: 43px;
                      margin: 0 auto;
                      background: url(@/assets/images/publish/draft_but_bg.png) no-repeat center center;
                      background-size: 100% 100%;
                      &:hover {
                        background: url(@/assets/images/publish/draft_but_bg_hover.png) no-repeat center center;
                        background-size: 100% 100%;
                      }
                      .flex-main-select{
                        font-weight: 400;
                        font-size: 14px;
                        color: #FFFFFF;
                        line-height: 43px;
                        text-align: center;
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
