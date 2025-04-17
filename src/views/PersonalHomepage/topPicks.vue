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
              <wc-waterfall :gap="16" :cols="6">
                <div 
                  v-for="(item, index) in items" 
                  :key="item.missionId" 
                  class="list-item fade-up-item"
                >
                  <div class="foliow-li">
                    <!-- type: 1任务 2作品 3活动 -->
                    <div class="follow-dome-item" v-if="item.type === 1">
                        <div class="follow-dome-item-main">
                            <div class="follow-item-main-content">
                                <div class="follow-item-name">
                                    {{ item.name }}
                                </div>
                                <div class="follow-item-title">
                                    {{ item.description }}
                                </div>
                                <div class="follow-item-video">
                                    <div class="follow-item-pic">
                                        <img :src="item.cover" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="follow-dome-item" v-if="item.type === 2">
                        <div class="follow-dome-item-main">
                            <div class="follow-item-main-content">
                                <div class="follow-item-name">
                                    {{ item.name }}
                                </div>
                                <div class="follow-item-picture">
                                    <div class="follow-item-picture-pic">
                                        <img :src="item.cover" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="follow-dome-item" v-if="item.type === 3">
                        <div class="follow-dome-item-main">
                            <div class="follow-item-main-content">
                                <div class="follow-item-name">
                                    {{ item.name }}
                                </div>
                                <div class="follow-item-content">
                                    {{ item.description }}
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
  import { useRouter } from 'vue-router';
  import { nftList } from '@/api/user';
  import TreeSelect from '@/components/TreeSelect/index.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import signet from '@/assets/images/common/signet.png';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  const userId = ref(''); // 查看他人的用户id
  const router = useRouter();
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  const hasMore = ref(true);
  const isOpen = ref(null);
  const dropdownOpen = ref(false);
  const isDropdownOpen= ref(false);
  const cascaderIcon = ref('icon-a-jiantouxiangxiazhankai24');

  // 如果没有他人id，则取登录人id
  if(userInfo.othersId !== '') {
      userId.value = userInfo.othersId;
  } else {
      userId.value = userInfo.id;
  }

  const nftData = ref([
    {
      "tokenId": 4,
      "cover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/01/09/1736415833861-2.jpeg",
      "daoName": "测试的批里DA0名称日",
      "name": "批里子任务名称",
      "username": "user8604",
      "userUuid": "1834776894168502272",
      "userAvatar": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png",
      "txHash": "0x3c6eec164c12d515054ac80d8464737de828065f8b03b89f542e3f2b7eaac8b5",
      "chainName": "FISCO",
      "tokenstandard": "ERC721"
    },
    {
      "tokenId": 4,
      "cover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/01/09/1736415833861-2.jpeg",
      "daoName": "测试的批里DA0名称日",
      "name": "批里子任务名称",
      "username": "user8604",
      "userUuid": "1834776894168502272",
      "userAvatar": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png",
      "txHash": "0x3c6eec164c12d515054ac80d8464737de828065f8b03b89f542e3f2b7eaac8b5",
      "chainName": "FISCO",
      "tokenstandard": "ERC721"
    },{
      "tokenId": 4,
      "cover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/01/09/1736415833861-2.jpeg",
      "daoName": "测试的批里DA0名称日",
      "name": "批里子任务名称",
      "username": "user8604",
      "userUuid": "1834776894168502272",
      "userAvatar": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png",
      "txHash": "0x3c6eec164c12d515054ac80d8464737de828065f8b03b89f542e3f2b7eaac8b5",
      "chainName": "FISCO",
      "tokenstandard": "ERC721"
    },{
      "tokenId": 4,
      "cover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/01/09/1736415833861-2.jpeg",
      "daoName": "测试的批里DA0名称日",
      "name": "批里子任务名称",
      "username": "user8604",
      "userUuid": "1834776894168502272",
      "userAvatar": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png",
      "txHash": "0x3c6eec164c12d515054ac80d8464737de828065f8b03b89f542e3f2b7eaac8b5",
      "chainName": "FISCO",
      "tokenstandard": "ERC721"
    },{
      "tokenId": 4,
      "cover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/01/09/1736415833861-2.jpeg",
      "daoName": "测试的批里DA0名称日",
      "name": "批里子任务名称",
      "username": "user8604",
      "userUuid": "1834776894168502272",
      "userAvatar": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png",
      "txHash": "0x3c6eec164c12d515054ac80d8464737de828065f8b03b89f542e3f2b7eaac8b5",
      "chainName": "FISCO",
      "tokenstandard": "ERC721"
    },{
      "tokenId": 4,
      "cover": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/01/09/1736415833861-2.jpeg",
      "daoName": "测试的批里DA0名称日",
      "name": "批里子任务名称",
      "username": "user8604",
      "userUuid": "1834776894168502272",
      "userAvatar": "https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/2024/11/06/1730885043324-inExecution.png",
      "txHash": "0x3c6eec164c12d515054ac80d8464737de828065f8b03b89f542e3f2b7eaac8b5",
      "chainName": "FISCO",
      "tokenstandard": "ERC721"
    },
  ])

  const fetchNews = async (page: number) => {
    return nftData.value;
    // let getData = {
    //   pageNum: page,
    //   pageSize: 16,
    //   seeUserId: userId.value
    // }
    // console.log(getData);
    // try {
    //   const response = await nftList(getData);
    //   const { code, data, message } = response;

    //   if (code !== 200) {
    //     showPopup(message, 'error', 3000);
    //     return null;
    //   }
    //   if(data.rows.length == 0) {
    //     hasMore.value = false;
    //     return false;
    //   } else {
    //     
    //     return data.rows;
    //   }
    // } catch (error) {
    //   console.error('Error fetching news:', error);
    //   return [];
    // }
  };

  const toggleDropdown = (index: number) => {
    
    isDropdownOpen.value = !isDropdownOpen.value;
    dropdownOpen.value = !dropdownOpen.value;
    if (dropdownOpen.value) {
      isOpen.value = null;
      cascaderIcon.value = 'icon-a-jiantouxiangshangshousuo24';
    } else {
      isOpen.value = index;
      cascaderIcon.value = 'icon-a-jiantouxiangxiazhankai24';
    }
  };
  
  onMounted(() => {
    
  });
</script>

<style lang='scss' scoped>
  .taskList{
    padding-left: 42px;
    height: calc(100% - 11px);
    .taskList-container{
      width: 100%;
      height: calc(100% - 114px);
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
          width: 100%;
          height: 100%;
          :deep(.el-scrollbar__view){
            padding-top: 0;
          }
          .list-item{
            width: 316px;
            height: auto;
            border-radius: 12px;
            overflow: hidden;
            break-inside: avoid;
            margin-bottom: 21px;
            cursor: pointer;
            background: rgba(255, 255, 255, .16);
            backdrop-filter: blur(30px);
            box-shadow: 0px 0px 8px 9px rgb(0, 0, 0, .15);
            border: 1px solid rgba(255, 255, 255, .38);
            .list-item-main{
              width: 100%;
              height: 100%;
              position: relative;
              .list-item-main-img-wrap{
                width: 100%;
                height: auto;
                .list-item-main-img-wrap-main{
                  width: 100%;
                  height: auto;
                  padding-bottom: 16px;
                  .list-item-main-img-wrap-img{
                    width: 100%;
                    height: 135px;
                    flex-shrink: 0;
                    border-radius: 12px 12px 0 0;
                    margin-right: 19px;
                    overflow: hidden;
                    img{
                      width: 100%;
                      height: 100%;
                      display: block;
                    }
                  }
                }
              }
              .list-item-main-info{
                width: 100%;
                height: auto;
                position: relative;
                .list-item-main-info-main{
                  width: calc(100% - 32px);
                  height: auto;
                  padding: 0 16px 0 16px;
                  .list-item-main-info-title{
                    width: 100%;
                    font-weight: 400;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 1.5;
                    text-align: left;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  .list-item-main-info-item{
                    width: 100%;
                    height: auto;
                    font-weight: 400;
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 1;
                    text-align: left;
                    padding-top: 6px;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    span{
                      width: 70px;
                      display: inline-block;
                      font-weight: 400;
                      font-size: 14px;
                      color: rgba(255, 255, 255, .68);
                      line-height: 1;
                      text-align: left;
                    }
                  }
                  .list-item-main-info-user{
                    width: 100%;
                    height: auto;
                    display: flex;
                    margin-top: 10px;
                    .user-avatar{
                      width: 38px;
                      height: 38px;
                      flex-shrink: 0;
                      margin-right: 5px;
                      :deep(.el-image, img) {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        display: block;
                      }
                    }
                    .user-info{
                      flex-grow: 1;
                      .user-info-name{
                        width: 100%;
                        height: auto;
                        font-weight: 400;
                        font-size: 14px;
                        color: rgba(255, 255, 255, .68);
                        line-height: 20px;
                        text-align: left;
                      }
                      .user-info-id{
                        width: 100%;
                        height: auto;
                        font-weight: 400;
                        font-size: 12px;
                        color: rgba(255, 255, 255, .68);
                        line-height: 20px;
                        text-align: left;
                      }
                    }
                    .unfold-but{
                      width: 35px;
                      height: 35px;
                      flex-shrink: 0;
                      margin-left: 5px;
                      background: url(@/assets/images/task/back_bg.png) no-repeat center center;
                      background-size: 100% 100%;
                      &:hover{
                          background: url(@/assets/images/task/back_bg_hover.png) no-repeat center center;
                          background-size: 100% 100%;
                      }
                      i {
                          font-size: 18px;
                          color: #FFFFFF;
                          line-height: 35px;
                          display: block;
                          text-align: center;
                        }
                    }
                  }
                  .unfold-content{
                    width: 100%;
                    height: auto;
                    max-height: 0;
                    padding-top: 20px;
                    transition: max-height 0.5s ease-out;
                    .unfold-content-main{
                      width: 100%;
                      height: auto;
                      border-radius: 8px;
                      margin-bottom: 16px;
                      background-color: rgba(255, 255, 255, .18);
                      .uft-item{
                        width: 100%;
                        height: auto;
                        border-bottom: 1px solid rgba(255, 255, 255, .08);
                        &:last-child{
                          border-bottom: none;
                        }
                        .uft-item-main{
                          width: calc(100% - 20px);
                          height: auto;
                          display: flex;
                          line-height: 40px;
                          text-align: left;
                          padding: 0 10px;
                          .uft-item-main-l{
                            width: 120px;
                            height: auto;
                            font-weight: 400;
                            font-size: 12px;
                            color: rgba(255, 255, 255, .68);
                          }
                          .uft-item-main-c{
                            flex-grow: 1;
                            font-weight: 400;
                            font-size: 12px;
                            color: rgba(255, 255, 255, .8);
                          }
                          .uft-item-main-r{
                            width: 35px;
                            height: 40px;
                            font-size: 14px;
                            color: rgba(255, 255, 255, .8);
                          }
                        }
                      }
                    }
                  }
                  .active{
                    max-height: 500px;
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
