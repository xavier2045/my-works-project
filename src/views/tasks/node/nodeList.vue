<template>
  <div class="node">
    <div class="node-container">
      <div class="node-header">
        <div class="node-header-flex">
          <div class="node-header-flex-l">
            <div class="node-header-flex-l-main">
              <div class="node-header-flex-l-main-previous">
                <div class="previous-icon" @click="goBack">
                  <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
                </div>
                <div class="previous-name">任务节点</div>
              </div>
            </div>
          </div>
          <div class="node-header-flex-c">
          </div>
          <div class="node-header-flex-r">
            <div class="node-header-flex-r-main">
                <div class="r-mian-time">
                  <template v-if="currentType == 2">
                    <MonthSwitcher  @updateDate="handleUpdateDate" />
                  </template>
                </div>
                <div class="r-mian-dow">
                  <template v-if="userInfo.id == userInfo.routerNodeId">
                    <div class="dow-list">
                      <div class="dow-icon">
                        <i class="icon font_family icon-tuanduichengyuan24"></i>
                      </div>
                      <div class="dow-select">
                          <TimeSelect
                            :options="selectList"
                            v-model="selectedValue"
                            placeholder="所有任务"
                            @open="handleOpen" 
                            @close="handleClose"
                            @update:modelValue="updateModelValue"
                          />
                      </div>
                    </div>
                  </template>
                </div>
                <div class="r-mian-type">
                  <div class="type-list">
                    <div 
                      class="type-item"
                      :class="item.value === currentType ? 'flag' : ''"
                      v-for="(item, index) in typeData" 
                      :key="index"
                      @click="changeType(item.value)"
                    >{{ item.name }}</div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div class="node-content">
        <div class="node-content-main">
          <div class="node-content-main-bg">
            <template v-if="currentType == 1">
              <infinite-scroll-list
                :fetchFunction="fetchNews"
                :hasMore="hasMore"
                :filterCriteria="currentFilterCriteria"
              >
                <template #item="{ items }">
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
                                <img :src="item.userAvatar" alt="" />
                              </div>
                              <div class="cell-main-info">
                                <div class="cell-main-title">{{ item.username }}</div>
                                <div class="cell-main-desc">{{ item.userMotto }}</div>
                              </div>
                            </div>
                          </div>
                          <div class="cell column2">
                            <div class="cell-main">
                              <div class="cell-main-icon">
                                <i class="icon font_family icon-gangwei24"></i>
                              </div>
                              <div class="cell-main-name">{{ item.name }}</div>
                            </div>
                          </div>
                          <div class="cell column3">
                            <div class="cell-main">
                              <div class="cell-main-icon">
                                <i class="icon font_family icon-tian24"></i>
                              </div>
                              <div class="cell-main-twoLine">{{ item.description }}</div>
                            </div>
                          </div>
                          <div class="cell column4">
                            <div class="cell-main">
                              <div class="cell-main-icon">
                                <i class="icon font_family icon-rili24"></i>
                              </div>
                              <div class="cell-main-name">{{ item.uploadTime }}</div>
                            </div>
                          </div>
                          <div class="cell column5">
                            <div class="cell-main lineFlex">
                              <div class="cell-main-l">
                                <template v-if="item.auditStatus === 2">
                                  <i class="icon font_family icon-gouxuanyuanxingbiankuang68"></i>
                                </template>
                                <template v-else-if="item.auditStatus === 3">
                                  <i class="icon font_family icon-dachayuanxingbiankuang68"></i>
                                </template>
                                <template v-else-if="item.auditStatus === 1">
                                  <i class="icon font_family icon-daishenhebiankuang24"></i>
                                </template>
                              </div>
                              <div class="cell-main-c">
                                <template v-if="item.auditStatus === 1">待审核</template>
                                <template v-else-if="item.auditStatus === 2">审核成功</template>
                                <template v-else-if="item.auditStatus === 3">审核失败</template>
                              </div>
                              <div class="cell-main-r">
                                <i class="icon font_family icon-a-jiantouxiangyouyue20"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                </template>
              </infinite-scroll-list>
            </template>
            <template v-else>
              <CalendarComponent
                :date="currentDate"
                :events="events"
                :onDateClick="handleDateClick"
                :onEventClick="handleEventClick"
              />
            </template>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { nodeDataList, tasksListNodeData, nodeDataListCalendar } from '@/api/dao';
  import { extractIdFromUrl, setItem } from '@/utils/index';
  import MonthSwitcher from '@/components/MonthSwitcher/index.vue';
  import TimeSelect from '@/components/TreeSelect/timeSelect.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import CalendarComponent from '@/components/CalendarComponent/index.vue';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;

  const router = useRouter();
  const businessId = ref('');
  const isType = ref(0);

  const taskData = ref({
    taskStatus: 0,
    screenData: '',
    concern: 0,
    ongoing: 0,
    completed: 0,
  });
  const currentDate = ref(''); // Format: 'YYYY-MM'
  const events = ref([
    {
      id: 1,
      time: '2024-11-01',
      nodeData: [
        {
          id: 1,
          userId: '',
          deadline: '',
          auditStatus: 1,
          userAvatar: 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png',
          message: '节点待审核',
        },
      ],
    },
    {
      id: 2,
      time: '2024-11-08',
      nodeData: [
        {
          id: 2,
          userId: '',
          deadline: '',
          auditStatus: 2,
          userAvatar: 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png',
          message: '节点审核失败',
        },
      ],
    },
    {
      id: 2,
      time: '2024-11-20',
      nodeData: [
        {
          id: 3,
          userId: '',
          deadline: '',
          auditStatus: 2,
          userAvatar: 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png',
          message: '节点审核失败',
        },
        {
          id: 4,
          userId: '',
          deadline: '',
          auditStatus: 1,
          userAvatar: 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png',
          message: '节点待审核',
        },
      ],
    },
  ]);
  // 选择年月
  // Define reactive values to store the selected year and month
  const selectedYear = ref<number>(new Date().getFullYear());
  const selectedMonth = ref<number>(new Date().getMonth() + 1);
  currentDate.value = `${selectedYear.value}-${selectedMonth.value}`;
  // Function to handle the event from the child component
  const handleUpdateDate = (payload: { year: number; month: number }) => {
    console.log('Selected Year:', payload.year);
    console.log('Selected month:', payload.month);
    selectedYear.value = payload.year;
    selectedMonth.value = payload.month;
    currentDate.value = `${selectedYear.value}-${selectedMonth.value}`;
    findNodeDataListCalendarFun();
  };


  // 筛选子任务
  const isSort = ref(false);
  const selectList = ref([]);
  const selectedValue = ref<string>('');
  // 列表下拉子任务数据
  const findTasksListNodeDataFun = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    let reqData = {
            id: id
        }
        return new Promise<void>((resolve, reject) => {
          tasksListNodeData(reqData).then((response: any) => {
                const { code, data, message } = response;
                
                const resultData = data;
                if (code !== 200) {
                  showPopup(message, 'error', 3000);
                    return;
                }
                resultData.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.taskId
                    }
                })
                // const unstData = {
                //   name: '所有任务',
                //   taskId: ''
                // };
                // resultData.unshift(unstData);
                resultData.map((item: any) => {
                    item.value = item.taskId
                    item.label = item.name
                })
                selectList.value = resultData;
                
                resolve()
            }).catch((error: any  ) => {
                reject(error)
            })
        })
  }

  // 筛选列表
  const updateModelValue = (val: string) => {
    businessId.value = val;
    currentFilterCriteria.value.businessId = val;
  };


  // 展开时添加背景色
  const handleOpen = () => {
    isSort.value = true;
  };
  // 展开时移除背景色
  const handleClose = () => {
    isSort.value = false;
  };


  const typeData = ref([
    { name: '列表', value: 1 },
    { name: '日历', value: 2 },
  ]);
  const currentType = ref(1);
  const changeType= (item: any) => {
    currentType.value = item;
    if(item == 2) {
      findNodeDataListCalendarFun();
    }
  };

  // 返回上一页
  const goBack = () => {
    router.go(-1);
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

  const drawer = ref(false);

  const hasMore = ref(true);
  const isfoll = ref(0); // 关注
  const isStates = ref(0);


  const currentFilterCriteria = ref({
    type: taskData.value.taskStatus,
    status: isStates.value,
    isFollow: isfoll.value,
    businessId: businessId.value
  });
  
  const fetchNews = async (page: number) => {
    let getData = {
        pageNum: page,
        pageSize: 16,
        businessType: userInfo.nodeType,
        businessId: Number(businessId.value)
    }
    if(userInfo.nodeType == 3) {
      if(selectedValue.value !== '') {
        getData.businessType = 2;
      } else {
        getData.businessType = 3;
      }
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
        return data.rows;
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  };

  // 查看详情
  const findRouterNodeDetailsFun = (item: any) => {
    let id = item.nodeDataId;
    userInfo.businessId = item.id;
    setItem('businessId', item.id);
    router.push({ name: 'NodeDetails', params: { id: id} })
  }

  /** 日历模块 **/
  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
  };

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event);
    let id = event.nodeDataId;
    userInfo.businessId = event.id;
    setItem('businessId', event.id);
    router.push({ name: 'NodeDetails', params: { id: id} })
  };

  const findNodeDataListCalendarFun = () => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    const nodeType = ref();
    if(userInfo.nodeType == 2 || userInfo.nodeType == 3) {
      nodeType.value = 2
    } else {
      nodeType.value = userInfo.nodeType;
    }
    let getData = {
      businessType: nodeType.value,
      missionId: id,
      time: currentDate.value
    }
    return new Promise<void>((resolve, reject) => {
      nodeDataListCalendar(getData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        events.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  onMounted(() => {
    const currentUrl = window.location.href; // 获取当前页面的 URL
    let id = extractIdFromUrl(currentUrl)+'';
    
    businessId.value = id;
    if(userInfo.id == userInfo.routerNodeId) {
      findTasksListNodeDataFun();
    }
  });
</script>

<style lang='scss' scoped>
  .node{
    width: 100%;
    height: calc(100% - 110px);
    .node-container{
      height: 100%;
      padding: 0 31px;
      .node-header{
        width: 100%;
        height: auto;
        margin-top: 30px;
        .node-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .node-header-flex-l{
            height: auto;
            flex-shrink: 0;
            .node-header-flex-l-main{
              width: 100%;
              height: auto;
              
              .node-header-flex-l-main-previous{
                width: auto;
                height: auto;
                display: flex;
                line-height: 46px;
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
                    text-align: center;
                  }
                }
                .previous-name{
                  width: auto;
                  font-size: 20px;
                  color: #FFFFFF;
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
          .node-header-flex-c{
            flex-grow: 1;
          }
          .node-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .node-header-flex-r-main{
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              .r-mian-time{
                width: 200px;
                margin-right: 110px;
              }
              .r-mian-dow{
                min-width: 150px;
                margin-right: 40px;
                .dow-list{
                  width: 100%;
                  height: auto;
                  display: flex;
                  .dow-icon{
                    width: 24px;
                    height: auto;
                    flex-shrink: 0;
                    margin-right: 10px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 46px;
                      text-align: center;
                    }
                  }
                  .dow-select{
                    flex: 1;
                    width: 0;
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
                          }
                        }
                      }
                    }
                    
                  }
                }
              }
              .r-mian-type{
                width: 137px;
                height: 32px;
                padding: 7px;
                border-radius: 23px;
                background-color: rgb(255, 255, 255, .06);
                .type-list{
                  display: flex;
                  .type-item{
                    width: 68px;
                    height: 32px;
                    cursor: pointer;
                    font-size: 16px;
                    border-radius: 16px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 32px;
                    text-align: center;
                    background-color: transparent;
                  }
                }
                .flag{
                  color: #FFFFFF !important;
                  background-color: rgb(255, 255, 255, .38) !important;
                }
              }
            }
          }
        }
      }
      .node-content{
        width: 100%;
        height: calc(100% - 67px);
        .node-content-main{
          width: 100%;
          height: 100%;
          margin-top: 27px;
          .node-content-main-bg{
            height: 100%;
            overflow: hidden;
            border-radius: 28px;
            background-color: rgb(255, 255, 255, .06);
            backdrop-filter: blur(20px);
            border: 1px solid rgb(255, 255, 255, .38);
          }
          .list-item{
            width: 1123px;
            height: 105px;
            break-inside: avoid;
            
            .list-item-main{
              height: 100%;
              cursor: pointer;
              .list-item-main-content{
                height: 100%;
                margin: 0 32px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid rgb(255, 255, 255, .38);
              }
              .cell{
                margin-right: 20px;
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
                  margin: 23.5px 12px 23.5px 0;
                  img{
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
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
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 1;
                    text-align: left;
                    margin-bottom: 13px;
                    margin-top: 30px;
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
                    font-size: 14px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 1;
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
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 105px;
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
                .cell-main-twoLine{
                  width: 270px;
                  font-size: 16px;
                  margin: 30px 0;
                  color: #FFFFFF;
                  line-height: 1.5;
                  text-align: left;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: normal; /* 允许换行 */
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
                    line-height: 105px;
                  }
                }
                .cell-main-c{
                  width: 70px;
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 105px;
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
                    line-height: 105px;
                  }
                }
              }
              .column1{
                width: 280px;
              }
              .column2{
                width: 240px;
              }
              .column3{
                flex-grow: 243px;
              }
              .column4{
                width: 200px;
              }
              .column5{
                width: 200px;
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

</style>
