<template>
  <div class="taskList">
    <persHeader />
    <div class="taskList-container">
      <div class="taskList-content" data-aos="fade-up">
        <div class="taskList-content-main">
          <infinite-scroll-list
            :fetchFunction="fetchNews"
            :hasMore="hasMore"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="30" :cols="4">
                <div 
                  v-for="(item, index) in items" 
                  :key="item.missionId" 
                  class="list-item fade-up-item"
                  @click="toTaskDetail(item)"
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
                    <div class="list-item-main-content">
                      <div class="item-content-info">
                        <div class="item-content-info-main">
                          <div class="item-content-info-main-l">
                            <div class="info-main-l-name multi-line-1">{{ item.name }}</div>
                            <div class="info-main-l-item">
                              <div class="item-li">
                                <i class="icon font_family icon-zhuanfa20"></i>
                                <span>{{ item.seeNum }}</span>
                              </div>
                              <div class="item-li">
                                <i class="icon font_family icon-guanzhu20"></i>
                                <span>{{ item.followNum }}</span>
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
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { worksDraftList } from '@/api/work';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  import { initAOS } from '@/animations/aos';

  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  const hasDraft = ref(0);
  const router = useRouter();
  const hasMore = ref(true);

  const fetchNews = async (page: number) => {
      let getData = {
        pageNum: page,
        pageSize: 16,
      }
      try {
        const response = await worksDraftList(getData);
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

  // 点击任务详情
  const toTaskDetail = async (item: any) => {
    userInfo.workDraftId = item.id;
    userInfo.openworkType = 2;
    if(item.isCommercial == 0) {
      router.push({ name: 'Normal'});
    } else if(item.isCommercial == 1) {
      router.push({ name: 'CommercialUse'});
    }
    
  };

  onMounted(() => {
    initAOS();
  });
</script>

<style lang='scss' scoped>
  .taskList{
    padding-left: 20px;
    height: calc(100% - 11px);
    .taskList-container{
      width: 100%;
      height: calc(100% - 114px);
      .taskList-content{
        width: 100%;
        height: calc(100% - 25px);
        .taskList-content-main{
          width: 100%;
          height: 100%;
          :deep(.el-scrollbar__view){
            padding-top: 52px;
          }
          .list-item{
            width: 270px;
            height: auto;
            border-radius: 24px;
            overflow: hidden;
            break-inside: avoid;
            margin-bottom: 30px;
            cursor: pointer;
            box-shadow: 0px 0px 8px 9px rgb(0, 0, 0, .15);
            .list-item-main{
              width: 100%;
              height: auto;
              min-height: 270px;
              position: relative;
              .list-item-main-img{
                width: 100%;
                height: auto;
                display: block;
                img{
                  width: 100%;
                  height: auto;
                  display: block;
                }
              }
              .activities-draft{
                width: 130px;
                height: 38px;
                border-radius: 19px;
                position: absolute;
                top: 15px;
                left: 15px;
                z-index: 1;
                background: rgba(255, 255, 255, .16);
                backdrop-filter: blur(52px);
                .activities-draft-main{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  .activities-draft-main-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 7px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height:38px;
                    }
                  }
                  .activities-draft-main-text{
                    font-weight: 400;
                    font-size: 16px;
                    color:rgb(255, 255, 255, .7);
                    line-height: 38px;
                    text-align: left
                  }
                }
                
              }
              .list-item-main-content{
                height: auto;
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
                      width: 50px;
                      .works-type{
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        .works-type-icon{
                          width: 100%;
                          height: 100%;
                          i{
                            font-size: 24px;
                            color: rgb(255, 255, 255, .9);
                            text-align: center;
                            line-height: 50px;
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
