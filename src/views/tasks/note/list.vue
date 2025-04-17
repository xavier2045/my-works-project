<template>
  <div class="kb">
    <div class="kb-container">
      <div class="kb-header">
        <div class="kb-header-flex">
          <div class="kb-header-flex-l">
            <div class="kb-header-flex-l-main">
              <div class="kb-header-flex-l-main-previous">
                <div class="previous-icon" @click="goBack">
                  <i class="icon font_family icon-a-jiantouxiangzuoyue20"></i>
                </div>
                <div class="previous-name">知识库</div>
              </div>
            </div>
          </div>
          <div class="kb-header-flex-c"></div>
          <div class="kb-header-flex-r">
            <div class="kb-header-flex-r-main">
              <div class="kb-add-btn" @click="isKnowledgeBaseVisible = true">
                <div class="kb-add-btn-main">
                  <div class="kb-add-btn-text">上传知识库</div>
                  <div class="kb-add-btn-icon">
                    <i class="icon font_family icon-jiahaowubeijing20"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="kb-content">
        <div class="kb-content-main">
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
                        <div class="item-content-info-title">{{ item.name }}</div>
                        <div class="item-content-info-desc">{{ item.description }}</div>
                        <div class="item-content-info-pic">
                          <!-- ['jpg', 'jpeg', 'png', 'gif'];
                          ['mp4', 'avi', 'mov', 'mkv']; -->
                          <template v-if="item.urlType == 'img'">
                            <img :src="item.url" alt="" />
                          </template>
                          <template v-if="item.urlType == 'mp4'">
                            <video ref="remoteVideo" autoplay controls>
                              <source :src="item.url" type="video/mp4">
                              Your browser does not support the video tag.
                            </video>
                          </template>
                        </div>
                        <div class="item-content-info-bottom">
                          <div class="item-content-info-time-btn">
                            <div class="item-content-info-time">{{ item.uploadTime }}</div>
                            <div class="item-content-info-btn" @click="findRouterKbDetailsFun(item)">
                              查看详情
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
    <!-- 上传知识库 -->
    <KnowledgeBase
      v-if="isKnowledgeBaseVisible"
      type="1"
      :isVisible="isKnowledgeBaseVisible"
      :initialContent="kbContent"
      :daoId="daoId"
      :missionId="missionId"
      :maxLength="200"
      @update:content="updateKbContent"
      @close="closeKnowledgeBase"
    />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { knowledgeAdd, knowledgeList } from '@/api/dao';
  import { extractIdFromUrl, setItem } from '@/utils/index';
  import InfiniteScrollList from '@/components/InfiniteScrollList/index.vue';
  import KnowledgeBase from '@/components/popUp/knowledgeBase/index.vue';
  import { aeUseStore } from '@/stores/user';
  import { showPopup } from '@/utils/usePopup';
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  const router = useRouter();
  const daoId = ref('');
  const missionId = ref('');
  const currentUrl = window.location.href; // 获取当前页面的 URL
  let urlId = extractIdFromUrl(currentUrl)+'';  // url上的id
  const scrollListKey = ref(0); // 列表刷新key

  // 返回上一页
  const goBack = () => {
    router.go(-1);
  };


  const hasMore = ref(true);
  

  // 筛选条件
  const currentFilterCriteria = ref({
    businessType: 1,
    businessId: urlId,
  });

  // 定义图片和视频的后缀列表
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];

  // 函数用于获取文件扩展名
  const getFileExtension = (filename: string) => {
    const match = filename.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
  }

  // 查找第一个图片或视频文件
  function findFirstMediaFile(files :any) {
    let firstImage = null;
    let firstVideo = null;
    for (let file of files) {
      const extension = getFileExtension(file);
      if (imageExtensions.includes(extension)) {
        firstImage = { filename: file, type: 'img' };
        break; // 找到第一张图片后立即返回
      } else if (videoExtensions.includes(extension)) {
        firstVideo = { filename: file, type: 'mp4' };
      }
    }

    // 如果找到了图片，返回图片；否则返回视频
    return firstImage || firstVideo;
  }

  // 获取列表数据
  const fetchNews = async (page: number) => {
    let getData = {
        pageNum: page,
        pageSize: 16,
        businessType: 2,
        businessId: userInfo.id,
    }
    console.log(getData);
    try {
      const response = await knowledgeList(getData);
      const { code, data, message } = response;

      if (code !== 200) {
        showPopup(message, 'error', 3000);
        return null;
      }

      data.rows.forEach((item: any) => {
        const firstMediaFile = findFirstMediaFile(item.urls);
        if (firstMediaFile) {
          item.url= firstMediaFile.filename;
          item.urlType = firstMediaFile.type;
        } else {
          console.log('没有找到媒体文件');
        }
      });
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

  // 团队知识库
  const isKnowledgeBaseVisible = ref(false);
  const kbContent = ref<string>('');
  // 提交知识库
  const updateKbContent = (newContent: any) => {
    console.log('newContent', newContent);
    newContent.businessType = 2;
    newContent.businessId = userInfo.id;
    return new Promise<void>((resolve, reject) => {
      knowledgeAdd(newContent).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        scrollListKey.value += 1; // 刷新列表
        isKnowledgeBaseVisible.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }
  // 关闭团队知识库
  const closeKnowledgeBase = () => {
    isKnowledgeBaseVisible.value = false;
  };

  // 查看详情
  const findRouterKbDetailsFun = (item: any) => {
    userInfo.noteData = item;
    setItem('noteData', item);
    router.push({ name: 'NoteDetails'})
  }


  onMounted(() => {
    
  });
</script>

<style lang='scss' scoped>
  .kb{
    width: 100%;
    height: calc(100% - 45px);
    .kb-container{
      height: 100%;
      padding: 0 31px;
      .kb-header{
        width: 100%;
        height: auto;
        margin-top: 20px;
        .kb-header-flex{
          width: 100%;
          height: auto;
          display: flex;
          .kb-header-flex-l{
            height: auto;
            flex-shrink: 0;
            .kb-header-flex-l-main{
              width: 100%;
              height: auto;
              
              .kb-header-flex-l-main-previous{
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
                    line-height: 46px;
                    text-align: center;
                  }
                }
                .previous-name{
                  width: auto;
                  font-size: 20px;
                  color: #FFFFFF;
                  line-height: 46px;
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
          .kb-header-flex-c{
            flex-grow: 1;
          }
          .kb-header-flex-r{
            height: auto;
            flex-shrink: 0;
            .kb-header-flex-r-main{
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
              .kb-add-btn{
                width: 148px;
                height: 44px;
                cursor: pointer;
                border-radius: 23px;
                border: 1px solid rgb(255, 255, 255, .38);
                .kb-add-btn-main{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  .kb-add-btn-text{
                    font-weight: 400;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 46px;
                    margin-right: 5px;
                  }
                  .kb-add-btn-icon{
                    width: 20px;
                    height: auto;
                    i{
                      font-size: 20px;
                      color: #FFFFFF;
                      line-height: 46px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .kb-content{
        width: 100%;
        height: calc(100% - 25px);
        .kb-content-main{
          width: 100%;
          height: 100%;
          :deep(.el-scrollbar__view){
            padding-top: 52px;
          }
          .list-item{
            width: 356px;
            height: auto;
            border-radius: 36px;
            overflow: hidden;
            break-inside: avoid;
            margin-bottom: 30px;
            background-color: rgb(255, 255, 255, .06);
            backdrop-filter: blur(9px);
            border: 1px solid rgb(255, 255, 255, .38);
            .list-item-main{
              width: 100%;
              height: 100%;
              .list-item-main-content{
                padding: 39px 25px 30px 25px;
                .item-content-info{
                  width: 100%;
                  height: auto;
                  .item-content-info-title{
                    width: 100%;
                    font-size: 18px;
                    color: #FFFFFF;
                    line-height: 26px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;  
                    white-space: initial; 
                  }
                  .item-content-info-desc{
                    font-size: 14px;
                    color: rgb(255, 255, 255, .7);
                    line-height: 24px;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                    box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;  
                    white-space: initial; 
                    margin-top: 23px;
                  }
                  .item-content-info-pic{
                    width: 100%;
                    height: auto;
                    margin-top: 20px;
                    img{
                      width: 100%;
                      height: 180px;
                      border-radius: 18px;
                    }
                    video{
                      width: 100%;
                      height: 180px;
                    }
                  }
                  .item-content-info-bottom{
                    width: 100%;
                    height: auto;
                    margin-top: 20px;
                    .item-content-info-time-btn{
                      width: 100%;
                      height: auto;
                      display: flex;
                      justify-content: space-between;
                      .item-content-info-time{
                        font-size: 14px;
                        color: #FFFFFF;
                        line-height: 36px;
                        text-align: left;
                      }
                      .item-content-info-btn{
                        width: 96px;
                        height: 34px;
                        font-size: 14px;
                        cursor: pointer;
                        color: #FFFFFF;
                        line-height: 36px;
                        text-align: center;
                        border-radius: 18px;
                        border: 1px solid rgb(255, 255, 255, .38);
                        &:hover{
                          background-color: rgb(255, 255, 255, .16);
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

</style>
