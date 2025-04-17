<template>
    <div class="node">
      <div class="node-container">
        <div class="node-header">
          <div class="node-header-flex">
            <div class="dow-select" v-if="currentFilterCriteria.businessType !== '3'">
                <TimeSelect
                    :options="selectList"
                    v-model="selectedValue"
                    placeholder="全部奇点"
                    @open="handleOpen" 
                    @close="handleClose"
                    @update:modelValue="updateModelValue"
                />
            </div>
            <div class="dow-select">
                <TimeSelect
                    :options="typeList"
                    v-model="selectedValue"
                    placeholder="奇点状态"
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
                        <li>上传者</li>
                        <li>时间</li>
                        <li>奇点</li>
                        <li>状态</li>
                    </ul>
                </div>
                <div class="table-content">
                    <infinite-scroll-list
                        :fetchFunction="fetchNews"
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
                                      <div class="cell-main-name">{{ item.uploadTime }}</div>
                                    </div>
                                </div>
                                <div class="cell column3">
                                    <div class="cell-main">
                                      <div class="cell-main-but">
                                        <i 
                                          class="icon font_family icon-wenjianjia" 
                                          :class="findFirstFileTypeFun(item.firstFileType)"
                                        >
                                        </i>
                                      </div>
                                    </div>
                                </div>
                                <div class="cell column4">
                                    <div class="cell-main">
                                      <div class="cell-main-status">
                                        <template v-if="item.auditState == 2">
                                          <i class="icon font_family icon-qidianzhuangtai20 type-color1"></i>
                                        </template>
                                        <template v-else-if="item.auditState == 3">
                                          <i class="icon font_family icon-qidianshanglianzhuangtai20 type-color3"></i>
                                        </template>
                                        <template v-else-if="item.auditState == 1">
                                          <p>待审核</p>
                                        </template>
                                        <template v-else>
                                          {{item}}
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
    import { nodeDataList, tasksListNodeData, nodeDataListCalendar, knowledgeList } from '@/api/dao';
    import { missionsDaosTasksDrop, missionsKnowledgeList } from '@/api/kanban';
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

    // 定义图片和视频的后缀列表
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];
    const textExtensions = ['txt', 'docx', 'pdf', 'doc', 'xls', 'xlsx'];

    // 函数用于获取文件扩展名
    const getFileExtension = (filename: string) => {
      const match = filename.match(/\.([^.]+)$/);
      return match ? match[1].toLowerCase() : '';
    }
    const findFirstFileTypeFun = (type: string) => {
      if(type !== null) {
        const extension = getFileExtension(type);
        if (imageExtensions.includes(extension)) {
          return 'icon-shangchuantupian24';
        } else if (videoExtensions.includes(extension)) {
          return 'icon-shangchuanshipin24';
        } else if (textExtensions.includes(extension)) {
          return 'icon-tianjiawenzi24';
        } else {
          return 'icon-yinpinwenjian24';
        }
      } else {
        return 'icon-tianjiawenzi24';
      }
      
    };

    const typeList = ref([
      { value: '', label: '全部' },
      { value: 1, label: '待审核' },
      { value: 2, label: '审核失败' },
      { value: 3, label: '审核通过' },
    ])
  
    // 筛选子任务
    const isSort = ref(false);
    const selectList = ref([]);
    const selectedValue = ref<string>('');
    // 列表下拉子任务数据
    const findTasksListNodeDataFun = () => {
      const currentUrl = window.location.href; // 获取当前页面的 URL
      let id = extractIdFromUrl(currentUrl)+'';
      let reqData = {
            businessId: userInfo.missionId,
            businessType: 3
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
                  selectList.value = resultData;
                  
                  resolve()
              }).catch((error: any  ) => {
                  reject(error)
              })
          })
    }
  
    // 筛选列表
    const updateModelValue = (val: string) => {
      let type = 0;
      let id = 0;
      selectList.value.forEach((item: any) => {
        if(item.value == val) {
          type = item.type;
        }
      });
      const currentUrl = window.location.href; // 获取当前页面的 URL
      //下拉type: 1.大任务 2.DAO 3.子任务
      //续转：1dao知识库 2我的个人知识库 3 任务知识库
      if(type == 1) {
        type = 3;
        id = userInfo.missionId;
      } else if(type == 2) {
        type = 1;
        id = userInfo.daoId;
      } else if(type == 3) {
        type = 1;
        id = userInfo.daoId;
      }
      currentFilterCriteria.value.businessId = id+'';
      if(currentUrl.includes('executeDetails')){
        currentFilterCriteria.value.businessType = '1'
      } else if(currentUrl.includes('personalTasks')){
        currentFilterCriteria.value.businessType = '2'
      }
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
  
    const hasMore = ref(true);
    const currentFilterCriteria = ref({
      auditStatus: '',
      businessId: '',
      businessType: ''
    });
    
    const fetchNews = async (page: number) => {
      let getData = {
          pageNum: page,
          pageSize: 16,
          auditStatus: currentFilterCriteria.value.auditStatus,
          businessType: currentFilterCriteria.value.businessType,
          businessId: currentFilterCriteria.value.businessId
      }
      try {
        const response = await knowledgeList(getData);
        const { code, data, message } = response;
  
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }
        if(data.rows.length == 0) {
          hasMore.value = false;
          return false;
        } else {
          userInfo.knowledgeIdList = data.rows.map((item: { knowledgeId: any; }) => item.knowledgeId);
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
      if(proType.value == 1 || proType.value == 3) {
        let id = item.knowledgeId;
        userInfo.knowledgeId = item.id;
        setItem('proposalId', item.id);
        emit('update:content', id);
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
      **/
      const currentUrl = window.location.href; // 获取当前页面的 URL
      if(currentUrl.includes('executeDetails')){
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
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
        currentFilterCriteria.value.businessType = '1'
        if(proType.value == 1) {
          // currentFilterCriteria.value.businessType = '3'
          currentFilterCriteria.value.businessId = userInfo.missionId;
        } else if(proType.value == 2) {
          // currentFilterCriteria.value.businessType = '1'
          currentFilterCriteria.value.businessId = userInfo.daoId;
        } else if(proType.value == 3) {
          // currentFilterCriteria.value.businessType = '3'
          currentFilterCriteria.value.businessId = userInfo.daoId;
        } else if(proType.value == 4) {
          // currentFilterCriteria.value.businessType = '4'
          currentFilterCriteria.value.businessId = id;
        } else{
          // currentFilterCriteria.value.businessType = '1'
          currentFilterCriteria.value.businessId = userInfo.daoId;
        }
        findTasksListNodeDataFun();
      } else if(currentUrl.includes('personalTasks')){
        currentFilterCriteria.value.businessType = '3'
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
        widows: 100%;
        height: 100%;
        .node-header{
            width: 100%;
            height: auto;
            .node-header-flex{
                width: 100%;
                height: auto;
                display: flex;
                justify-content: space-around;
                .dow-select{
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
                          right: 0;
                          left: auto;
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
        .node-content{
          width: 100%;
          height: calc(100% - 46px);
          .node-content-main{
            width: 100%;
            height: 100%;
            .node-content-main-bg{
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                .table-header{
                    width: 100%;
                    height: 32px;
                    flex: 0 0 auto;
                    flex-shrink: 0;
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
                    height: auto;
                    flex: 1 1 auto;
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
                  margin: 0 32px;
                  display: flex;
                  justify-content: space-between;
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
                      line-height: 65px;
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
                      margin-top: 10px;
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
                  .cell-main-but{
                    width: 100%;
                    height: 35px;
                    margin: 15px 0;
                    box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5), /* 外发光 */
                          -1px 1px 3px rgba(255, 255, 255, 0.5) inset; /* 内发光 */
                    border-radius: 8px 8px 8px 8px;
                    border: 1px solid rgba(0, 0, 0, 0.01);
                    background: rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(9px);
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      line-height: 35px;
                      text-align: center;
                      white-space: nowrap;
                      display: block;
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
                      line-height: 65px;
                    }
                  }
                  .cell-main-c{
                    width: 70px;
                    font-size: 16px;
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
                  width: 40px;
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
  