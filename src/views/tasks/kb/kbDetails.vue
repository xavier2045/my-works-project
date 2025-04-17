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
              <div class="r-mian-bg">
                <div class="r-mian-bg-main">
                  <div class="r-main-time">{{ details.uploadTime }}</div>
                  <div class="r-main-icon">
                    <i class="icon font_family icon-rili24"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="kb-content">
        <div class="kb-content-main">
          <div class="kb-content-main-title">{{ details.name }}</div>
          <div class="kb-content-main-content">
            <div class="flie-item" v-for="(item, index) in details.urls" :key="index">
              <template v-if="getFileType(item) == 'image'">
                <img :src="item" alt="" />
              </template>
              <template v-else-if="getFileType(item) == 'video'">
                <video ref="remoteVideo" autoplay controls>
                  <source :src="item" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </template>
            </div>
          </div>
          <div class="kb-content-main-desc">{{ details.description }}</div>
          <div class="kb-content-main-fileList">
            <div class="fileList-item" v-for="(item, index) in details.urls" :key="index">{{ item }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { aeUseStore } from '@/stores/user';
  import { getItem } from '@/utils/index';
  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;

  const router = useRouter();
  const remoteVideo = ref<HTMLVideoElement | null>(null);

  const details = ref({
    name: '',
    uploadTime: '',
    description: '',
    urlType: '',
    url: '',
    urls: [],
  });
  

  // 返回上一页
  const goBack = () => {
    router.go(-1);
  };
  // 定义图片和视频的后缀列表
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];
  // 函数用于获取文件扩展名
  const getFileExtension = (filename: string) => {
    const match = filename.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
  }

  const getFileType = (filename: string) => {
    const extension = getFileExtension(filename);
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    } else {
      return 'other';
    }
  };

  onMounted(() => {
    
    if(Object.keys(userInfo.knowledgeBaseData).length > 0) {
      details.value = userInfo.knowledgeBaseData;
    } else {
      details.value = getItem('knowledgeBaseData');
    }
    console.log('details.value ', details.value );

    if (remoteVideo.value) {
        remoteVideo.value.addEventListener('canplay', () => {
          remoteVideo.value.play();
        });

        remoteVideo.value.addEventListener('error', (event) => {
          console.error('Video error:', event);
        });
      }
  });
</script>

<style lang='scss' scoped>
  .kb{
    width: 100%;
    height: calc(100% - 40px);
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
              .r-mian-bg{
                width: 218px;
                height: 48px;
                mask-image: url(@/assets/images/common/icon02.png);
                -webkit-mask-image: url(@/assets/images/common/icon02.png);
                mask-repeat: no-repeat;
                -webkit-mask-repeat: no-repeat;
                mask-size: 100% 100%;
                background-color: rgb(255, 255, 255, .08);
                backdrop-filter: blur(24px);
                position: relative;
                .r-mian-bg-main{
                  height: 100%;
                  display: flex;
                  padding: 0 14px 0 26px;
                  justify-content:space-between;
                  .r-main-time{
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 48px;
                    text-align: left;
                  }
                  .r-main-icon{
                    width: 24px;
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      line-height: 48px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .kb-content{
        height: calc(100% - 25px);
        padding: 0 76px;
        overflow-y: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
        .kb-content-main{
          width: 100%;
          height: 100%;
          .kb-content-main-title{
            font-size: 20px;
            color: #FFFFFF;
            line-height: 1;
            text-align: center;
            margin: 55px 0 41px 0;
          }
          .kb-content-main-content{
            width: 100%;
            height: auto;
            .flie-item{
              width: 100%;
              height: auto;
              margin-bottom: 30px;
              &:last-child{
                margin-bottom: 0;
              }
            }
            img{
              width: 100%;
              height: auto;
              border-radius: 28px;
            }
            video{
              width: 100%;
              height: auto;
            }
          }
          .kb-content-main-desc{
            width: 779px;
            height: auto;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 1.5;
            text-align: left;
            margin: 60px auto 0 auto;
          }
          .kb-content-main-fileList{
            width: 100%;
            height: auto;
            margin-top: 38px;
            padding-bottom: 136px;
            .fileList-item{
              font-size: 16px;
              color: #FFFFFF;
              line-height: 32px;
              text-align: left;
            }
          }
        }
      }
    }
  }

</style>
