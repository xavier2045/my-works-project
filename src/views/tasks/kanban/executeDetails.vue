<template>
  <div class="execute">
    <div class="execute-container">
      <div class="execute-header">
        <div class="execute-header-flex">
          <div class="execute-header-flex-l">
            <div class="execute-header-flex-l-main">
              <div class="execute-header-flex-l-main-previous">
                <div class="previous-icon" @click="goBack">
                  <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
                </div>
                <div class="previous-info">
                  <div class="previous-info-main">
                    <div class="previous-info-main-cover">
                      <img :src="details.taskAdminUserAvatar" alt="" />
                    </div>
                    <div class="previous-info-main-text">
                      <div class="previous-info-main-text-name">{{ details.taskName }}</div>
                      <div class="previous-info-main-text-admin">{{ details.taskAdminUsername }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="execute-header-flex-c">
            
          </div>
          <div class="execute-header-flex-r">
            <div class="execute-header-flex-r-main">
              <div class="head-body-flex">
                <template v-if="userInfo.id == details.taskAdminUserId">
                  <div class="body-flex-item" @click="handShowMsgModalFun" @click.stop>
                    <i class="icon font_family icon-xiaoxitongzhi24"><span></span></i>
                  </div>
                  <div class="body-flex-item" title="社区互动">
                    <i class="icon font_family icon-shequhudong34"></i>
                  </div>
                  <!-- <div class="body-flex-item" title= '退出任务' @click="exitTask">
                    <i class="icon font_family icon-shenqingtuichu34"></i>
                  </div> -->
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="execute-content">
        <div class="execute-content-main">
          <div class="execute-content-main-top">
            <template v-if="userInfo.id == details.taskAdminUserId">我的</template>
            <template v-else>他的</template>任务进度<span>{{ details.progress || 0 }}</span>%
          </div>
          <div class="execute-content-main-center">
            <div class="top-chart">
              <div class="chart-main-header">
                <div class="chart-main-header-content">
                  <div class="typeData">
                    <div class="typeData-main">
                      <div 
                        class="typeData-main-item" 
                        v-for="(item, index) in typeData" 
                        :key="index"
                      >
                        <i class="icon font_family" :class="item.icon"></i>
                        <span>{{ item.name }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="timeData">
                    <div class="timeData-main">
                      <div 
                        class="timeData-main-item" 
                        :class="isTime == item.id ? 'active' : ''"
                        v-for="(item, index) in timeData" 
                        @click="findTimeClick(item.id)"
                        :key="index"
                      >
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="chart-main-content">
                <ProjectTimeline v-if="details.dayProgresses.length" :progress="details.progress" :dayProgresses="progressData" />
              </div>
            </div>
            <div class="center-taskInfo">
              <div class="taskInfo-main">
                <div class="taskInfo-main-item">
                  <div class="item-title">
                    <template v-if="userInfo.id == details.taskAdminUserId">我的</template>
                    <template v-else>他的</template>任务报酬
                  </div>
                  <div class="item-content">
                    <div class="item-content-money">
                      <div class="money-main">
                        <div class="money-main-icon">￥</div>
                        <div class="money-main-num">
                          <Statistic :NumberData="Number(details.reward) || 0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom"></div>
                <div class="taskInfo-main-item">
                  <div class="item-title">
                    <template v-if="userInfo.id == details.taskAdminUserId">我的</template>
                    <template v-else>他的</template>任务周期
                  </div>
                  <div class="item-content">
                    <div class="item-content-time">
                      <div class="item-content-time-start time-style">
                        <div class="item-content-time-year">{{formatDates(details.startTime)}}年</div>
                        <div class="item-content-time-month">{{formatDate(details.startTime)}}</div>
                      </div>
                      <div class="item-content-time-icon">
                        <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
                      </div>
                      <div class="item-content-time-end">
                        <div class="item-content-time-year">{{formatDates(details.endTime)}}年</div>
                        <div class="item-content-time-month">{{formatDate(details.endTime)}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="taskInfo-main-item">
                  <div class="but-link" @click="openDetails">
                    <template v-if="userInfo.id == details.taskAdminUserId">我的</template>
                    <template v-else>他的</template>任务详情
                  </div>
                </div>
              </div>
            </div>
            <div class="center-bigTask" @click="skipRouteTask">
              <div class="center-bigTask-cover">
                <img :src="details.missionCover" alt="" />
              </div>
              <div class="center-bigTask-info">
                <div class="bigTask-text-info-main">
                  <div class="info-mian-avatar">
                    <img :src="details.missionAdminUserAvatar" alt="" />
                  </div>
                  <div class="info-mian-name">
                    {{ details.missionAdminUsername }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="execute-content-main-bot">
            <div class="main-bot-list">
              <div class="main-bot-list-item">
                <div class="masking"></div>
                <div class="content">
                  <div class="item-header">
                    <div class="header-main">
                      <div class="header-main-title">
                        <div class="title-main">
                          <div class="title-main-icon">
                            <i class="icon font_family icon-jiedian24_1"></i>
                          </div>
                          <div class="title-main-text">
                            <template v-if="userInfo.id == details.taskAdminUserId">我的</template>
                            <template v-else>他的</template>节点
                          </div>
                        </div>
                      </div>
                      <div class="header-main-option">
                        <div class="option-main">
                          <template v-if="userInfo.id == details.taskAdminUserId">
                            <template v-if="details.isTaskNodeAllUpload !== 1">
                              <div class="option-main-add" @click="uploadNode">
                                <span>上传节点</span>
                                <i class="icon font_family icon-jiahao24"></i>
                              </div>
                            </template>
                          </template>
                          <div class="option-main-more" @click="handleRouterNode">
                            <span>查看更多</span>
                            <i class="icon font_family icon-a-jiantouxiangyouyue20"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-content">
                    <template  v-if="details.taskNodes !== null">
                      <div class="node-list">
                        <div class="node-list-mian">
                          <div class="node-item" v-for="(item, index) in details.taskNodes" :key="index" @click="handleRouterNodeDetail(item)">
                            <div class="node-item-img">
                              <img :src="nodeItem" alt="" />
                            </div>
                            <div class="node-item-text">{{ item.name }}</div>
                            <div class="node-item-time">{{ item.createTime }}</div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="noPrompt">暂无节点</div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="main-bot-list-item">
                <div class="masking"></div>
                <div class="content">
                  <div class="item-header">
                    <div class="header-main">
                      <div class="header-main-title">
                        <div class="title-main">
                          <div class="title-main-icon">
                            <i class="icon font_family icon-tian24"></i>
                          </div>
                          <div class="title-main-text">
                            <template v-if="userInfo.id == details.taskAdminUserId">我的</template>
                            <template v-else>他的</template>提案
                          </div>
                        </div>
                      </div>
                      <div class="header-main-option">
                        <div class="option-main">
                          <template v-if="userInfo.id == details.taskAdminUserId">
                              <div class="option-main-add" @click="openEditor">
                                <span>发起提案</span>
                                <i class="icon font_family icon-jiahao24"></i>
                              </div>
                          </template>
                          <div class="option-main-more" @click="handleRouterProposal">
                            <span>查看更多</span>
                            <i class="icon font_family icon-a-jiantouxiangyouyue20"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-content">
                    <div class="proposal">
                      <div class="proposal-content">
                        <template  v-if="details.proposal !== null">
                          <div class="proposal-content-title">{{details.proposal.name}}</div>
                          <div class="proposal-content-text" v-html="details.proposal.content"></div>
                          <div class="proposal-content-tips">
                            <div class="proposal-content-tips-main">
                              <div class="proposal-content-tips-main-time">
                                <div class="time-main">
                                  <div class="time-main-icon">
                                    <i class="icon font_family icon-shaloushijian20"></i>
                                  </div>
                                  <div class="time-main-text">
                                    <div class="time-main-tips">距离投票结束</div>
                                    <div class="time-main-countdown">
                                      <template v-if="details.isDaoMember == 0">
                                        <template v-if="!hiddenTime">
                                            <CountdownComponent
                                              :type="2"
                                              v-if="details.proposal.startTime !== ''"
                                              :orderTime="details.proposal.startTime"
                                              :endTime="details.proposal.endTime"
                                              @countdownFinished="handleCountdownFinished"
                                            />
                                        </template>
                                        <template v-else>
                                          投票已结束
                                        </template>
                                      </template>
                                      <template v-else>
                                        <template v-if="!hiddenTime">
                                          <template v-if="details.proposal.isAgree == null">
                                            <CountdownComponent
                                              :type="2"
                                              v-if="details.proposal.startTime !== ''"
                                              :orderTime="details.proposal.startTime"
                                              :endTime="details.proposal.endTime"
                                              @countdownFinished="handleCountdownFinished"
                                            />
                                          </template>
                                          <template v-else>
                                            您已投票
                                            <span class="color-main">{{details.proposal.isAgree == 1 ? '赞成' : '反对'}}</span>
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
                              <div class="proposal-content-tips-main-statistics">
                                <div class="statistics-participant"><span>{{ details.proposal.total }}</span>人已参与投票</div>
                              </div>
                            </div>
                          </div>
                          <div class="proposal-content-evaluate">
                            <Evaluate
                              :id="details.proposal.id"
                              :initialLikes="Number(details.proposal.agreeNum)"
                              :initialDislikes="Number(details.proposal.disAgreeNum)"
                              :voted="isAgrees"
                              @vote="handleVote"
                            />
                          </div>
                        </template>
                        <template v-else>
                          <div class="noPrompt">暂无提案</div>
                        </template>
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
    <!-- 上传节点 -->
    <NodeModal
      v-if="isNodeModalVisible"
      :type="2"
      :isVisible="isNodeModalVisible"
      :initialContent="nodeContent"
      :daoId="daoId"
      :missionId="missionId"
      :maxLength="200"
      @update:content="updateNodeContent"
      @close="closeNodeBase"
    />
    <!-- 提案 弹窗 -->
    <Proposal
      v-if="isEditorVisible" 
      :isVisible="isEditorVisible"
      :initialContent="content"
      :maxLength="200"
      :daoId="daoId"
      :missionId="missionId"
      type="2"
      @update:content="updateContent"
      @close="closeEditor"
    />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { extractIdFromUrl, getItem, setItem } from '@/utils/index';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  import { proposalsSave, daosTasksGetDetail, proposaproposalsVotelsSave, nodeDataAdd } from '@/api/dao';
  import Statistic from '@/components/statisticModule/statistic.vue';
  import Evaluate from '@/components/evaluate/index.vue';
  import NodeModal from '@/components/popUp/node/index.vue';
  import Proposal from '@/components/popUp/proposal/index.vue';
  import CountdownComponent from '@/components/CountdownComponent/index.vue';
  import ProjectTimeline from '@/components/ProjectTimeline/index.vue';
  import nodeItem from '@/assets/images/dao/node_item.png';

  const router = useRouter();
  const missionId = ref('');
  const daoId = ref('');
  const nodeId = ref(''); // 未提交的节点id
  const progressData = ref([]);

  const details = ref({
    taskId: '',
    taskName: '',
    taskAdminUserId: '',
    taskAdminUsername: '',
    taskAdminUserAvatar: '',
    progress: '',
    isDaoMember: null as number | null,
    reward: '',
    startTime: '',
    endTime: '',
    missionId: '',
    missionCover: '',
    missionAdminUserId: '',
    missionAdminUsername: '',
    missionAdminUserAvatar: '',
    hasApply: '', // 1 已申请，2 没申请
    missionCreateUserId: '',
    isTaskNodeAllUpload: null as number | null, //  是否已经上传所有子任务节点： 0否 1是
    missionMode: '',
    proposal: {
      id: '',
      name: '',
      content: '',
      startTime: '',
      endTime: '',
      total: '',
      agreeNum: '',
      disAgreeNum: '',
      isPass: '',
      isAgree: '',
    },
    taskNodes: [],
    dayProgresses: [],
    weekProgresses: [],
    monthProgresses: []
  });
  console.log('details', details);

  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  console.log('userInfo', userInfo);

  const typeData = ref([
    { name: '知识库', icon: 'icon-suipian24' },
    { name: '提案', icon: 'icon-tian24' },
    { name: '节点', icon: 'icon-jiedian24_1' },
  ]);

  const isTime = ref(1);
  const timeData = ref([
    { name: '日', id: 1 },
    { name: '周', id: 2 },
    { name: '月', id: 3 },
  ]);
  const findTimeClick = (id: number) => {
    isTime.value = id;
    if(id === 1) {
      progressData.value =  details.value.dayProgresses;
    } else if(id === 2) {
      progressData.value =  details.value.weekProgresses;
    } else if(id === 3) {
      progressData.value =  details.value.monthProgresses;
    }
  };


  // 格式化数字
  const formatValue = (value: number) => {
      return Number(value).toFixed(3);
  }

  // 返回上一页
  const goBack = () => {
    router.go(-1);
  };

  const formatDate = (time: string) => {
    const date = new Date(time);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };
  const formatDates = (time: string) => {
    const date = new Date(time);
    return `${date.getFullYear()}`;
  };

  // 获取详情数据
  const getSubTaskDetails = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    console.log('details.value1', details.value);
    let missId = '';
    if(getItem('teamDetails') !== null || getItem('teamDetails') !== undefined || getItem('teamDetails') !== '') {
      missId = getItem('missionId');
    } else {
      missId = userInfo.missionId;
    }

  let reqData = {
    id: id,
    missionId: missId
  }
  return new Promise<void>((resolve, reject) => {
    daosTasksGetDetail(reqData).then((response: any) => {
      const { code, message } = response;
      if (code !== 200) {
        showPopup(message, 'error', 3000);
        return;
      }
      details.value = response.data;
      userInfo.isDaoMember = details.value.isDaoMember;
      missionId.value = details.value.missionId;
      daoId.value = details.value.daoId;
      if(details.value.proposal !== null) {
        details.value.proposal.id = details.value.proposal.id+'';
      }
      
      if(details.value.proposal !== null) {
        if(details.value.isDaoMember == 0){
          isAgrees.value = true
        } else {
          if(details.value.proposal.isAgree == null) {
            isAgrees.value = false
          } else {
            isAgrees.value = true
          }
        }
      }
      
      progressData.value =  details.value.dayProgresses;
      nodeId.value = '';
      if (details.value.dayProgresses.length > 0) {
        details.value.dayProgresses.some((item: any) => {
          if (item.lineDatas !== null) {
            if (item.lineDatas.length > 0) {
              return item.lineDatas.some((items: any) => {
                if (nodeId.value === '') {
                  if (items.businessType == 3) {
                    if (items.uploadStatus !== 1) {
                      userInfo.nodeId = items.businessId;
                      nodeId.value = items.businessId;
                      console.log('nodeId.value', nodeId.value);
                      return true; // 跳出内层循环
                    }
                  }
                }
              });
            }
          }
          return false; // 继续外层循环
        });
      }
      
      resolve()
    }).catch((error: any) => {
        reject(error)
    })
  })
    console.log('details.value2', details.value);
  }



   // 打开子任务详情
  const openDetails = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    userInfo.subTaskType = 1;
    setItem('subTaskType', 1);
    router.push({ name: 'subTaskDetails', params: { id: id} })
  };

  // 打开大任务详情
  const skipRouteTask = () => {
    let id = details.value.missionId;
    router.push({ name: 'TataskDetails', params: { id } });
  };

  // 打开消息通知弹框
  const handShowMsgModalFun = () => {
    userInfo.isMsgShow = !userInfo.isMsgShow;
  };


  // 节点操作模块
  const isNodeModalVisible = ref(false); // 是否显示节点操作弹窗
  const uploadNode = () => {
    isNodeModalVisible.value = true;
  };

  // 节点
  
  const nodeContent = ref<string>('');
  // 提交节点
  const updateNodeContent = (newContent: any) => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    console.log('newContent', newContent);
    newContent.businessId = id;
    newContent.nodePeriodId = nodeId.value;
  return new Promise<void>((resolve, reject) => {
    nodeDataAdd(newContent).then((response: any) => {
      const { code, message } = response;
      if (code !== 200) {
        showPopup(message, 'error', 3000);
        return;
      }
      nodeId.value = '';
      getSubTaskDetails();
      isNodeModalVisible.value = false;
      resolve()
    }).catch((error: any) => {
        reject(error)
    })
  })
  }
  // 关闭节点
  const closeNodeBase = () => {
    isNodeModalVisible.value = false;
  };

  // 节点查看更多
  const handleRouterNode = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    // 管理员进入传daoid，子任务进去传子任务id
    let id = '';
    if(userInfo.id == details.value.missionAdminUserId) {
      id = daoId.value;
      userInfo.nodeType = 3;
    } else {
      id = extractIdFromUrl(currentUrl)+'';
      userInfo.nodeType = 2;
    }
    
    router.push({ name: 'NodeList', params: { id: id} })
  };

  // 点击列表查看详情
  const handleRouterNodeDetail = (item: any) => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    let nodeId = item.id;
    userInfo.businessId = id;
    setItem('businessId', id);
    userInfo.nodeType = 2;
    setItem('nodeType', 2);
    router.push({ name: 'NodeDetails', params: { id: nodeId} })
  }

// 提案
/**  倒计时结束回调 **/
const hiddenTime = ref(false);
const handleCountdownFinished = () => {
  console.log('倒计时结束');
  hiddenTime.value = true;
  isAgrees.value = true;
};

// 处理投票的回调
const votedResult = ref(0);  // 选择的结果
const isAgrees = ref(true);  // 已经选择过禁止选择
const handleVote = (result: string, id: any) => {
  
  ;
  votedResult.value = result === 'like' ? 1 : 0;
  console.log('proposalId.value', id);
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
      
      isAgrees.value = true;
      showPopup('投票成功', 'success', 3000);
      getSubTaskDetails();
      resolve()
    }).catch((error: any) => {
        reject(error)
    })
  })
  
};
  
// 发起提案
const isEditorVisible = ref(false);
const content = ref<string>('');
// 打开编辑器
const openEditor = () => {
  isEditorVisible.value = true;
};

// 关闭编辑器
const closeEditor = () => {
  isEditorVisible.value = false;
};

// 发起提案
const updateContent = (newContent: any) => {
  // content.value = newContent.content;
  console.log('content.value', newContent.value);
  newContent.missionId = missionId.value;
  // delete newContent.daoId;
  return new Promise<void>((resolve, reject) => {
    proposalsSave(newContent).then((response: any) => {
      const { code, message } = response;
      if (code !== 200) {
        showPopup(message, 'error', 3000);
        return;
      }

      getSubTaskDetails();
      isAgrees.value = false;
      isEditorVisible.value = false;
      resolve()
    }).catch((error: any) => {
        reject(error)
    })
  })
};

// 跳转到提案列表
const handleRouterProposal = () => {
  console.log('daoId.value',daoId.value);
  userInfo.proposalType = 1;
  userInfo.missionMode = details.value.missionMode;
  userInfo.missionCreateUserId = details.value.missionCreateUserId;
  setItem('missionMode', details.value.missionMode);
  setItem('missionCreateUserId', details.value.missionCreateUserId);
  router.push({ name: 'Proposal', params: { id: daoId.value} })
};

  // 退出任务
  const isexitTask = ref(true);
  const auditRemark = ref('');
  const exitTask = () => {
    isexitTask.value = true;
  }
  const handSubmitExitTask = () => {
    let getData = {
      missionId: missionId.value,
      isExit: 1
    }
    return new Promise<void>((resolve, reject) => {
      proposalsSave(getData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }

        getSubTaskDetails();
        isEditorVisible.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };


  onMounted(() => {
    getSubTaskDetails();
  });
</script>

<style lang='scss' scoped>
  .execute{
    width: 100%;
    height: calc(100% - 30px);
    .execute-container{
      width: 100%;
      height: 100%;
      .execute-header{
        width: calc(100% - 30px);
        height: auto;
        margin: 30px 0 0 30px;
        padding-bottom: 25px;
        border-bottom: 1px solid rgb(255, 255, 255, .38);
        .execute-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .execute-header-flex-l{
            height: auto;
            flex-shrink: 0;
            .execute-header-flex-l-main{
              width: 100%;
              height: auto;
              
              .execute-header-flex-l-main-previous{
                width: auto;
                height: auto;
                display: flex;
                justify-content: space-between;
                .previous-icon{
                  width: 24px;
                  height: auto;
                  flex-shrink: 0;
                  margin-right: 37px;
                  cursor: pointer;
                  i{
                    font-size: 24px;
                    color: #FFFFFF;
                    display: block;
                    line-height: 52px;
                    text-align: center;
                  }
                }
                .previous-info{
                  flex: 1;
                  .previous-info-main{
                    width: 100%;
                    height: auto;
                    display: flex;
                    .previous-info-main-cover{
                      width: 52px;
                      height: 52px;
                      flex-shrink: 0;
                      border-radius: 50%;
                      margin-right: 14px;
                      overflow: hidden;
                      img{
                        width: 100%;
                        height: 100%;
                        display: block;
                      }
                    }
                    .previous-info-main-text{
                      flex: 1;
                      .previous-info-main-text-name{
                        font-size: 20px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: left;
                        margin-bottom: 11px;
                      }
                      .previous-info-main-text-admin{
                        font-size: 14px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: left;
                      }
                    }
                  }
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
          .execute-header-flex-c{
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
          }
          .execute-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .execute-header-flex-r-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .head-body-flex{
                width: 144px;
                flex-shrink: 0;
                display: flex;
                justify-content: space-between;
                .body-flex-item{
                  width: 32px;
                  margin-left: 16px;
                  cursor: pointer;
                  &:hover{
                    i{
                      color: rgba(255, 255, 255, 1);
                    }
                  }
                  i{
                    font-size: 32px;
                    color: rgba(255, 255, 255, .6);
                    display: block;
                    position: relative;
                    line-height: 46px;
                    span{
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      display: inline-block;
                      background-color: #f00;
                      position: absolute;
                      top: 15px;
                      right: 5px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .execute-content{
        width: 100%;
        height: calc(100% - 78px);
        overflow-y: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
        .execute-content-main{
          height: auto;
          padding: 0 32px;
          .execute-content-main-top{
            width: 100%;
            height: auto;
            font-size: 18px;
            color: rgb(255, 255, 255, .7);
            line-height: 20px;
            text-align: left;
            margin: 40px 0 13px 0;
            display: flex;
            span{
              font-size: 26px;
              color: #FFFFFF;
              line-height: 20px;
              text-align: left;
              padding: 0 3px 0 10px;
              display: inline-block;
            }
          }
          .execute-content-main-center{
            width: 100%;
            height: auto;
            display: flex;
            .top-chart{
              flex: 1;
              width: 0;
              .chart-main-header{
                width: 100%;
                height: 38px;
                .chart-main-header-content{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: space-between;
                  .typeData{
                    display: inline-block;
                    .typeData-main{
                      width: auto;
                      display: flex;
                      justify-content: flex-start;
                      .typeData-main-item{
                        margin-right: 21px;
                        display:inline-block;
                        display: flex;
                        i{
                          font-size: 24px;
                          color: rgb(255, 255, 255, .7);
                          display: inline-block;
                          margin-right: 10px;
                          line-height: 38px;
                        }
                        span{
                          font-weight: 400;
                          font-size: 14px;
                          color: rgb(255, 255, 255, .7);
                          line-height: 38px;
                          text-align: left;
                        }
                      }
                    }
                  }
                  .timeData{
                    width: 158px;
                    height: 36px;
                    overflow: hidden;
                    border-radius: 19px;
                    border: 1px solid rgb(255, 255, 255, .38);
                    .timeData-main{
                      width: 100%;
                      display: flex;
                      justify-content: space-between;
                      .timeData-main-item{
                        width: 33.333%;
                        height: 38px;
                        font-weight: 400;
                        font-size: 16px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 38px;
                        text-align: center;
                        cursor: pointer;
                        background-color: rgb(255, 255, 255, .1);
                        border-right: 1px solid rgba(255, 255, 255, 0.38);
                        &:hover{
                          background-color: rgb(255, 255, 255, .38);
                        }
                        &:last-child{
                          border-right: none;
                        }
                      }
                      .active{
                        color: #FFFFFF;
                        background-color: rgb(255, 255, 255, .38);
                      }
                    }
                  }
                }
              }
              .chart-main-content{
                width: 100%;
                height: calc(100% - 38px);
              }
            }
            .center-taskInfo{
              width: 156px;
              height: 254px;
              flex-shrink: 0;
              margin: 0 20px 0 30px;
              border-radius: 24px;
              padding: 30px 20px;
              border: 1px solid rgba(255, 255, 255, .38);
              .taskInfo-main{
                width: 100%;
                height: 100%;
                .border-bottom{
                  width: 100%;
                  height: 1px;
                  margin: 23px 0;
                  background-color: rgba(255, 255, 255, .38);
                }
                .taskInfo-main-item{
                  width: 100%;
                  height: auto;
                  .item-title{
                    width: 100%;
                    font-size: 16px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 28px;
                    text-align: left;
                    margin-bottom: 10px;
                  }
                  .item-content{
                    width: 100%;
                    height: auto;
                    .item-content-money{
                      width: 100%;
                      color: #FFFFFF;
                      line-height: 1;
                      text-align: left;
                      .money-main{
                        width: 100%;
                        height: auto;
                        display: flex;
                        justify-content: flex-start;
                        .money-main-icon{
                          font-size: 24px;
                          color: #FFFFFF;
                          line-height: 1;
                        }
                        .money-main-num{
                          :deep(.el-statistic){
                            font-size: 52px;
                            .el-statistic__content{
                              .el-statistic__number{
                                font-size: 24px;
                                color: #FFFFFF;
                                line-height: 1;
                                text-align: center;
                                font-style: normal;
                                text-transform: none;
                              }
                              .el-statistic__suffix{
                                color: rgba(255, 255, 255, 0.8);
                                span{
                                  font-size: 24px;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    .item-content-time{
                      width: 100%;
                      height: auto;
                      display: flex;
                      justify-content: space-between;
                      .item-content-time-start{
                        flex: 1;
                        width: 0;
                        .item-content-time-year{
                          font-size: 14px;
                          color: rgb(255, 255, 255, .7);
                          line-height: 1;
                          text-align: left;
                          margin-bottom: 5px;
                        }
                        .item-content-time-month{
                          font-size: 24px;
                          color: #FFFFFF;
                          line-height: 1;
                          text-align: left;
                        }
                      }
                      .item-content-time-icon{
                        width: 24px;
                        height: auto;
                        flex-shrink: 0;
                        padding-top: 19px;
                        i{
                          font-size: 24px;
                          color: #FFFFFF;
                          display: block;
                          line-height: 1;
                          text-align: center;
                        }
                      }
                      .item-content-time-end{
                        flex: 1;
                        width: 0;
                        .item-content-time-year{
                          font-size: 14px;
                          color: rgb(255, 255, 255, .7);
                          line-height: 1;
                          text-align: right;
                          margin-bottom: 5px;
                        }
                        .item-content-time-month{
                          font-size: 24px;
                          color: #FFFFFF;
                          line-height: 1;
                          text-align: right;
                        }
                      }
                    }
                  }
                  .but-link{
                    width: 138px;
                    height: 36px;
                    margin: 38px auto 0 auto;
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 18px;
                    font-size: 14px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 36px;
                    text-align: center;
                    cursor: pointer;
                    &:hover{
                      background: rgba(255, 255, 255, 0.16);
                    }
                  }
                }
              }
            }
            .center-bigTask{
              width: 218px;
              height: 316px;
              border-radius: 24px;
              overflow: hidden;
              position: relative;
              cursor: pointer;
              .center-bigTask-cover{
                width: 100%;
                height: 100%;
                img{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
              .center-bigTask-info{
                width: calc(100% - 30px);
                height: 40px;
                padding: 9px 15px;
                border-radius: 12px 12px 24px 24px;
                background-color: rgb(0, 0, 0, .36);
                position: absolute;
                left: 0;
                bottom: 0;
                .bigTask-text-info-main{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: flex-start;
                  .info-mian-avatar{
                    width: 37px;
                    height: 37px;
                    flex-shrink: 0;
                    margin-right: 10px;
                    img{
                      width: 100%;
                      height: 100%;
                      display: block;
                      border-radius: 50%;
                    }
                  }
                  .info-mian-name{
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 40px;
                    text-align: left;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
              }
            }
          }
          .execute-content-main-bot{
            width: 100%;
            height: auto;
            margin-top: 67px;
            margin-bottom: 68px;
            .main-bot-list{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .main-bot-list-item{
                width: 481px;
                height: 325px;
                padding: 24px 33px 38px 33px;
                border-radius: 24px;
                position: relative;
                overflow: hidden;
                box-shadow: inset 0px 0px 28px 0px #FFFFFF;
                border: 1px solid rgb(255, 255, 255, .38);
                .masking{
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  z-index: 0;
                  background: rgba(255, 255, 255, .08);
                  backdrop-filter: blur(30px);
                }
                .content{
                  width: 100%;
                  height: 100%;
                  isolation: isolate;
                  .item-header{
                    width: 100%;
                    height: auto;
                    .header-main{
                      width: 100%;
                      height: auto;
                      display: flex;
                      justify-content: space-between;
                      .header-main-title{
                        display: inline-block;
                        .title-main{
                          width: 100%;
                          height: auto;
                          display: flex;
                          justify-content: flex-start;
                          .title-main-icon{
                            width: 24px;
                            height: auto;
                            flex-shrink: 0;
                            margin-right: 8px;
                            i{
                              font-size: 24px;
                              color: #FFFFFF;
                              line-height: 32px;
                              text-align: left;
                            }
                          }
                          .title-main-text{
                            font-size: 18px;
                            color: #FFFFFF;
                            line-height: 32px;
                            text-align: left;
                          }
                        }
                      }
                      .header-main-option{
                        display: inline-block;
                        .option-main{
                          width: 100%;
                          height: auto;
                          display: flex;
                          .option-main-add{
                            width: 105px;
                            height: 32px;
                            flex-shrink: 0;
                            margin-right: 8px;
                            border-radius: 16px;
                            display: inline-block;
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            background-color: rgba(255, 255, 255, 0.08);
                            &:hover{
                              background-color: rgba(255, 255, 255, 0.16);
                            }
                            span{
                              font-weight: 400;
                              font-size: 14px;
                              color: #FFFFFF;
                              line-height: 32px;
                              text-align: left;
                              display: inline-block;
                              margin-right: 8px;
                            }
                            i{
                              font-size: 16px;
                              color: #FFFFFF;
                              line-height: 32px;
                              text-align: center;
                              display: block;
                            }
                          }
                          .option-main-more{
                            width: 105px;
                            height: 32px;
                            flex-shrink: 0;
                            margin-right: 8px;
                            border-radius: 16px;
                            display: inline-block;
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            background-color: rgba(255, 255, 255, 0.08);
                            &:hover{
                              background-color: rgba(255, 255, 255, 0.16);
                            }
                            span{
                              font-weight: 400;
                              font-size: 14px;
                              color: #FFFFFF;
                              line-height: 32px;
                              text-align: left;
                              display: inline-block;
                              margin-right: 8px;
                            }
                            i{
                              font-size: 16px;
                              color: #FFFFFF;
                              line-height: 32px;
                              text-align: center;
                              display: block;
                            }
                          }
                        }
                      }
                    }
                  }
                  .item-content{
                    width: 100%;
                    height: auto;
                    margin-top: 22px;
                    border-top: 1px solid rgba(255, 255, 255, 0.38);
                    .noPrompt{
                      width: 100%;
                      height: auto;
                      font-size: 18px;
                      text-align: center;
                      margin-top: 100px;
                      color: rgb(255, 255, 255, .7);
                    }
                    .proposal{
                      width: 100%;
                      height: auto;
                      .proposal-content{
                        width: 100%;
                        height: auto;
                        .proposal-content-title{
                          width: 100%;
                          margin-top: 25px;
                          font-weight: 400;
                          font-size: 16px;
                          color: #FFFFFF;
                          line-height: 1;
                          text-align: left;
                        }
                        .proposal-content-text{
                          width: 100%;
                          height: 92px;
                          margin-top: 16px;
                          font-weight: 400;
                          font-size: 14px;
                          color: rgb(255, 255, 255, .7);
                          line-height: 24px;
                          text-align: left;
                          display: -webkit-box;
                          -webkit-line-clamp: 4;
                          line-clamp: 4;
                          -webkit-box-orient: vertical;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          .topic{
                            color: #f00;
                          }
                        }
                        .proposal-content-tips{
                          width: 100%;
                          height: auto;
                          margin-top: 27px;
                          .proposal-content-tips-main{
                            width: 100%;
                            height: auto;
                            display: flex;
                            justify-content: space-between;
                            .proposal-content-tips-main-time{
                              display: inline-block;
                              .time-main{
                                width: 100%;
                                height: auto;
                                display: flex;
                                justify-content: flex-start;
                                .time-main-icon{
                                  width: 38px;
                                  height: 38px;
                                  border-radius: 50%;
                                  margin-right: 8px;
                                  background-color: rgb(255, 255, 255, .16);
                                  i{
                                    font-size: 24px;
                                    color: rgb(255, 255, 255, .7);
                                    text-align: center;
                                    line-height: 38px;
                                    display: block;
                                  }
                                }
                                .time-main-text{
                                  display: inline-block;
                                  .time-main-tips{
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: rgba(255, 255, 255, .6);
                                    line-height: 1;
                                    text-align: left;
                                  }
                                  .time-main-countdown{
                                    font-weight: 400;
                                    font-size: 18px;
                                    color: #FFFFFF;
                                    line-height: 1;
                                    text-align: left;
                                    margin-top: 7px;
                                  }
                                }
                              }
                            }
                            .proposal-content-tips-main-statistics{
                              display: inline-block;
                              .statistics-participant{
                                display: inline-block;
                                font-weight: 400;
                                font-size: 14px;
                                color: rgb(255, 255, 255, .7);
                                line-height: 38px;
                                text-align: left;
                                span{
                                  color: #FFFFFF;
                                  margin-right: 3px;
                                  display: inline-block;
                                }
                              }
                            }
                          }
                        }
                        .proposal-content-evaluate{
                          width: 100%;
                          height: auto;
                          margin-top: 22px;
                        }
                      }
                    }
                    .node-list{
                      width: 100%;
                      height: auto;
                      .node-list-mian{
                        width: 100%;
                        height: 250px;
                        .node-item{
                          width: 100%;
                          height: auto;
                          display: flex;
                          cursor: pointer;
                          .node-item-img{
                            width: 32px;
                            height: 48px;
                            flex-shrink: 0;
                            img{
                              width: 16px;
                              height: 16px;
                              display: inline-block;
                              margin: 16px 16px 16px 0;
                            }
                          }
                          .node-item-text{
                            width: 0;
                            flex-grow: 1;
                            font-weight: 400;
                            font-size: 16px;
                            color: #FFFFFF;
                            line-height: 48px;
                            text-align: left;
                            display: -webkit-box;
                            -webkit-line-clamp: 1;
                            line-clamp: 1;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          }
                          .node-item-time{
                            width: 110px;
                            flex-shrink: 0;
                            font-weight: 400;
                            font-size: 16px;
                            color: #FFFFFF;
                            line-height: 48px;
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
          width: 302px;
          height: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          .popupModal-main{
              width: 302px;
              height: auto;
              padding-bottom: 41px;
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
                border-radius: 24px;
                border: 1px solid rgb(255, 255, 255, .38);
                box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
                background: rgba(100, 99, 98, .16);
                backdrop-filter: blur(36px);
              }
              .popupModal-main-content{
                width: 100%;
                height: auto;
                display: inline-block;
                .popupModal-main-icon{
                    width: 53px;
                    margin: 57px auto 0 auto;
                    i{
                        font-size: 53px;
                        color: #FFFFFF;
                        display: block;
                    }
                }
                .popupModal-main-title{
                    width: 205px;
                    font-size: 18px;
                    color: #FFFFFF;
                    line-height: 1.5;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                    margin: 31px auto 0 auto;
                }
                .popupModal-main-tips{
                    width: 235px;
                    font-size: 14px;
                    color: rgb(255, 255, 255, .7);;
                    line-height: 28px;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                    margin: 10px auto 0 auto;
                }
                .popupModal-main-amount{
                  font-size: 38px;
                  color: #FFFFFF;
                  line-height: 24px;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                  margin-top: 17px;
                }
                .popupModal-main-textarea{
                  padding: 30px;
                  textarea{
                    width: calc(100% - 60px);
                    height: 200px;
                    background: transparent;
                    font-weight: 400;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 1.6;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    border: none;
                    resize: none;
                    letter-spacing: 1px;
                    padding: 30px 28px;
                    border-radius: 12px;
                    background-color: rgb(255, 255, 255, .08);
                    &::placeholder {
                      color: rgb(255, 255, 255, 0.68);
                      font-size: 16px;
                    }
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
                  :deep(.el-textarea){
                    width: 100%;
                    height: 200px;
                    textarea{
                      width: 100%;
                      height: 200px;
                      background: transparent;
                      font-weight: 400;
                      font-size: 16px;
                      color: #FFFFFF;
                      line-height: 1.6;
                      text-align: left;
                      font-style: normal;
                      text-transform: none;
                      border: none;
                      resize: none;
                      letter-spacing: 1px;
                      padding: 30px 28px;
                      border-radius: 12px;
                      background-color: rgb(255, 255, 255, .08);
                      &::placeholder {
                        color: rgb(255, 255, 255, 0.68);
                        font-size: 16px;
                      }
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
                .popupModal-main-but{
                    height: 38px;
                    padding: 0 20px;
                    border-radius: 19px;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 38px;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                    margin: 33px auto 0 auto;
                    cursor: pointer;
                    display: table;
                    background-color: rgba(255, 255, 255, 0.16);
                    backdrop-filter: blur(20px);
                }
                .popupModal-main-selectBut{
                    height: auto;
                    display: flex;
                    padding: 0 36px;
                    margin-top: 31px;
                    justify-content: space-between;
                    .popupModal-main-selectBut-item{
                        width: 110px;
                        height: 38px;
                        border-radius: 19px;
                        background-color: rgb(90, 87, 84, 1);
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 38px;
                        text-align: center;
                        font-style: normal;
                        text-transform: none;
                        cursor: pointer;
                    }
                }
                .popupModal-main-but-group{
                  width: 100%;
                  height: auto;
                  display: flex;
                  margin-top: 20px;
                  justify-content: center;
                  .popupModal-main-but{
                    height: 38px;
                    padding: 0 37px;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 38px;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                    cursor: pointer;
                    margin: 0;
                    &:first-child{
                      margin-right: 10px;
                    }
                  }
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
      .rejectW{
        width: 500px !important;
      }
    }
  }
  .rejectW{
    width: 500px !important;
  }
</style>
