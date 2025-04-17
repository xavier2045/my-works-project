<template>
  <div class="taskList">
    <persHeader />
    <div class="taskList-container">
      <div class="taskList-header">
        <div class="taskList-header-flex">
          <div class="taskList-header-flex-l">
            <div class="input">
              <button 
                v-for="(type, index) in typeList"
                :key="index"
                @click="findTypeFun(type)"
                class="value"
                :class="{ 'active': type.value === isType}"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  width="15" 
                  height="15"
                >
                  <path 
                    :d="getSvgPath(type.icon)" 
                    fill="#7D8590"
                  ></path>
                </svg>
                {{ type.label }} {{ type.value === 1 ? taskData.videoNum || 0 : 
                  type.value === 2 ? taskData.pictureNum || 0 : 
                  type.value === 3 ? taskData.audioNum || 0 : 
                  type.value === 4 ? taskData.docNum || 0 : 
                  taskData.followNum || 0 }}
              </button>
            </div>
          </div>
          <div class="taskList-header-flex-c"></div>
          <div class="taskList-header-flex-r">
            <TreeSelect
              :options="taskStatus"
              v-model="taskData.taskStatus"
              placeholder="我发布的"
              @selected="onSelected"
              class="header-tree-select"
            />
          </div>
        </div>
      </div>
      <div class="taskList-content" data-aos="fade-up">
        <div class="taskList-content-main">
          <infinite-scroll-list
            :fetchFunction="fetchNews"
            :hasMore="hasMore"
            :filterCriteria="currentFilterCriteria"
            class="infinite-scroll"
          >
            <template #item="{ items }">
              <wc-waterfall :gap="20" :cols="5">
                <div 
                  v-for="(item, index) in items" 
                  :key="item.workId" 
                  class="list-item fade-up-item"
                  @click="toTaskDetail(item.workId, index)"
                >
                  <template v-if="hasDraft == 1">
                    <template v-if="index == 0">
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
                          <div class="activities-draft">
                            <div class="activities-draft-main">
                              <div class="activities-draft-main-icon">
                                <i class="icon font_family icon-lianjie24"></i>
                              </div>
                              <div class="activities-draft-main-text">草稿箱·{{ draftNum || 0 }}</div>
                            </div>
                          </div>
                          <div class="list-item-main-content">
                            <div class="item-content-info">
                              <div class="item-content-info-main">
                                <div class="item-content-info-main-l">
                                  <div class="info-main-l-name multi-line-1">{{ item.name }}</div>
                                  <div class="info-main-l-item">
                                    <div class="item-li">
                                      <i class="icon font_family icon-yingxiangli24"></i>
                                      <span>{{ item.seeNum || 0 }}</span>
                                    </div>
                                    <div class="item-li">
                                      <i class="icon font_family icon-guanzhu20"></i>
                                      <span>{{ item.followNum || 0 }}</span>
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
                    </template>
                    <template v-else>
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
                        <div class="activities-ntf"
                          v-if="item.nft !== ''" 
                        >
                          <i class="icon font_family icon-lianjie24"></i>
                        </div>
                        <div class="list-item-main-content">
                          <div class="item-content-info">
                            <div class="item-content-info-main">
                              <div class="item-content-info-main-l">
                                <div class="info-main-l-name multi-line-1">{{ item.name }}</div>
                                <div class="info-main-l-item">
                                  <div class="item-li">
                                    <i class="icon font_family icon-yingxiangli24"></i>
                                    <span>{{ item.seeNum || 0 }}</span>
                                  </div>
                                  <div class="item-li">
                                    <i class="icon font_family icon-guanzhu20"></i>
                                    <span>{{ item.followNum || 0 }}</span>
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
                    </template>
                  </template>
                  <template v-else>
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
                      <div class="activities-ntf"
                        v-if="item.nft !== ''" 
                      >
                        <i class="icon font_family icon-lianjie24"></i>
                      </div>
                      <div class="list-item-main-content">
                        <div class="item-content-info">
                          <div class="item-content-info-main">
                            <div class="item-content-info-main-l">
                              <div class="info-main-l-name multi-line-1">{{ item.name }}</div>
                              <div class="info-main-l-item">
                                <div class="item-li">
                                  <i class="icon font_family icon-yingxiangli24"></i>
                                  <span>{{ item.seeNum || 0 }}</span>
                                </div>
                                <div class="item-li">
                                  <i class="icon font_family icon-guanzhu20"></i>
                                  <span>{{ item.followNum || 0 }}</span>
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
                  </template>
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
  import { worksMineList, worksMineListCount } from '@/api/work';
  import TreeSelect from '@/components/TreeSelect/index.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import { setItem } from '@/utils/index';
  import { aeUseStore } from '@/stores/user';
  import { aeWorksStore } from '@/stores/works';
  import { showPopup } from '@/utils/usePopup';
  import { initAOS } from '@/animations/aos';

  const userId = ref(''); // 查看他人的用户id
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  const worksStore = aeWorksStore();
  const hasDraft = ref(0);
  const router = useRouter();

  // 如果没有他人id，则取登录人id
  if(userInfo.othersId !== '') {
      userId.value = userInfo.othersId;
  } else {
      userId.value = userInfo.id;
  }

  const taskData = ref({
    followNum: 0,
    pictureNum: 0,
    videoNum: 0,
    audioNum: 0,
    docNum: 0,
  });

  const hasMore = ref(true);

  const isfoll = ref(0); // 关注
  const draftNum = ref(0);
  const isOnChain = ref(0);
  /**
   * type	byte	选传	1 视频类 2 图片类 3 语音类 4 文档类
    isOnChain	byte	选传	是否链上 0否 1是
    isFollow	byte	选传	是否关注 0否 1是
   * **/ 
  const currentFilterCriteria = ref({
    type: '',
    dropType: 1,
    seeUserId: userId.value,
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
        type: currentFilterCriteria.value.type,
        dropType: currentFilterCriteria.value.dropType,
        seeUserId: userId.value,
      }
      console.log(getData);
      try {
        const response = await worksMineList(getData);
        const { code, data, message } = response;

        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }
        hasDraft.value = data.hasDraft;
        draftNum.value = data.draftNum;
        worksCountFun();
        if(data.workDTOS.length == 0) {
          hasMore.value = false;
          return false;
        } else {
          
          worksStore.worksInfo.params = getData;
          worksStore.worksInfo.worksIdList = data.workDTOS.map((item: { workId: any; }) => item.workId);
          return data.workDTOS;
        }
        
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
  };
  
  const isType = ref('0');
  const typeList = [
    { value: 2, label: '图文类', icon: 'icon-tupian68' },
    { value: 1, label: '视频类', icon: 'icon-shipin68'},
    { value: 3, label: '语音类', icon: 'icon-shangchuanyuyin24' },
    { value: 4, label: '文字类', icon: 'icon-tianjiawenzi24' },
  ]

  const worksCountFun = async () => {
    const resData = {
      seeUserId: userId.value,
      dropType: currentFilterCriteria.value.dropType,
    }
    return new Promise<void>((resolve, reject) => {
      worksMineListCount(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        taskData.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  const findTypeFun = async (item: any) => {
    isType.value = item.value;
    if(item.value !== 5) {
      currentFilterCriteria.value.type = item.value;
    }
  };

  const taskStatus = [
    { value: 1, label: '我发布的' },
    { value: 2, label: '我购买的' },
    { value: 3, label: '二创库' },
    { value: 4, label: '点赞过的' },
  ];
  // 获取选中的筛选条件
  const onSelected = async (option: any) => {
      console.log('option', option);
      currentFilterCriteria.value.dropType = option.value; // 更新 filterCriteria
    };

  // 获取SVG图标路径
  const getSvgPath = (iconName: string) => {
    // 根据图标名返回相应的SVG路径
    switch(iconName) {
      case 'icon-tupian68':
        return "M19.5 13.5h-15v-9h15m0-3h-15a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3zm-7.5 12v3h-9v3h18v-3h-6v-3";
      case 'icon-shipin68':
        return "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm8 9l5-3-5-3v6z";
      case 'icon-shangchuanyuyin24':
        return "M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm7 9h-2a7 7 0 0 1-6 6.92V20h3v2H8v-2h3v-2.08A7 7 0 0 1 5 15H3v-2h3V9h2v4h10V9h2v4h2v2h-3z";
      case 'icon-tianjiawenzi24':
        return "M21 7v13H5v2h16a2 2 0 0 0 2-2V7h-2zM3 2.992C3 2.444 3.445 2 3.993 2h16.014c.548 0 .993.44.993.992v16.016c0 .548-.445.992-.993.992H3.993A.993.993 0 0 1 3 19.008V2.992zM5 4v14h14V4H5zm3 4h8v2H8V8zm0 4h8v2H8v-2z";
      default:
        return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z";
    }
  };

  // 点击作品详情
  const toTaskDetail = async (workId: string, index: number) => {
    // 是否有草稿 0否 1是
    if(hasDraft.value == 1) {
      if(index !== 0) {
        openTaskDetail(workId);
      } else {
        // showPopup('跳转到草稿列表', 'error', 3000);
        router.push({ name: 'WorksDraft'});
      }
    } else {
      openTaskDetail(workId);
    }
  };

const openTaskDetail = (workId: string) => {
    let id = workId;
    userInfo.workType = 1;
    setItem('workType', 1);
    worksStore.worksInfo.currentId = workId;
    worksStore.worksInfo.isRouterType = 2;
    router.push({ name: 'WorksDetails', params: { id } });
  };

  onMounted(() => {
    initAOS();
  });
</script>

<style lang='scss' scoped>
  .taskList{
    padding-left: 20px;
    height: calc(100% - 11px);
    animation: fadeIn 0.4s ease-in-out;
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
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
            padding-left: 0px;
            .input {
              display: flex;
              flex-direction: row;
              width: auto;
              background-color: transparent;
              justify-content: flex-start;
              border-radius: 5px;
              align-items: center;
              gap: 15px;
            }

            .value {
              background-color: #161b30;
              border: none;
              padding: 10px 15px;
              color: white;
              display: flex;
              position: relative;
              gap: 10px;
              cursor: pointer;
              border-radius: 30px;
              margin: 0;
              align-items: center;
              font-weight: 500;
              font-size: 15px;
              transition: all 0.2s ease;
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
            }

            .value:not(:active):hover,
            .value:focus {
              background-color: #1e2543;
              transform: translateY(-2px);
              box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
            }

            .value:focus,
            .value:active {
              background-color: #1e2543;
              outline: none;
              transform: translateY(-1px);
            }

            .value::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
              border-radius: 30px;
              opacity: 0;
              transition: opacity 0.2s ease;
            }

            .value:focus::before,
            .value:active::before,
            .value.active::before {
              opacity: 1;
            }

            .value svg {
              width: 18px;
              margin-right: 2px;
              transition: all 0.2s ease;
            }

            .value.active {
              color: white;
              background-color: #2b3354;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
            }

            .value.active svg path {
              fill: white;
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
                height: 38px;
                padding: 0 10px;
                display: inline-block;
                border-radius: 12px;
                transition: all 0.2s ease;
                &:hover {
                  background-color: rgba(255, 255, 255, 0.1);
                }
                &:last-child{
                  margin-right: 50px;
                }
                .personal-list-sort-main{
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  .sort-select{
                    display: inline-block;
                    font-weight: 500;
                    font-size: 14px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 38px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    :deep(.cascader-input){
                      color: #FFFFFF;
                      transition: color 0.2s ease;
                      &:hover {
                        color: #3E9AFF;
                      }
                      .arrow{
                        i{
                          color: #FFFFFF;
                          transition: color 0.2s ease;
                        }
                        &:hover i {
                          color: #3E9AFF;
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
            padding-top: 52px;
          }
          .list-item{
            width: 300px;
            height: 294px;
            border-radius: 12px;
            overflow: hidden;
            break-inside: avoid;
            margin-bottom: 30px;
            cursor: pointer;
            background-color: rgba(255, 255, 255, .06);
            backdrop-filter: blur(20px);
            box-shadow: 0px 0px 8px 9px rgb(0, 0, 0, .15);
            transition: all 0.25s ease-in-out !important;
            &:hover {
              transform: translateY(-5px);
              background-color: rgba(255, 255, 255, .09);
              box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
              
              .list-item-main-content {
                height: 55px;
                background: rgba(255, 255, 255, .22);
              }
            }
            .list-item-main{
              width: 100%;
              height: 100%;
              position: relative;
              display: flex;
              flex-direction: column;
              .list-item-main-img{
                width: 100%;
                flex: 1;
                display: block;
                overflow: hidden;
                
                img, :deep(.el-image) {
                  width: 100%;
                  height: 100%;
                  display: block;
                  object-fit: cover;
                  transition: transform 0.5s ease;
                }
                
                &:hover {
                  img, :deep(.el-image) {
                    transform: scale(1.05);
                  }
                }
              }
              .activities-ntf{
                width: 28px;
                height: 28px;
                border-radius: 6px;
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1;
                background: rgba(62, 154, 255, 0.3);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                &:hover {
                  transform: scale(1.1);
                  background: rgba(62, 154, 255, 0.5);
                }
                i{
                  font-size: 12px;
                  color: #FFFFFF;
                  display: block;
                  text-align: center;
                  line-height: 28px;
                }
              }
              .activities-draft{
                width: 130px;
                height: 38px;
                border-radius: 8px;
                position: absolute;
                top: 15px;
                left: 15px;
                z-index: 1;
                background: rgba(255, 255, 255, .16);
                backdrop-filter: blur(52px);
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;
                &:hover {
                  background: rgba(255, 255, 255, .22);
                }
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
                height: 40px;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                border-radius: 0 0 12px 12px;
                padding: 12px 18px;
                background: rgba(255, 255, 255, .16);
                backdrop-filter: blur(52px);
                transition: all 0.25s ease-in-out;
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
                      padding-right: 12px;
                      .info-main-l-name{
                        width: 100%;
                        font-weight: 500;
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 20px;
                        text-align: left;
                        margin-bottom: 2px;
                        letter-spacing: 0.02em;
                        max-width: calc(100% - 5px);
                      }
                      .info-main-l-item{
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                        margin-top: 2px;
                        .item-li{
                          cursor: pointer;
                          line-height: 24px;
                          display: inline-block;
                          transition: color 0.2s ease;
                          &:hover {
                            i, span {
                              color: #FFFFFF;
                            }
                          }
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
                      width: 32px;
                      margin-left: auto;
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                      .works-type{
                        width: 32px;
                        height: 32px;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255, 255, 255, 0.15);
                        transition: all 0.2s ease;
                        &:hover {
                          background: rgba(255, 255, 255, 0.25);
                          transform: scale(1.05);
                        }
                        .works-type-icon{
                          width: 100%;
                          height: 100%;
                          i{
                            font-size: 18px;
                            color: rgb(255, 255, 255, .9);
                            text-align: center;
                            line-height: 32px;
                            margin: 0 auto;
                            display: block;
                            transition: transform 0.2s ease, color 0.2s ease;
                          }
                          
                          &:hover i {
                            transform: scale(1.1);
                            color: #3E9AFF;
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

  .fade-up-item {
    animation: fadeUp 0.5s ease-out both;
    animation-delay: calc(var(--aos-delay, 0) * 100ms);
  }
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Ensure better typography and contrast */
  .multi-line-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-tree-select {
    margin-right: 30px;
    :deep(.cascader-input) {
      padding: 8px 18px;
    }
  }
</style>
