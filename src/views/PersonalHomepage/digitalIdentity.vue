<template>
  <div class="taskList">
    <persHeader />
    <div class="taskList-container">
      <!-- <div class="taskList-header">
        <div class="taskList-header-flex">
          <div class="taskList-header-flex-l">
            <div class="taskList-header-flex-l-main">
              <div
                class="flex-l-main-typeList"
              >
                <div class="flex-l-main-typeList-item">
                  <div class="flex-l-main-typeList-item-icon">
                    <i class="icon font_family icon-lianshangjilu24"></i>
                  </div>
                  <div class="flex-l-main-typeList-item-text">
                    <template v-if="userInfo.id !== userId">他的</template>
                    <template v-else>我的</template>数字身份
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="taskList-header-flex-c"></div>
          <div class="taskList-header-flex-r">
          </div>
        </div>
      </div> -->
      <div class="add-ntf-but relievoShadow" @click="findShowAiPopupModal">
        <div class="add-ntf-but-icon">
          <i class="icon font_family icon-lianshangjilu24"></i>
        </div>
        <div class="add-ntf-but-text">兑换数字身份</div>
      </div>
      <div class="taskList-content" data-aos="fade-up">
        <div class="taskList-content-main">
          <infinite-scroll-list
            :fetchFunction="fetchNews"
            :hasMore="hasMore"
            :filterCriteria="currentFilterCriteria"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="21" :cols="3">
                <div 
                  v-for="(item, index) in items" 
                  :key="item.missionId" 
                  class="list-item fade-up-item"
                >
                  <div class="list-item-main">
                    <div class="list-item-main-img-wrap">
                      <div class="list-item-main-img-wrap-main">
                        <div class="list-item-main-img-wrap-img">
                          <img :src="item.cover" alt="" />
                        </div>
                      </div>
                    </div>
                    <div class="list-item-main-info">
                      <div class="list-item-main-info-main">
                        <div class="list-item-main-info-title multi-line-2">{{ item.name }}</div>
                        <div class="list-item-main-info-item multi-line-1"><span>任务名称</span>{{ item.name }}</div>
                        <div class="list-item-main-info-user">
                          <div class="user-avatar">
                            <el-image
                                :src="item.userAvatar"
                                fit="cover"
                                >
                                <template #error>
                                  <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                </template>
                            </el-image>
                          </div>
                          <div class="user-info">
                            <div class="user-info-name multi-line-1">{{ item.username }}</div>
                            <div class="user-info-id multi-line-1">账号ID：{{ item.userUuid }}</div>
                          </div>
                          <div class="unfold-but" @click="toggleDropdown(index)">
                            <!-- <i class="expand-icon" :class="`icon font_family ${cascaderIcon}`"></i> -->
                            <i class="expand-icon" :class="`icon font_family ${cascaderIcons[index] || 'icon-a-jiantouxiangshangshousuo24'}`"></i>
                          </div>
                        </div>
                        <div class="unfold-content" :class="{'active': isOpen === index }">
                          <div class="unfold-content-main">
                            <div class="uft-item">
                              <div class="uft-item-main">
                                <div class="uft-item-main-l">交易地址：</div>
                                <div class="uft-item-main-c multi-line-1">{{ item.txHash }}</div>
                                <div class="uft-item-main-r">
                                  <i class="icon font_family icon-lianjie24"></i>
                                </div>
                              </div>
                            </div>
                            <div class="uft-item">
                              <div class="uft-item-main">
                                <div class="uft-item-main-l">token_id：</div>
                                <div class="uft-item-main-c multi-line-1">{{ item.txHash }}</div>
                                <div class="uft-item-main-r">
                                  <i class="icon font_family icon-lianjie24"></i>
                                </div>
                              </div>
                            </div>
                            <div class="uft-item">
                              <div class="uft-item-main">
                                <div class="uft-item-main-l">区块链：</div>
                                <div class="uft-item-main-c multi-line-1">{{ item.chainName }}</div>
                                <div class="uft-item-main-r">
                                </div>
                              </div>
                            </div>
                            <div class="uft-item">
                              <div class="uft-item-main">
                                <div class="uft-item-main-l">token标准：</div>
                                <div class="uft-item-main-c multi-line-1">{{ item.tokenstandard }}</div>
                                <div class="uft-item-main-r">
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
    <div class="popupModal" v-if="isNftKey" @click="isNftKey = false">
      <div class="masking"></div>
      <div class="popupModal-center" @click.stop>
          <div class="popupModal-main" style="width: 360px;">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">兑换数字身份</div>
              <div class="popupModal-main-tips">数字身份兑换成功后，您的秘钥将自动失效</div>
              <div class="popupModal-main-key" style="width: 100%;">
                <div class="popupModal-main-key-main relievoShadow">
                  <input type="text" v-model="nftKey" placeholder="请输入您的秘钥" />
                </div>
              </div>
              <div class="popupModal-main-but-group">
                <!-- <div class="popupModal-main-but close_relievoShadow" @click="isNftKey = false">取消</div> -->
                <div class="popupModal-main-but relievoShadow" @click="submitNftKeyFun">立即兑换</div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, reactive, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { nftList } from '@/api/user';
  import { nftReceiveValidate } from '@/api/common';
  // import TreeSelect from '@/components/TreeSelect/index.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  // import signet from '@/assets/images/common/signet.png';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  // import debounce from 'src/utils/useDebounce';
  import { initAOS } from '@/animations/aos';

  const userId = ref(''); // 查看他人的用户id
  const router = useRouter();
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  const hasMore = ref(true);
  const isOpen = ref<number | null>(null);
  const cascaderIcon = ref<string>('icon-a-jiantouxiangshangshousuo24');
  const isNftKey = ref(false);
  const nftKey = ref('');
  const refreshKey = ref(0)

  // 如果没有他人id，则取登录人id
  if(userInfo.othersId !== '') {
      userId.value = userInfo.othersId;
  } else {
      userId.value = userInfo.id;
  }
  const currentFilterCriteria = ref({
    refreshKey: refreshKey.value
  });

  const fetchNews = async (page: number) => {
    let getData = {
      pageNum: page,
      pageSize: 16,
      seeUserId: userId.value,
      businessType: 3
    }
    console.log(getData);
    try {
      const response = await nftList(getData);
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

  
  // 定义 cascaderIcons 类型为 Record<string, string>
  const cascaderIcons = reactive<Record<string, string>>({});
  const toggleDropdown = (index: number) => {
    if (isOpen.value === index) {
      isOpen.value = null;
      cascaderIcons[index.toString()] = 'icon-a-jiantouxiangshangshousuo24';
    } else {
      isOpen.value = index;
      cascaderIcons[index.toString()] = 'icon-a-jiantouxiangxiazhankai24';
    }
  };

  // 兑换数字身份
  const findShowAiPopupModal = () => {
    isNftKey.value = true;
    nftKey.value = '';
  };

  // 提交数字身份兑换
  const submitNftKeyFun = () => {
    const resData = {
      key: nftKey.value
    }
    return new Promise<void>((resolve, reject) => {
      nftReceiveValidate(resData).then((response: any) => {
        const { code, data, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        showPopup('兑换成功', 'success', 3000);
        isNftKey.value = false;
        currentFilterCriteria.value.refreshKey++
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };
  
  onMounted(() => {
    initAOS();
  });
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/popupModal.scss';
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
      .add-ntf-but{
        width: 150px;
        height: 38px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        cursor: pointer;
        .add-ntf-but-icon{
          width: 24px;
          height: 100%;
          margin-right: 10px;
          i{
            font-size: 24px;
            color: rgb(255, 255, 255, .7);
            text-align: center;
            line-height: 38px;
          }
        }
        .add-ntf-but-text{
          font-size: 16px;
          text-align: left;
          line-height: 38px;
          color: rgb(255, 255, 255, .7);
        }
      }
      .taskList-content{
        width: 100%;
        height: calc(100% - 50px);
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
            &:hover {
              transform: translate(1px, -1px);
              background: rgba(255, 255, 255, .19);
            }
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
  .popupModal-main-title{
    width: 80% !important;
    margin: 30px auto 10px auto !important;
  }
  .popupModal-main-tips{
    width: 80% !important;
    margin: 0 auto 10px auto !important;
  }
  .popupModal-main-key{
    width: 80% !important;
    margin: 0 auto !important;
    .popupModal-main-key-main{
      width: 100%;
      height: auto;
      border-radius: 8px;
      input{
        width: 100%;
        height: 40px;
        font-size: 14px;
        border-color: transparent;
        color: rgba(255, 255, 255, .8);
        background-color: transparent;
      }
    }
  }
</style>
