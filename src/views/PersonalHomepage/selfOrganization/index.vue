<template>
  <div class="daoList">
    <persHeader />
    <div class="daoList-container">
      <div class="daoList-header">
        <div class="daoList-header-flex">
          <div class="daoList-header-flex-l">
            <div class="daoList-header-flex-l-main">
              <div
                class="flex-l-main-typeList"
                :class="{ active: type.value === isType}"
                v-for="(type, index) in typeList"
                :key="index"
                @click="findTypeFun(type)"
              >
                <div class="flex-l-main-typeList-item">
                  <div class="flex-l-main-typeList-item-icon">
                    <i :class="`icon font_family ${type.icon}`"></i>
                  </div>
                  <div class="flex-l-main-typeList-item-text">{{ type.label }}</div>
                  <div class="flex-l-main-typeList-item-line">
                    <template v-if="type.value === '1'"> {{ taskData.statusIngNum }} </template>
                    <template v-else-if="type.value === '2'"> {{ taskData.statusDisNum }} </template>
                    <template v-else> {{ taskData.completed }} </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="daoList-header-flex-c"></div>
          <div class="daoList-header-flex-r">
            <div class="daoList-header-flex-r-main">
              <!-- <div class="personal-list-sort">
                <div class="personal-list-sort-main">
                  <div class="sort-icon"> 
                    <i class="icon font_family icon-suoyouhuodong20"></i>
                  </div>
                  <div class="sort-select">
                    <TreeSelect
                      :options="taskStatus"
                      v-model="taskData.taskStatus"
                      placeholder="我的任务"
                      @selected="onSelected"
                    />
                  </div>
                </div>
              </div> -->
              <div class="personal-list-sort">
                <div class="personal-list-sort-main">
                  <div class="sort-icon">
                    <i class="icon font_family icon-shaixuan20"></i>
                  </div>
                  <div class="sort-select">
                    <TreeSelect
                      :options="taskStatus"
                      v-model="taskData.taskStatus"
                      placeholder="筛选与排序"
                      @selected="onSelected"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="daoList-content">
        <div class="daoList-content-main">
          <infinite-scroll-list
            :fetchFunction="fetchNews"
            :hasMore="hasMore"
            :filterCriteria="currentFilterCriteria"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="20" :cols="6">
                <div 
                  v-for="item in items" 
                  :key="item.daoId" 
                  class="dao-item fade-up-item"
                  @click="toTaskDetail(item.daoId)"
                >
                  <div class="dao-item-content">
                    <div class="dao-item-pic">
                      <div class="dao-item-pic-main">
                        <img :src="item.daoCover" alt="" />
                      </div>
                    </div>
                    <div class="dao-item-type">
                      <template v-if="item.daoStatus === 0">
                        <i class="icon font_family icon-renwuyijiesan44"></i>
                      </template>
                      <template v-if="item.daoStatus === 1">
                        <i class="icon font_family icon-jinhangzhong"></i>
                      </template>
                    </div>
                    <div class="dao-item-info">
                      <div class="dao-item-info-main">
                        <div class="dao-item-info-main-t">
                          <div class="dao-name" :title="item.daoName">{{ item.daoName }}</div>
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
  import { daosMineList } from '@/api/dao';
  import { aeUseStore } from '@/stores/user';
  import TreeSelect from '@/components/TreeSelect/index.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import { setItem } from '@/utils/index';
import { showPopup } from '@/utils/usePopup';
  const userId = ref(''); // 查看他人的用户id
  const router = useRouter();
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  console.log('userInfo', userInfo);

  // 如果没有他人id，则取登录人id
  if(userInfo.othersId !== '') {
      userId.value = userInfo.othersId;
  } else {
      userId.value = userInfo.id;
  }

  const taskData = ref({
    taskStatus: 0,
    screenData: '',
    concern: 0,
    ongoing: 0,
    completed: 0,
  });

  const hasMore = ref(true);

  const isfoll = ref(0); // 筛选
  const isStates = ref(1);
  const currentFilterCriteria = ref({
    businessType: 2,
    status: isStates.value,
    type: isfoll.value,
    seeUserId: userId.value
  });

  watch(() => userInfo.othersId, (newValue) => {
      if(newValue !== '') {
          userId.value = userInfo.othersId;
      } else {
          userId.value = userInfo.id;
      }
      currentFilterCriteria.value.seeUserId = userId.value;
  });

  const fetchNews = async (page: number) => {
      let getData = {
        pageNum: page,
        pageSize: 16,
        type: isfoll.value,
        status: isStates.value,
        seeUserId: userId.value
      }
      console.log(getData);
      try {
        const response = await daosMineList(getData);
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
  
  const isType = ref('0');
  const typeList = [
    { value: '1', label: '进行中', icon: 'icon-jinhangzhong'},
    { value: '2', label: '已解散', icon: 'icon-renwuyijiesan44' },
  ]
  const findTypeFun = async (item: any) => {
    isType.value = item.value;
    if (item.value == 1) {
      if (isStates.value == 99) {
        isStates.value = 1;
      } else {
        isStates.value = 99;
      }
    } else if (item.value == 2) {
      if (isStates.value == 99) {
        isStates.value = 0;
      } else {
        isStates.value = 99;
      }
    }

    currentFilterCriteria.value.isFollow = isfoll.value; // 更新 filterCriteria
    currentFilterCriteria.value.status = isStates.value; // 更新 filterCriteria
  };

  const taskStatus = [
    { value: 0, label: '所有的' },
    { value: 1, label: '我创建的' },
    { value: 2, label: '我加入的' },
  ];
  // 获取选中的筛选条件
  const onSelected = async (option: any) => {
      if (!option) return;
      console.log('option', option);
      taskData.value.taskStatus = option.value;
      currentFilterCriteria.value.type = option.value; // 更新 filterCriteria
    };


  const screenData = [
    { value: '1', label: '进行中' },
    { value: '2', label: '进行中' },
    { value: '3', label: '进行中' },
  ];



  /** 点击复制NFT **/
  // const copyContent = async (nft: string) => {
  //     await copyToClipboard(nft);
  //     alert('文本已复制到剪贴板');
  // };

  // 点击任务详情
  const toTaskDetail = async (daoId: string) => {
    let id = daoId;
    userInfo.daoType = 1;
    setItem('daoType', 1);
    router.push({ name: 'DaoDetails', params: { id } });
  };

  onMounted(() => {
    
  });
</script>

<style lang='scss' scoped>
  .daoList{
    padding-left: 20px;
    height: calc(100% - 11px);
    .daoList-container{
      width: 100%;
      height: calc(100% - 114px);
      .daoList-header{
        width: 100%;
        height: auto;
        margin-top: 30px;
        .daoList-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .daoList-header-flex-l{
            height: auto;
            flex-shrink: 0;
            padding-left: 52px;
            .daoList-header-flex-l-main{
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
          .daoList-header-flex-c{
            flex-grow: 1;
          }
          .daoList-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .daoList-header-flex-r-main{
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
      .daoList-content{
        width: 100%;
        height: calc(100% - 25px);
        .daoList-content-main{
          width: 100%;
          height: 100%;
          :deep(.el-scrollbar__view){
            padding-top: 52px;
          }
          .dao-item {
            width: 232px;
            height: auto;
            cursor: pointer;
            :hover{
              .dao-item-pic {
                .dao-item-pic-main{
                  img {
                    transform: scale(1.05);
                  }
                }
                
              }
            }
            .dao-item-masking{
              width: calc(100% - 59px) !important;
              height: calc(100% - 60px) !important;
              border: 10px solid #FFFFFF !important;
              border-radius: 18px;
              position: absolute;
              top: 20px;
              left: 20px;
              z-index: 3;
              display: none;
            }
            .dao-item-shadow{
              width: calc(100% - 59px) !important;
              height: calc(100% - 60px) !important;
              border: 10px solid #FFFFFF !important;
              border-radius: 38px;
              position: absolute;
              top: 20px;
              left: 20px;
              z-index: 2;
              display: none;
            }
            .dao-item-content {
              width: 100%;
              position: relative;
              border-radius: 18px;
              overflow: hidden;
              background: rgba(229, 229, 229, 0.08);
              backdrop-filter: blur(40px);
              box-shadow: 0px 0px 56px 1px rgba(0,0,0,0.52);
              .dao-item-pic {
                padding: 6px;
                .dao-item-pic-main{
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
                }
              }
              .dao-item-type{
                display: inline-block;
                position: absolute;
                top: 20px;
                left: 20px;
                i{
                  font-size: 36px;
                  color: #FFFFFF;
                }
              }
              .dao-item-info {
                height: auto;
                padding: 0 23px;
                .dao-item-info-main{
                  width: 100%;
                  height: auto;
                  .dao-item-info-main-t{
                    width: 100%;
                    display: flex;
                    margin: 12px 0 18px 0;
                    .dao-name{
                      flex: 1;
                      font-size: 16px;
                      color: #FFFFFF;
                      line-height: 1;
                      text-align: center;
                      font-style: normal;
                      text-transform: none;
                      overflow:hidden;
                      text-overflow: ellipsis;
                      -webkit-line-clamp: 1;
                      line-clamp: 1;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                    }
                  }
                }
              }
              @media (max-width: 576px) {
                .dao-item-info {
                  width: calc(100% - 46px);
                  padding: 0 23px;
                  .dao-item-info-main{
                    .dao-name{
                      font-size: 60px;
                    }
                    .dao-data{
                      .dao-data-main{
                        .item-title{
                          font-size: 56px;
                        }
                        .item-value{
                          font-size: 58px;
                        }
                      }
                    }
                  }
                }
              }
              @media (min-width: 576px) {
                .dao-item-info {
                  width: calc(100% - 46px);
                  padding: 0 23px;
                  .dao-item-info-main{
                    .dao-name{
                      font-size: 80px;
                    }
                    .dao-data{
                      .dao-data-main{
                        .item-title{
                          font-size: 76px;
                          margin-bottom: 55px;
                        }
                        .item-value{
                          font-size: 78px;
                        }
                      }
                    }
                  }
                }
              }
              @media (min-width: 768px) {
                .dao-item-info {
                  width: calc(100% - 46px);
                  padding: 0 23px;
                  .dao-item-info-main{
                    .dao-name{
                      font-size: 40px;
                    }
                    .dao-data{
                      .dao-data-main{
                        .item-title{
                          font-size: 36px;
                          margin-bottom: 15px;
                        }
                        .item-value{
                          font-size: 38px;
                        }
                      }
                    }
                  }
                }
              }@media (min-width: 992px) {
                .dao-item-info {
                  width: calc(100% - 46px);
                  padding: 0 23px;
                  .dao-item-info-main{
                    .dao-name{
                      font-size: 40px;
                    }
                    .dao-data{
                      .dao-data-main{
                        .item-title{
                          font-size: 36px;
                          margin-bottom: 15px;
                        }
                        .item-value{
                          font-size: 38px;
                        }
                      }
                    }
                  }
                }
              }
              @media (min-width: 1200px) {
                .dao-item-info {
                  width: calc(100% - 46px);
                  padding: 0 23px;
                  .dao-item-info-main{
                    .dao-name{
                      font-size: 40px;
                    }
                    .dao-data{
                      .dao-data-main{
                        .item-title{
                          font-size: 16px;
                          margin-bottom: 10px;
                        }
                        .item-value{
                          font-size: 18px;
                        }
                      }
                    }
                  }
                }
              }
              @media (min-width: 1600px) {
                .dao-item-info {
                  width: calc(100% - 46px);
                  padding: 0 23px;
                  .dao-item-info-main{
                    .dao-name{
                      font-size: 20px;
                    }
                    .dao-data{
                      .dao-data-main{
                        .item-title{
                          font-size: 16px;
                          margin-bottom: 6px;
                        }
                        .item-value{
                          font-size: 18px;
                        }
                      }
                    }
                  }
                }
              }
              @media (min-width: 1920px) {
                .dao-item-info {
                  width: calc(100% - 46px);
                  padding: 0 23px;
                  .dao-item-info-main{
                    .dao-name{
                      font-size: 20px;
                    }
                    .dao-data{
                      .dao-data-main{
                        .item-title{
                          font-size: 16px;
                          margin-bottom: 6px;
                        }
                        .item-value{
                          font-size: 18px;
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
</style>
