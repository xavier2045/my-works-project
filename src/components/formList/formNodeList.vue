<template>
    <div class="node">
      <div class="node-container">
        <div class="node-header">
          <div class="node-header-flex">
            <template v-if="ismoduleType === 1">
              <template v-if="proType !== 1">
                <div class="dow-select">
                    <TimeSelect
                        :options="selectList"
                        v-model="selectedValue"
                        placeholder="全部任务"
                        @open="handleOpen" 
                        @close="handleClose"
                        @update:modelValue="updateModelValue"
                    />
                </div>
              </template>
              <div class="dow-select">
                  <TimeSelect
                      :options="nodeList"
                      v-model="nodeValue"
                      placeholder="全部节点"
                      @open="handleOpen" 
                      @close="handleClose"
                      @update:modelValue="updateNodeValue"
                  />
              </div>
            </template>
            <div class="dow-select">
                <TimeSelect
                    :options="typeList"
                    v-model="typeValue"
                    placeholder="全部状态"
                    @open="handleOpen" 
                    @close="handleClose"
                    @update:modelValue="updateTypeValue"
                />
            </div>
          </div>
        </div>
        <div class="node-content">
          <div class="node-content-main">
            <div class="node-content-main-bg">
                <div class="table-header">
                    <ul>
                        <li>任务者</li>
                        <li>任务</li>
                        <li>时间</li>
                        <li>节点</li>
                        <li>状态</li>
                    </ul>
                </div>
                <div class="table-content">
                    <infinite-scroll-list
                        :fetchFunction="fetchNews"
                        :key="refreshKey" 
                        :hasMore="hasMore"
                        :filterCriteria="currentFilterCriteria"
                    >
                        <template #item="{ items }">
                          <div v-if="items.length === 0" class="list-item-tips">暂无数据</div>
                            <div 
                            v-for="item in items" 
                            :key="item.missionId" 
                            class="list-item"
                            @click="findRouterNodeDetailsFun(item)"
                            >
                            <div class="list-item-main">
                                <div class="list-item-main-content">
                                  <div class="cell column1">
                                      <div class="cell-main">
                                      <div class="cell-main-img">
                                        <el-image
                                          :src="item.userAvatar"
                                          fit="cover"
                                        >
                                          <template #error>
                                            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                          </template>
                                        </el-image>
                                      </div>
                                      <div class="cell-main-info">
                                          <div class="cell-main-title">{{ item.username }}</div>
                                          <div class="cell-main-desc">账号ID：{{ item.userUuid }}</div>
                                      </div>
                                      </div>
                                  </div>
                                  <div class="cell column2">
                                      <div class="cell-main">
                                      <div class="cell-main-name">{{ item.jobName }}</div>
                                      </div>
                                  </div>
                                  <div class="cell column3">
                                      <div class="cell-main">
                                      <div class="cell-main-date">{{ item.uploadTime }}</div>
                                      </div>
                                  </div>
                                  <div class="cell column4">
                                      <div class="cell-main">
                                        <div class="cell-main-but">
                                          <div class="but-sort">{{ item.sort }}</div>
                                          <div class="but-name">节点{{ item.nodePeriodSort }}</div>
                                        </div>
                                      </div>
                                  </div>
                                  <div class="cell column5">
                                      <div class="cell-main">
                                        <div class="cell-main-status">
                                          <template v-if="item.auditStatus === 2">
                                            <i class="icon font_family icon-kongxinyuanquan20 type-color1"></i>
                                          </template>
                                          <template v-else-if="item.auditStatus === 3">
                                            <i class="icon font_family icon-shenhebutongguo20 type-color3"></i>
                                          </template>
                                          <template v-else-if="item.auditStatus === 1">
                                            <!-- <i class="icon font_family icon-daishenhebiankuang24"></i> -->
                                            <p>待审核</p>
                                          </template>
                                        </div>
                                      </div>
                                  </div>
                                </div>
                                
                            </div>
                            </div>
                        </template>
                    </infinite-scroll-list>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang='ts' setup>
    import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { nodeDataList, tasksListNodeData, nodeDataListCalendar } from '@/api/dao';
    import { missionsDaosTasksDrop, missionsNodePeriodDrop } from '@/api/kanban';
    import { extractIdFromUrl, setItem } from '@/utils/index';
    import MonthSwitcher from '@/components/MonthSwitcher/index.vue';
    import TimeSelect from '@/components/TreeSelect/timeSelect.vue';
    import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
    import { aeUseStore } from '@/stores/user';
    import { showPopup } from '@/utils/usePopup';
    

    const props = defineProps({
      refresh: {
        type: Boolean,
        required: true
      },
      type: {
        type: Number,
        required: true
      }
    });

    const emit = defineEmits<{
      (e: 'update:content', id: string): void;
    }>();

    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
  
    const router = useRouter();
    const businessId = ref('');
    const isType = ref(0);
    const proType = ref(0);
    const refreshKey = ref(0);
    const ismoduleType = ref(0); // 1是dao 2是个人
    const findTypeFun = async (item: any) => {
      isType.value = item.value;
      const result = await fetchNews(1);
      
    };
  
    const taskData = ref({
      taskStatus: 0,
      screenData: '',
      concern: 0,
      ongoing: 0,
      completed: 0,
    });
    const currentDate = ref(''); // Format: 'YYYY-MM'
    const events = ref([]);
    const typeValue = ref<number | string>('');

    // 节点状态 1待审核 2审核通过 3审核不通过
    const typeList = ref([
      { label: '全部', value: '' },
      { label: '待审核', value: 1 },
      { label: '通过', value: 2 },
      { label: '不通过', value: 3 },
    ]);
  
    // 筛选子任务
    const isSort = ref(false);
    const selectList = ref([]);
    const selectedValue = ref<number | string>('');
    // 列表下拉子任务数据
    const findTasksListNodeDataFun = () => {
      let reqData = {
        businessId: userInfo.missionId,
        businessType: 5
      }
      return new Promise<void>((resolve, reject) => {
        missionsDaosTasksDrop(reqData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              resultData.map((item: any) => {
                item.value = item.jobId
                item.label = item.jobName
              })

              // resultData.unshift({
              //   value: '',
              //   label: '全部',
              //   type: 2
              // })
              selectList.value = resultData;
              
              resolve()
          }).catch((error: any  ) => {
              reject(error)
          })
      })
    }

    // 节点周期下拉列表
    const nodeList = ref([]);
    const nodeValue = ref<number | string>('');
    const findMissionsNodePeriodDropFun = (id: string, type: number) => {
      let types = '';
      if(type == 1) {
        types = '1';
      } else if(type == 3) {
        types = '2';
      } else {
        types = type;
      }
      let reqData = {
        id: id,
        businessType: types
      }

      return new Promise<void>((resolve, reject) => {
        missionsNodePeriodDrop(reqData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              resultData.map((item: any) => {
                  item.value = item.nodePeriodId
                  item.label = item.num
              })
              nodeList.value = resultData;
              
              resolve()
          }).catch((error: any  ) => {
              reject(error)
          })
      })
    }
  
    // 筛选列表
    const updateModelValue = (val: string) => {
      let types = 0;
      let type = 0;
      let id = 0;
      //下拉type: 1.大任务 2.DAO 3.子任务
      //续转：1 大任务 2子任务 3dao下所有子任务
      businessId.value = val;
      selectList.value.forEach((item: any) => {
        if(item.value == val) {
          types = item.type;
        }
      });
      if(types == 1) {
        type = 1;
        id = userInfo.missionId;
      } else if(types == 2) {
        type = 3;
        id = userInfo.daoId;
      } else if(types == 3) {
        type = 2;
        id = val;
      }
      currentFilterCriteria.value.businessId = id+'';
      currentFilterCriteria.value.businessType = type+'';
      if(types !== 2) {
        findMissionsNodePeriodDropFun(val, type);
      } else {
        nodeList.value = [];
      }
    };
    const updateNodeValue = (val: string) => {
      nodeValue.value = val;
      currentFilterCriteria.value.nodePeriodId = val;
    };
    const updateTypeValue = (val: string) => {
      currentFilterCriteria.value.auditStatus = val;
    };
  
  
    // 展开时添加背景色
    const handleOpen = () => {
      isSort.value = true;
    };
    // 展开时移除背景色
    const handleClose = () => {
      isSort.value = false;
    };
  
    // 处理投票的回调
    const votedResult = ref('');  // 选择的结果
    const isAgree = ref(false);  // 已经选择过禁止选择
    const handleVote = (result: string) => {
      votedResult.value = result === 'like' ? '赞成' : '反对';
      isAgree.value = true;
      isVoteSuccessfully.value = true; 
      console.log('votedResult.value', votedResult.value)
    };
  
    const hasMore = ref(true);
    const currentFilterCriteria = ref({
      auditStatus: '',
      businessId: '',
      nodePeriodId: '',
      businessType: ''
    });
    
    const fetchNews = async (page: number) => {
      // let businessIds = ''
      const { businessId, businessType, auditStatus, nodePeriodId } = currentFilterCriteria.value;
      // if(businessType == '1') {
      //   businessIds = userInfo.daoId;
      // } else if(businessType == '2') {
      //   businessIds = businessId;
      // } else if(businessType == '3') {
      //   businessIds = userInfo.missionId;
      // } else {
      //   if(props.type == 1) {
      //     businessIds = userInfo.missionId;
      //   } else {
      //     businessIds = userInfo.daoId;
      //   }
      // }

      let getData = {
          pageNum: page,
          pageSize: 16,
          businessType: businessType,
          nodePeriodId: nodePeriodId,
          auditStatus: auditStatus,
          businessId: businessId
      }
      console.log(getData);
      try {
        const response = await nodeDataList(getData);
        const { code, data, message } = response;
  
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }
  
        if(data.rows.length == 0) {
          hasMore.value = false;
          return false;
        } else {
          userInfo.nodeIdList = data.rows.map((item: { nodeDataId: any; }) => item.nodeDataId);
          return data.rows;
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
    };
  
    // 查看详情
    const findRouterNodeDetailsFun = (item: any) => {
      // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部
      if(ismoduleType.value == 1){
        if(proType.value == 1 || proType.value == 3 || proType.value == 4) {
          let id = item.nodeDataId;
          userInfo.businessId = item.id;
          setItem('businessId', item.id);
          // router.push({ name: 'NodeDetails', params: { id: id} })
          emit('update:content', id);
        }
      } else if(ismoduleType.value == 2){
        if(proType.value == 1 || proType.value == 3 || proType.value == 4) {
          let id = item.nodeDataId;
          userInfo.businessId = item.id;
          setItem('businessId', item.id);
          emit('update:content', id);
        }
      }
    }

    watch(() => props.refresh, (newRefresh) => {
      if (newRefresh) {
        fetchNews(1);
        refreshKey.value += 1;
      }
    });
    // watch(() => props.type, (newRefresh) => {
    //   if (newRefresh) {
    //     proType.value = newRefresh;
    //   }
    // });
    
  
    onMounted(() => {
      /**
      *bigTaskUserId // 大任务发布者id
      *daoAdminUserId // Dao管理id
      *subtaskAdminUserId // 子任务管理id
      *isMissKanbanType // 1：大任务发布者通过查看节点、查看提案进去看板；2：大任务发布者从进入任务进去看板
      *ctt // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部
      * businessType: 1 大任务 2子任务 3dao下所有子任务
      **/
      const currentUrl = window.location.href; // 获取当前页面的 URL
      let id = extractIdFromUrl(currentUrl)+'';
      if(currentUrl.includes('executeDetails')){
        ismoduleType.value = 1;
        if(userInfo.id == userInfo.bigTaskUserId) {
          if(userInfo.isMissKanbanType == 1) {
            proType.value = 1;
          } else {
            proType.value = 2;
          }
        } else if(userInfo.id == userInfo.daoAdminUserId) {
          proType.value = 3;
        } else if(userInfo.id == userInfo.subtaskAdminUserId) {
          proType.value = 4;  
        } else {
          proType.value = 5;
        }
        if(proType.value == 1) {
          currentFilterCriteria.value.businessType = '1'
          currentFilterCriteria.value.businessId = userInfo.missionId;
        } else if(proType.value == 2) {
          currentFilterCriteria.value.businessType = '3'
          currentFilterCriteria.value.businessId = userInfo.daoId;
        } else if(proType.value == 3) {
          currentFilterCriteria.value.businessType = '3'
          currentFilterCriteria.value.businessId = userInfo.daoId;
        } else if(proType.value == 4) {
          currentFilterCriteria.value.businessType = '2'
          currentFilterCriteria.value.businessId = id;
        } else{
          currentFilterCriteria.value.businessType = '3'
          currentFilterCriteria.value.businessId = userInfo.daoId;
        }
        if(proType.value !== 1){
          findTasksListNodeDataFun();
        } else {
          findMissionsNodePeriodDropFun(userInfo.missionId, 1)
        }
      } else if(currentUrl.includes('personalTasks')){
        ismoduleType.value = 2;
        currentFilterCriteria.value.businessType = '1'
        currentFilterCriteria.value.businessId = userInfo.missionId;
        if(userInfo.id == userInfo.bigTaskUserId) {
            proType.value = 1;
        } else if(userInfo.id == userInfo.arAdminUserId) {
          proType.value = 3;
        } else {
          proType.value = 5;
        }
      }
    });
  </script>
  
  <style lang='scss' scoped>
    .node{
      width: 100%;
      height: 100%;
      .node-container{
        width: 100%;
        height: 100%;
        .node-header{
            width: 100%;
            height: 46px;
            .node-header-flex{
                width: calc(100% - 20px);
                height: auto;
                display: flex;
                padding: 0 10px;
                margin: 0 auto;
                justify-content: space-around;
                .dow-select{
                  width: 33.333%;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 46px;
                    text-align: left;
                    :deep(.cascader){
                    padding: 7px 0;
                    .cascader-input{
                        span{
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    .cascader-dropdown{
                        width: 200px;
                        .cascader-menus{
                            width: 100%;
                            .cascader-menu{
                                width: 100%;
                                max-width: 200px;
                                max-height: 200px;
                            }
                        }
                    }
                    }
                        
                }
            }
        }
        .node-content{
          width: 100%;
          height: calc(100% - 46px);
          .node-content-main{
            width: 100%;
            height: 100%;
            .node-content-main-bg{
                width: 100%;
                height: 100%;
                .table-header{
                    width: 100%;
                    height: 32px;
                    border: 1px solid rgba(255, 255, 255, 0.38);
                    border-right: none;
                    border-left: none;
                    ul{
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: space-around;
                        li{
                            font-weight: 400;
                            font-size: 12px;
                            color: #FFFFFF;
                            line-height: 32px;
                            text-align: center;
                            list-style-type: none;
                        }
                    }
                }
                .table-content{
                    width: 100%;
                    height: calc(100% - 32px);
                }
            }
            .list-item{
              width: 100%;
              height: 65px;
              break-inside: avoid;
              .list-item-main{
                height: 100%;
                cursor: pointer;
                .list-item-main-content{
                  height: 100%;
                  margin: 0 10px;
                  display: flex;
                  justify-content: space-between;
                }
                .cell{
                  margin-right: 10px;
                  &:last-child{
                    margin-right: 0;
                  }
                  .cell-main{
                    width: 100%;
                    height: 100%;
                    display: flex;
                  }
                  .cell-main-img{
                    width: 58px;
                    height: 58px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    margin: 3.5px 0 3.5px 0;
                    background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
                    background-size: 100% 100%;
                    :deep(.el-image, img) {
                      width: 70%;
                      height: 70%;
                      border-radius: 50%;
                      display: block;
                      margin: 15% auto;
                    }
                  }
                  .cell-main-icon{
                    width: 24px;
                    height: auto;
                    margin-right: 12px;
                    flex-shrink: 0;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 105px;
                    }
                  }
                  .cell-main-info{
                    flex: 1;
                    width: 0;
                    .cell-main-title{
                      font-size: 14px;
                      color: #FFFFFF;
                      line-height: 1;
                      text-align: left;
                      margin-bottom: 3px;
                      margin-top: 13px;
                      display: -webkit-box;
                      -webkit-line-clamp: 1;
                      line-clamp: 1;
                      -webkit-box-orient: vertical;
                      box-orient: vertical;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: initial;
                    }
                    .cell-main-desc{
                      font-size: 12px;
                      color: rgb(255, 255, 255, .7);
                      line-height: 1.2;
                      text-align: left;
                      display: -webkit-box;
                      -webkit-line-clamp: 1;
                      line-clamp: 1;
                      -webkit-box-orient: vertical;
                      box-orient: vertical;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: initial;
                    }
                  }
                  .cell-main-name{
                    flex: 1;
                    font-size: 12px;
                    color: #FFFFFF;
                    line-height: 65px;
                    text-align: left;
                    white-space: nowrap;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: initial;
                  }
                  .cell-main-date{
                    font-size: 12px;
                    color: #FFFFFF;
                    line-height: 65px;
                    text-align: left;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal; /* 允许换行 */
                  }
                  .cell-main-but{
                    width: 100%;
                    height: 35px;
                    margin: 15px 0;
                    position: relative;
                    box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5), /* 外发光 */
                          -1px 1px 3px rgba(255, 255, 255, 0.5) inset; /* 内发光 */
                    border-radius: 8px 8px 8px 8px;
                    border: 1px solid rgba(0, 0, 0, 0.01);
                    background: rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(9px);
                    .but-sort{
                      width: 20px;
                      height: 20px;
                      font-size: 12px;
                      color: #FFFFFF;
                      line-height: 20px;
                      text-align: center;
                      white-space: nowrap;
                      position: absolute;
                      top: 0;
                      right: 0;
                      border-radius: 4px 8px 10px 50px;
                      background: rgba(161, 133, 90, 1);
                    }
                    .but-name{
                      width: 100%;
                      font-size: 14px;
                      color: #FFFFFF;
                      line-height: 35px;
                      text-align: center;
                      white-space: nowrap;
                    }
                  }
                  .cell-main-status{
                    width: 100%;
                    height: 35px;
                    i, p{
                      font-size: 20px;
                      color: #FFFFFF;
                      line-height: 65px;
                      text-align: center;
                      white-space: nowrap;
                    }
                    p{
                      font-size: 14px;
                    }
                  }
                  .cell-main-l{
                    width: 24px;
                    height: auto;
                    margin-right: 12px;
                    flex-shrink: 0;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 65px;
                    }
                  }
                  .cell-main-c{
                    width: 70px;
                    font-size: 12px;
                    color: #FFFFFF;
                    line-height: 65px;
                    text-align: left;
                  }
                  .cell-main-r{
                    width: 24px;
                    height: auto;
                    margin-right: 12px;
                    flex-shrink: 0;
                    display: none;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 65px;
                    }
                  }
                }
                .column1{
                  width: 120px;
                }
                .column2{
                  width: 20%;
                }
                .column3{
                  width: 20%;
                }
                .column4{
                  width: 70px;
                }
                .column5{
                  width: 50px;
                }
                &:hover{
                  background-color: rgb(255, 255, 255, .06);
                  .cell-main-r{
                    display: block;
                  }
                }
              }
            }
          }
        }
      }
    }
    .type-color1{
      background: radial-gradient(100% 0% at 0% 0%, #F8507B 0%, #D9072F 58%, #A7071E 97%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: block;
    }
    .type-color2{
      background: radial-gradient(100% 0% at 0% 0%, #ebd8b1 0%, #efc97c 58%, #e8bd67 97%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: block;
    }
    .type-color3{
      background: radial-gradient(100% 0% at 0% 0%, #00A0FF 0%, #5FD0FF 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: block;
    }
  </style>
  