<template>
  <div class="proposal">
    <div class="proposal-container">
      <div class="proposal-header">
        <div class="proposal-header-flex">
          <div class="proposal-header-flex-l">
            <div class="proposal-header-flex-l-main">
              <div class="proposal-header-flex-l-main-previous">
                <div class="previous-icon" @click="goBack">
                  <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
                </div>
                <div class="previous-name">任务提案</div>
              </div>
            </div>
          </div>
          <div class="proposal-header-flex-c"></div>
          <div class="proposal-header-flex-r">
            <div class="proposal-header-flex-r-main">
              <div
                class="flex-r-main-typeList"
                :class="{ flag: type.value === isType}"
                v-for="(type, index) in typeData"
                :key="index"
                @click="findTypeFun(type)"
              >
                <div class="flex-r-main-typeList-item">{{ type.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="proposal-content">
        <div class="proposal-content-main">
          <infinite-scroll-list
            :fetchFunction="fetchNews"
            :hasMore="hasMore"
            :filterCriteria="currentFilterCriteria"
            :key="scrollListKey"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="30" :cols="3">
                <div 
                  v-for="item in items" 
                  :key="item.missionId" 
                  class="list-item fade-up-item"
                  
                >
                  <div class="list-item-main">
                    <div class="list-item-main-content">
                      <div class="item-content-info">
                        <div class="item-content-info-header">
                          <div class="item-user">
                            <div class="item-user-info">
                              <div class="item-user-info-main">
                                <div class="item-user-info-avatar">
                                  <img :src="item.userAvatar" alt="" />
                                </div>
                                <div class="item-user-info-text">
                                  <div class="item-user-info-taskName">{{ item.userPost }}</div>
                                  <div class="item-user-info-userName">{{ item.username }}</div>
                                </div>
                              </div>
                            </div>
                            <div class="see-detail" @click="toTaskDetail(item)">
                              <i class="icon font_family icon-a-jiantouxiangyouyue20"></i>
                            </div>
                          </div>
                        </div>
                        <div class="item-content-title">{{ item.name }}</div>
                        <div class="item-content-desc" v-html="item.content"></div>
                        <div class="item-content-vote">
                          <div class="item-content-vote-main">
                            <div class="item-content-vote-info">
                              <div class="item-content-vote-info-main">
                                <div class="item-content-vote-info-icon">
                                  <div class="item-content-vote-info-icon-main">
                                    <i class="icon font_family icon-shaloushijian20"></i>
                                  </div>
                                </div>
                                <div class="item-content-vote-info-text">
                                  <div class="item-content-vote-info-text-title">距离投票结束</div>
                                  <div class="item-content-vote-info-text-desc">
                                    <!-- <template v-if="item.status == 0">投票未开始</template>
                                    <template v-else>
                                      <CountdownComponent
                                        :type="2"
                                        :orderTime="item.startTime"
                                        :endTime="item.endTime"
                                        @countdownFinished="handleCountdownFinished"
                                      />
                                    </template> -->
                                    <template v-if="userInfo.isDaoMember == 0">
                                      <template v-if="!item.hiddenTime">
                                          <CountdownComponent
                                            :type="2"
                                            v-if="item.startTime !== ''"
                                            :orderTime="item.startTime"
                                            :endTime="item.endTime"
                                            @countdownFinished="handleCountdownFinished(item)"
                                          />
                                      </template>
                                      <template v-else>
                                        投票已结束
                                      </template>
                                    </template>
                                    <template v-else>
                                      <template v-if="!item.hiddenTime">
                                        <template v-if="item.isAgree == null">
                                          <CountdownComponent
                                            :type="2"
                                            v-if="item.startTime !== ''"
                                            :orderTime="item.startTime"
                                            :endTime="item.endTime"
                                            @countdownFinished="handleCountdownFinished(item)"
                                          />
                                        </template>
                                        <template v-else>
                                          您已投票
                                          <span class="color-main">{{item.isAgree == 1 ? '赞成' : '反对'}}</span>
                                        </template>
                                      </template>
                                      <template v-else>
                                        投票已结束
                                      </template>
                                    </template>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <template v-if="missionMode !== 1">
                              <div class="item-content-vote-num"><span>{{ item.total || 0 }}</span>人参与投票</div>
                            </template>
                          </div>
                        </div>
                        <div class="item-content-result">
                          <div class="item-content-result-main">
                            <template v-if="userInfo.isDaoMember == 0">
                              <Evaluate
                                :id="item.proposalId"
                                :initialLikes="item.agreeNum"
                                :initialDislikes="item.disAgreeNum"
                                :voted="true"
                                @vote="handleVote"
                              />
                            </template>
                            <template v-else>
                              <template v-if="missionMode == 1">
                                <template v-if="missionCreateUserId !== userInfo.id">
                                  <template v-if="details.isAgree == null">
                                    <Evaluate
                                      :id="item.proposalId"
                                      :initialLikes="item.agreeNum"
                                      :initialDislikes="item.disAgreeNum"
                                      :voted="false"
                                      @vote="handleVote"
                                    />
                                  </template>
                                </template>
                              </template>
                              <template v-else>
                                <Evaluate
                                  :id="item.proposalId"
                                  :initialLikes="item.agreeNum"
                                  :initialDislikes="item.disAgreeNum"
                                  :voted="item.isAgree !== null ? true : false"
                                  @vote="handleVote"
                                />
                              </template>
                            </template>
                          </div>
                        </div>
                        <div class="item-content-tips" v-if="item.isAgree !== null">您已参与此提案投票</div>
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
    <el-drawer v-model="drawer" title="" :with-header="false">
      <div class="drawer-content">
        <div class="drawer-content-main">
          <div class="drawer-content-main-header">
            <div class="drawer-content-main-header-main">
              <div class="userAvatar">
                <el-image :src="details.userAvatar" lazy />
              </div>
              <div class="userPost">{{ details.userPost }}</div>
              <div class="username">{{ details.username }}</div>
            </div>
          </div>
          <div class="drawer-content-main-content">
            <div class="drawer-content-main-content-main">
              <div class="name">{{ details.name }}</div>
              <div class="content" v-html="details.content"></div>
            </div>
          </div>
          <div class="drawer-content-main-footer">
            <div class="drawer-content-main-footer-main">
              <div class="drawer-content-main-footer-main-info">
                <div class="drawer-content-main-footer-main-info-main">
                  <div class="proposal-time">
                    <div class="proposal-time-main">
                      <div class="proposal-time-main-icon">
                        <i class="icon font_family icon-shaloushijian20"></i>
                      </div>
                      <div class="proposal-time-main-text">
                        <div class="proposal-time-main-title">距离投票结束</div>
                        <div class="proposal-time-main-desc">
                          <template v-if="userInfo.isDaoMember == 0">
                            <template v-if="!details.hiddenTime">
                                <CountdownComponent
                                  :type="2"
                                  v-if="details.startTime !== ''"
                                  :orderTime="details.startTime"
                                  :endTime="details.endTime"
                                  @countdownFinished="handleCountdownFinished(details)"
                                />
                            </template>
                            <template v-else>
                              投票已结束
                            </template>
                          </template>
                          <template v-else>
                            <template v-if="!details.hiddenTime">
                              <template v-if="details.isAgree == null">
                                <CountdownComponent
                                  :type="2"
                                  v-if="details.startTime !== ''"
                                  :orderTime="details.startTime"
                                  :endTime="details.endTime"
                                  @countdownFinished="handleCountdownFinished(details)"
                                />
                              </template>
                              <template v-else>
                                您已投票
                                <span class="color-main">{{details.isAgree == 1 ? '赞成' : '反对'}}</span>
                              </template>
                            </template>
                            <template v-else>
                              投票已结束
                            </template>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="proposal-num">
                    <template v-if="missionMode !== 1">
                      <span>{{ details.total }}</span>人已参与投票
                    </template>
                  </div>
                </div>
              </div>
              <div class="drawer-content-main-footer-main-evaluate">
                {{userInfo.isDaoMember}}
                <template v-if="userInfo.isDaoMember == 0">
                  <Evaluate
                    :id="details.proposalId+''"
                    :initialLikes="details.agreeNum"
                    :initialDislikes="details.disAgreeNum"
                    :voted="true"
                    @vote="handleVote"
                  />
                </template>
                <template v-else>
                  <template v-if="missionMode == 1">
                    <template v-if="missionCreateUserId !== userInfo.id">
                      <template v-if="details.isAgree == null">
                        <Evaluate
                          :id="details.proposalId+''"
                          :initialLikes="details.agreeNum"
                          :initialDislikes="details.disAgreeNum"
                          :voted="false"
                          @vote="handleVote"
                        />
                      </template>
                    </template>
                  </template>
                  <template v-else>
                    <Evaluate
                      :id="details.proposalId+''"
                      :initialLikes="details.agreeNum"
                      :initialDislikes="details.disAgreeNum"
                      :voted="details.isAgree !== null ? true : false"
                      @vote="handleVote"
                    />
                  </template>
                </template>
              </div>
              <div class="drawer-content-main-footer-main-tips">
                <template v-if="details.isAgree !== null">您已参与此提案投票</template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 您已参与此提案的投票   -->
    <div class="popupModal" v-if="isAp">
        <div class="masking"></div>
        <div class="popupModal-center" style="width: 282px;">
            <div class="popupModal-main" style="width: 282px;">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-content-title">您已参与此提案的投票</div>
              </div>
            </div>
            <div class="close" @click="isAp = false">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, nextTick, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { proposalsList, proposaproposalsVotelsSave } from '@/api/dao';
  import { extractIdFromUrl, getItem } from '@/utils/index';
  import Evaluate from '@/components/evaluate/index.vue';
  import { showPopup } from '@/utils/usePopup';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import CountdownComponent from '@/components/CountdownComponent/index.vue';
  import { aeUseStore } from '@/stores/user';
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;

  const router = useRouter();

  console.log('userInfo', userInfo.isDaoMember);

  const isAp = ref(false); // 已参与投票弹窗
  const missionCreateUserId = ref(0);
  const missionMode = ref(0);
  const scrollListKey = ref(0); // 列表刷新key

  const typeData = ref([
    { label: '全部', value: 0 },
    { label: '进行中', value: 1 },
    { label: '已完成', value: 2 },
  ]);

  const isType = ref(0);
  const findTypeFun = async (item: any) => {
    isType.value = item.value;
  };

  const taskData = ref({
    taskStatus: 0,
    screenData: '',
    concern: 0,
    ongoing: 0,
    completed: 0,
  });

  const details = ref({
    userId: '',
    username: '',
    userAvatar: '',
    userPost: '',
    proposalId: null as number | null,
    name: '',
    content: '',
    startTime: '',
    endTime: '',
    total: 15,
    agreeNum: 10,
    disAgreeNum: 5,
    isPass: 1,
    isAgree: null
  });


  // 返回上一页
  const goBack = () => {
    router.go(-1);
  };

  /**  倒计时结束回调 **/
  const hiddenTime = ref(false);
  const handleCountdownFinished = (item: any) => {
      console.log('倒计时结束');
      item.hiddenTime = true;
  };

  // 处理投票的回调
  const votedResult = ref(0);  // 选择的结果
  const isAgree = ref(false);  // 已经选择过禁止选择
  const handleVote = (result: string, id: any) => {
    
    ;
    votedResult.value = result === 'like' ? 1 : 0;
    console.log('proposalId.value', id);
    console.log('details.value.proposalId', details.value.proposalId);
    let reqData = {
      proposalId: id,
      isAgree: votedResult.value
    }
    console.log('reqData', reqData);
    return new Promise<void>((resolve, reject) => {
      proposaproposalsVotelsSave(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        isAgree.value = true;
        showPopup('投票成功', 'success', 3000);
        currentFilterCriteria.value.status = 0;
        scrollListKey.value += 1; // 刷新列表
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  

  const drawer = ref(false);

  const hasMore = ref(true);
  const isfoll = ref(0); // 关注
  const isStates = ref(0);

  const currentFilterCriteria = ref({
    type: taskData.value.taskStatus,
    status: isStates.value,
    isFollow: isfoll.value
  });

  const fetchNews = async (page: number) => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    let getData = {
        pageNum: page,
        pageSize: 16,
        businessType: userInfo.proposalType,
        businessId: id,
    }
    console.log(getData);
    try {
      const response = await proposalsList(getData);
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

  // 点击获取提案详情，展开侧边栏
  const toTaskDetail = async (item: any) => {
    drawer.value = true
    details.value = item;
  };

  onMounted(() => {
    if(userInfo.missionMode !== '') {
      missionMode.value = userInfo.missionMode;
    } else {
      missionMode.value = getItem('missionMode');
    }
    if(userInfo.missionCreateUserId !== '') {
      missionCreateUserId.value = userInfo.missionCreateUserId;
    } else {
      missionCreateUserId.value = getItem('missionCreateUserId');
    }
  });
</script>

<style lang='scss' scoped>
  .proposal{
    width: 100%;
    height: calc(100% - 11px);
    .proposal-container{
      height: 100%;
      padding: 0 31px;
      .proposal-header{
        width: 100%;
        height: auto;
        margin-top: 30px;
        .proposal-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .proposal-header-flex-l{
            height: auto;
            flex-shrink: 0;
            .proposal-header-flex-l-main{
              width: 100%;
              height: auto;
              
              .proposal-header-flex-l-main-previous{
                width: auto;
                height: auto;
                display: flex;
                justify-content: space-between;
                .previous-icon{
                  width: 24px;
                  height: auto;
                  margin-right: 10px;
                  cursor: pointer;
                  i{
                    font-size: 24px;
                    color: #FFFFFF;
                    display: block;
                    line-height: 24px;
                    text-align: center;
                  }
                }
                .previous-name{
                  width: auto;
                  font-size: 20px;
                  color: #FFFFFF;
                  line-height: 24px;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                }
              }
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
          .proposal-header-flex-c{
            flex-grow: 1;
          }
          .proposal-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .proposal-header-flex-r-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .flex-r-main-typeList{
                width: 65px;
                height: 26px;
                cursor: pointer;
                border: 1px solid rgb(255, 255, 255, .38);
                border-right: none;
                background-color: rgb(255, 255, 255, .1);
                &:nth-child(1) {
                  border-radius: 8px 0 0 8px;
                }
                &:last-child{
                  border-right: 1px solid rgb(255, 255, 255, .38);
                  border-radius: 0 8px 8px 0;
                }
                .flex-r-main-typeList-item{
                  font-size: 14px;
                  color: rgb(255, 255, 255, .7);
                  line-height: 28px;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                }
              }
              .flag{
                color: #FFFFFF;
                background-color: transparent;
              }
            }
          }
        }
      }
      .proposal-content{
        width: 100%;
        height: calc(100% - 25px);
        .proposal-content-main{
          width: 100%;
          height: 100%;
          :deep(.el-scrollbar__view){
            padding-top: 52px;
          }
          .list-item{
            width: 356px;
            height: 422px;
            border-radius: 24px;
            overflow: hidden;
            break-inside: avoid;
            margin-bottom: 30px;
            cursor: pointer;
            box-shadow: inset 0px 0px 8px 9px rgb(255, 255, 255, .15);
            background-color: rgb(255, 255, 255, .06);
            backdrop-filter: blur(9px);
            border: 1px solid rgb(255, 255, 255, .38);
            .list-item-main{
              width: 100%;
              height: 100%;
              .list-item-main-content{
                overflow: hidden;
                border-radius: 8px 8px 24px 24px;
                padding: 20px 20px 16px 20px;
                .item-content-info{
                  width: 100%;
                  height: auto;
                  .item-content-info-header{
                    width: 100%;
                    height: auto;
                    .item-user{
                      width: 100%;
                      display: flex;
                      .item-user-info{
                        flex: 1;
                        width: 0;
                        .item-user-info-main{
                          width: 100%;
                          height: auto;
                          display: flex;
                          .item-user-info-avatar{
                            width: 48px;
                            height: 48px;
                            flex-shrink: 0;
                            border-radius: 50%;
                            overflow: hidden;
                            margin-right: 8px;
                            img{
                              width: 100%;
                              height: 100%;
                              display: block;
                            }
                          }
                          .item-user-info-text{
                            flex: 1;
                            width: 0;
                            .item-user-info-taskName{
                              font-size: 16px;
                              color: #FFFFFF;
                              line-height: 1;
                              text-align: left;
                              font-style: normal;
                              text-transform: none;
                              margin-bottom: 10px;
                              overflow: hidden;
                              white-space: nowrap;
                              text-overflow: ellipsis;
                            }
                            .item-user-info-userName{
                              font-size: 14px;
                              color: #FFFFFF;
                              line-height: 1;
                              text-align: left;
                              font-style: normal;
                              text-transform: none;
                              overflow: hidden;
                              white-space: nowrap;
                              text-overflow: ellipsis;
                            }
                          }
                        }
                      }
                      .see-detail{
                        width: 32px;
                        height: 32px;
                        flex-shrink: 0;
                        cursor: pointer;
                        margin: 8px 0 8px 20px;
                        border-radius: 50%;
                        background-color: rgb(255, 255, 255, .16);
                        i{
                          font-size: 16px;
                          color: #FFFFFF;
                          display: block;
                          line-height: 32px;
                          text-align: center;
                        }
                      }
                    }
                  }
                  .item-content-title{
                    width: 100%;
                    font-size: 18px;
                    color: #FFFFFF;
                    line-height: 1;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    margin-top: 26px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .item-content-desc{
                    width: 100%;
                    height: 120px;
                    font-size: 14px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 24px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    margin-top: 19px;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                  }
                  .item-content-vote{
                    width: 100%;
                    height: auto;
                    margin-top: 22px;
                    .item-content-vote-main{
                      width: 100%;
                      height: auto;
                      display: flex;
                      .item-content-vote-info{
                        flex: 1;
                        width: 0;
                        .item-content-vote-info-main{
                          width: 100%;
                          height: auto;
                          display: flex;
                          .item-content-vote-info-icon{
                            width: 38px;
                            height: 38px;
                            flex-shrink: 0;
                            border-radius: 50%;
                            overflow: hidden;
                            margin-right: 8px;
                            background-color: rgb(255, 255, 255, .16);
                            .item-content-vote-info-icon-main{
                              width: 100%;
                              height: 100%;
                              i{
                                font-size: 24px;
                                color: #FFFFFF;
                                display: block;
                                line-height: 38px;
                                text-align: center;
                              };
                            }
                            
                          }
                          .item-content-vote-info-text{
                            flex: 1;
                            width: 0;
                            .item-content-vote-info-text-title{
                              width: 100%;
                              font-size: 14px;
                              color: rgb(255, 255, 255, .7);
                              line-height: 1;
                              text-align: justifyLeft;
                              font-style: normal;
                              text-transform: none;
                            }
                            .item-content-vote-info-text-desc{
                              width: 100%;
                              font-size: 14px;
                              color: #FFFFFF;
                              line-height: 1;
                              text-align: justifyLeft;
                              font-style: normal;
                              text-transform: none;
                              margin-top: 6px;
                            }
                          }
                        }
                      }
                      .item-content-vote-num{
                        width: 100px;
                        flex-shrink: 0;
                        font-size: 14px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 38px;
                        text-align: justifyLeft;
                        font-style: normal;
                        text-transform: none;
                        span{
                          color: #FFFFFF;
                        }
                      }
                    }
                  }
                  .item-content-result{
                    width: 100%;
                    height: 40px;
                    margin-top: 24px;
                    .item-content-result-main{
                      width: 100%;
                      height: auto;
                      .item-content-result-main-approveOf{
                        width: 50%;
                        height: 40px;
                        border-radius: 20px;
                        background-color: rgb(255, 255, 255, .16);
                        i{
                          font-size: 24px;
                          color: #FFFFFF;
                          display: block;
                          line-height: 40px;
                          text-align: left;
                        }
                      }
                      .item-content-result-main-against{
                        width: 50%;
                        height: 40px;
                        border-radius: 20px;
                        background-color: rgb(255, 255, 255, .16);
                        i{
                          font-size: 24px;
                          color: #FFFFFF;
                          display: block;
                          line-height: 40px;
                          text-align: right;
                        }
                      }
                    }
                  }
                  .item-content-tips{
                    width: 100%;
                    height: auto;
                    font-size: 16px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 24px;
                    text-align: center;
                    font-style: normal;
                    margin-top: 10px;
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
  :deep(.el-drawer){
    background: rgba(255, 255, 255, .16);
    backdrop-filter: blur(52px);
    .drawer-content{
      padding: 35px 50px;
      .drawer-content-main{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .drawer-content-main-header{
          width: 100%;
          flex: 0 0 auto;
          height: 220px;
          border-bottom: 1px solid rgba(255, 255, 255, .38);
          .drawer-content-main-header-main{
            width: 100%;
            height: 100%;
            .userAvatar{
              width: 89px;
              height: 89px;
              border-radius: 50%;
              overflow: hidden;
              margin: 0 auto;
              .el-image{
                width: 100%;
                height: 100%;
                img{
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .userPost{
              width: 100%;
              font-size: 16px;
              color: #FFFFFF;
              line-height: 1;
              text-align: center;
              font-style: normal;
              text-transform: none;
              margin-top: 20px;
            }
            .username{
              font-size: 14px;
              color: rgb(255, 255, 255, .7);
              line-height: 1;
              text-align: center;
              font-style: normal;
              text-transform: none;
              margin-top: 10px;
            }
          }
        }
        .drawer-content-main-content{
          flex: 1 1 auto;
          .drawer-content-main-content-main{
            width: 100%;
            padding: 30px 0 30px 0;
            .name{
              width: 100%;
              font-size: 18px;
              color: #FFFFFF;
              line-height: 1;
              text-align: left;
              font-style: normal;
              text-transform: none;
            }
            .content{
              width: 100%;
              height: 446px;
              margin-top: 21px;
              font-size: 14px;
              color: rgb(255, 255, 255, .7);
              line-height: 24px;
              text-align: left;
              font-style: normal;
              text-transform: none;
              overflow-y: auto;
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
            }
          }
        }
        .drawer-content-main-footer{
          width: 100%;
          flex: 0 0 auto;
          height: 160px;
          .drawer-content-main-footer-main{
            width: 100%;
            height: 100%;
            .drawer-content-main-footer-main-info{
              width: 100%;
              height: 38px;
              .drawer-content-main-footer-main-info-main{
                width: 100%;
                height: 100%;
                display: flex;
                .proposal-time{
                  flex: 1;
                  width: 0;
                  .proposal-time-main{
                    width: 100%;
                    display: flex;
                    .proposal-time-main-icon{
                      width: 38px;
                      height: 38px;
                      flex-shrink: 0;
                      margin-right: 10px;
                      border-radius: 50%;
                      background-color: rgb(255, 255, 255, .16);
                      i{
                        font-size: 24px;
                        color: #FFFFFF;
                        line-height: 38px;
                        text-align: center;
                        display: block;
                      }
                    }
                    .proposal-time-main-text{
                      flex: 1;
                      width: 0;
                      .proposal-time-main-title{
                        width: 100%;
                        display: block;
                        font-size: 14px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 1;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                      }
                      .proposal-time-main-desc{
                        width: 100%;
                        display: block;
                        font-size: 18px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        margin-top: 10px;
                      }
                    }
                  }
                }
                .proposal-num{
                  width: 150px;
                  flex-shrink: 0;
                  font-size: 14px;
                  color: rgb(255, 255, 255, .7);
                  line-height: 38px;
                  text-align: right;
                  font-style: normal;
                  text-transform: none;
                  span{
                    color: #FFFFFF;
                  }
                }
              }
            }
            .drawer-content-main-footer-main-evaluate{
              width: 100%;
              height: 40px;
              margin-top: 30px;
            }
            .drawer-content-main-footer-main-tips{
              width: 100%;
              height: auto;
              font-size: 12px;
              color: #FFFFFF;
              line-height: 0px;
              text-align: center;
              font-style: normal;
              text-transform: none;
              margin-top: 20px;
            }
          }
        }
      }
    }
  }
  .popupModal{
    width: calc(100% - 740px);
    height: calc(100% - 158px);
    position: fixed;
    top: 158px;
    left: 530px;
    right: 0;
    bottom: 0;
    z-index: 10;
    clip-path: inset(0 0 0 0); /* 限制蒙版显示范围 */
    .masking{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0);
    }
    .popupModal-center{
        width: 188px;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .popupModal-main{
            width: 188px;
            height: auto;
            position: relative;
            .popupModal-module{
              width: 100%;
              height: auto;
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              z-index: -1;
              border-radius: 34px;
              border: 1px solid rgb(255, 255, 255, .38);
              box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
              background: rgba(100, 99, 98, .16);
              backdrop-filter: blur(36px);
            }
            .popupModal-main-content{
              width: 100%;
              height: auto;
              display: inline-block;
              .popupModal-main-content-title{
                width: 100%;
                font-size: 18px;
                color: #FFFFFF;
                line-height: 68px;
                text-align: center;
                font-style: normal;
                text-transform: none;
              }
            }
        }
        .close{
            width: 34px;
            height: 34px;
            border-radius: 50%;
            margin: 20px auto 0 auto;
            i{
                font-size: 34px;
                color: #000000;
                display: block;
                cursor: pointer;
                line-height: 34px;
                text-align: center;
            }
        }
    }
  }
</style>
