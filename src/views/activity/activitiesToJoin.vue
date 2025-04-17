<template>
  <div class="activitiesList">
    <persHeader />
    <div class="activitiesList-main">
      <div class="activitiesList-header">
        <div class="activitiesList-header-flex">
          <div class="activitiesList-header-flex-l">
            <div class="activitiesList-header-flex-l-main">
              <div
                class="flex-l-main-typeList"
                v-for="(type, index) in typeList"
                :key="index"
              >
                <div class="flex-l-main-typeList-item">
                  <div class="flex-l-main-typeList-item-icon">
                    <i :class="`icon font_family ${type.icon}`"></i>
                  </div>
                  <div class="flex-l-main-typeList-item-text">{{ type.label }}</div>
                  <div class="flex-l-main-typeList-item-line">
                    <template v-if="type.value === '1'"> {{ taskData.concern }} </template>
                    <template v-else-if="type.value === '2'"> {{ taskData.ongoing }} </template>
                    <template v-else> {{ taskData.completed }} </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="activitiesList-header-flex-c"></div>
          <div class="activitiesList-header-flex-r">
            <div class="activitiesList-header-flex-r-main">
              <div class="personal-list-sort">
                <div class="personal-list-sort-main">
                  <div class="sort-icon"> 
                    <i class="icon font_family icon-suoyouhuodong20"></i>
                  </div>
                  <div class="sort-select">
                    <TreeSelect
                      :options="taskStatus"
                      v-model="taskData.taskStatus"
                      placeholder="我的任务"
                    />
                  </div>
                </div>
              </div>
              <div class="personal-list-sort">
                <div class="personal-list-sort-main">
                  <div class="sort-icon">
                    <i class="icon font_family icon-shaixuan20"></i>
                  </div>
                  <div class="sort-select">
                    <TreeSelect
                      :options="screenData"
                      v-model="taskData.screenData"
                      placeholder="筛选与排序"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="activitiesList-content">
        <div class="activitiesList-content-main">
          <infinite-scroll-list :fetchFunction="fetchNews" :hasMore="hasMore">
            <template #item="{ items }">
              <wc-waterfall :gap="30" :cols="4">
                <div v-for="item in items" :key="item.id" class="list-item fade-up-item">
                  <div class="list-item-main">
                    <div class="list-item-main-img">
                      <img :src="item.cover" alt="" />
                    </div>
                    <div class="activities-ntf">
                      <i class="icon font_family icon-lianjie24" v-if="item.isOnline !== 1"></i>
                    </div>
                    <div class="list-item-main-content">
                      <div class="item-content-info">
                        <div class="item-content-name">{{ item.name }}</div>
                        <div class="item-content-flex">
                          <div class="item-content-participant">
                            <div class="item-content-participant-num">
                              <em>{{ item.ticketAmount }}</em>人正在参与
                            </div>
                            <div class="item-content-participant-user">
                              <div
                                class="user-list"
                                v-for="(user, index) in item.participant"
                                :key="index"
                              >
                                <img :src="user.avatar" alt="" />
                              </div>
                            </div>
                          </div>
                          <div class="item-content-initiator">
                            发起人：{{ item.initiator }}
                          </div>
                          <div class="item-content-fullAddress">
                            <div class="item-content-fullAddress-box">
                              <div class="fullAddress-box-icon">
                                <i class="icon font_family icon-huodongdizhi24"></i>
                              </div>
                              <div class="fullAddress-box-text">{{ item.fullAddress }}</div>
                            </div>
                          </div>
                          <div class="item-content-spaceAround">
                            <div class="spaceAround-box">
                              <div class="spaceAround-box-item">
                                <div class="spaceAround-box-item-main">
                                  <div class="spaceAround-box-item-main-icon">
                                    <i class="icon font_family icon-lishiguanzhu24"></i>
                                  </div>
                                  <div class="spaceAround-box-item-main-text">{{ formattedNumber(item.like) }}</div>
                                </div>
                              </div>
                              <div class="spaceAround-box-item">
                                <div class="spaceAround-box-item-main">
                                  <div class="spaceAround-box-item-main-icon">
                                    <i class="icon font_family icon-yanjingguankan20"></i>
                                  </div>
                                  <div class="spaceAround-box-item-main-text">{{ formattedNumber(item.views) }}</div>
                                </div>
                              </div>
                              <div class="spaceAround-box-item">
                                <div class="spaceAround-box-item-main">
                                  <div class="spaceAround-box-item-main-icon">
                                    <i class="icon font_family icon-liuyan20"></i>
                                  </div>
                                  <div class="spaceAround-box-item-main-text">{{ formattedNumber(item.comm) }}</div>
                                </div>
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
  import { ref, onMounted } from 'vue';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import { handleImageError } from '@/utils/index';
  import TreeSelect from '@/components/TreeSelect/index.vue';

  import evt01 from '@/assets/images/useless/evt01.png';
  import evt02 from '@/assets/images/useless/evt02.png';
  import evt03 from '@/assets/images/useless/evt03.png';
  import evt04 from '@/assets/images/useless/evt04.png';
  import evt05 from '@/assets/images/useless/evt05.png';
  import evt07 from '@/assets/images/useless/evt07.png';
  import evt08 from '@/assets/images/useless/evt08.png';
  import evt09 from '@/assets/images/useless/evt09.png';
  import evt10 from '@/assets/images/useless/evt10.png';
  import evt12 from '@/assets/images/useless/evt12.png';
  import evt13 from '@/assets/images/useless/evt13.png';


  const taskData = ref({
    taskStatus: '',
    screenData: '',
    concern: 2837,
    ongoing: 245,
    completed: 45,
  });

  const hasMore = ref(true);
  const activitiesList = ref([
    {
      id: 'a0001',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 0,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt01
    },
    {
      id: 'a0002',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 1,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt02
    },
    {
      id: 'a0003',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 0,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt07
    },
    {
      id: 'a0004',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 1,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt12
    },
    {
      id: 'a0005',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 1,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt13
    },
    {
      id: 'a0006',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 1,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt10
    },
    {
      id: 'a0007',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 1,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt07
    },
    {
      id: 'a0008',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 1,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt08
    },
    {
      id: 'a0009',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 1,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt09
    },
    {
      id: 'a0010',
      name: '咖啡好友聚会感受温馨与美好',
      ticketAmount: 50,
      initiator: '莫妮卡',
      isOnline: 1,
      participant: [
        { uuid: 'u0001', name: '莫妮卡', avatar: evt02 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt03 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt04 },
        { uuid: 'u0001', name: '莫妮卡', avatar: evt05 },
      ],
      fullAddress: '深圳市福田区皇岗路5001号 深业上城3期L3-308',
      like: 28932,
      views: 252634,
      comm: 4224,
      cover: evt10
    },
  ]);

  const fetchNews = async (page: number) => {
      let getData = {
        page: page,
        pageSize: 16
      }
      console.log(getData);
      console.log('activitiesList.value', activitiesList.value);
      // return new Promise<void>((resolve, reject) => {
      //   smsSendCode(getData).then((response: any) => {
      //       const { code, data, message } = response;
      //       
      //       if (code !== 200) {
      //           console.error(message);
      //           return;
      //       }
      //       if(data.missionDTOS.length == 0) {
                //   hasMore.value = false;
                //   return false;
                // } else {
                //   return data.missionDTOS;
                // }
      //       resolve()
      //   }).catch((error: any) => {
      //       reject(error)
      //   })
      // })
      return activitiesList.value
  };

  const typeList = [
    { value: '1', label: '关注', icon: 'icon-guanzhu20' },
    { value: '2', label: '进行中', icon: 'icon-shaloushijian20'},
    { value: '3', label: '已完成', icon: 'icon-gouxuanyuanxingbiankuang24' }
  ]

  const taskStatus = [
    { value: '1', label: '所有任务' },
    { value: '2', label: '关注的活动' },
    { value: '3', label: '参与的活动' },
  ];
  const screenData = [
    { value: '1', label: '链上' },
    { value: '2', label: '链下' },
  ];

  const formattedNumber = (nums: number) => {
    let formattedValue = 0;
    if (typeof nums === 'string') {
      nums = Number(nums);
    }
    if (nums >= 100000) {
      formattedValue = nums / 10000;
      return Math.floor(formattedValue) + 'W';
    } else if (nums >= 10000) {
      formattedValue = nums / 1000;
      return Math.floor(formattedValue) + 'K';
    } else {
      formattedValue = nums;
      return formattedValue;
    }
  }

  onMounted(() => {
    
  });
</script>

<style lang='scss' scoped>
  .activitiesList{
    padding-left: 20px;
    height: calc(100% - 11px);
    .activitiesList-main{
      width: 100%;
      height: calc(100% - 114px);
      .activitiesList-header{
        width: 100%;
        height: auto;
        margin-top: 30px;
        .activitiesList-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .activitiesList-header-flex-l{
            height: auto;
            flex-shrink: 0;
            padding-left: 52px;
            .activitiesList-header-flex-l-main{
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
          .activitiesList-header-flex-c{
            flex-grow: 1;
          }
          .activitiesList-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .activitiesList-header-flex-r-main{
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
      .activitiesList-content{
        width: 100%;
        height: calc(100% - 25px);
        .activitiesList-content-main{
          width: 100%;
          height: 100%;
          :deep(.el-scrollbar__view){
            padding-top: 52px;
          }
          .list-item {
            width: 270px;
            height: 360px;
            overflow: hidden;
            border-radius: 24px;
            &:hover{
              .item-content-info{
                height: auto !important;
              }
            }
            .list-item-main{
              width: 100%;
              height: 100%;
              position: relative;
              .list-item-main-img{
                width: 100%;
                height: 100%;
                img{
                  height: 100%;
                }
              }
              .activities-ntf{
                width: 24px;
                height: auto;
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1;
                i{
                  font-size: 24px;
                  color: #FFFFFF;
                  display: block;
                  line-height: 24px;
                  text-align: center;
                }
              }
              .list-item-main-content{
                padding: 20px;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                border-radius: 8px 8px 24px 24px;
                background: rgba(255, 255, 255, .02);
                backdrop-filter: blur(64px);
                .item-content-info{
                  width: 100%;
                  height: 55px;
                  transition: height 4s cubic-bezier(0.645, 0.045, 0.355, 1);
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
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .item-content-flex{
                    width: 100%;
                    height: auto;
                    margin-top: 15px;
                    .item-content-participant{
                      width: 100%;
                      height: auto;
                      display: flex;
                      justify-content: space-between;
                      .item-content-participant-num{
                        width: auto;
                        font-size: 14px;
                        color: rgb(255, 255, 255, .7);
                        line-height: 34px;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        em{
                          font-size: 14px;
                        }
                      }
                      .item-content-participant-user{
                        width: auto;
                        display: flex;
                        .user-list{
                          width: 34px;
                          height: 34px;
                          margin-left: -7px;
                          img{
                            width: 34px;
                            height: 34px;
                            border-radius: 50%;
                          }
                        }
                      }
                    }
                  }
                  .item-content-initiator{
                    width: 100%;
                    margin-top: 10px;
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 1;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                  }
                  .item-content-fullAddress{
                    border-radius: 8px;
                    margin-top: 10px;
                    padding: 13px 18px 13px 20px;
                    border: 1px solid rgba(255, 255, 255, .38);
                    .item-content-fullAddress-box{
                      width: 100%;
                      height: auto;
                      display: flex;
                      .fullAddress-box-icon{
                        width: 24px;
                        height: auto;
                        flex-shrink: 0;
                        margin-right: 7px;
                        i{
                          font-size: 24px;
                          color: #FFFFFF;
                          display: block;
                          line-height: 24px;
                          text-align: center;
                        }
                      }
                      .fullAddress-box-text{
                        flex: 1;
                        font-size: 12px;
                        color: #FFFFFF;
                        line-height: 18px;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                      }
                    }
                  }
                  .item-content-spaceAround{
                    width: 100%;
                    height: auto;
                    margin-top: 20px;
                    .spaceAround-box{
                      width: 100%;
                      height: auto;
                      display: flex;
                      justify-content: space-between;
                      .spaceAround-box-item{
                        display: inline-block;
                        .spaceAround-box-item-main{
                          width: 100%;
                          height: auto;
                          display: flex;
                          .spaceAround-box-item-main-icon{
                            widows: 24px;
                            height: auto;
                            flex-shrink: 0;
                            margin-right: 8px;
                            i{
                              font-size: 24px;
                              color: #FFFFFF;
                              display: block;
                              line-height: 24px;
                              text-align: center;
                            }
                          }
                          .spaceAround-box-item-main-text{
                            flex: 1;
                            font-size: 14px;
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
                }
              }
            }
          }
        }
      }
    }
  }
</style>
