<template>
    <div class="file-upload">
      <div class="tabs">
        <div 
          v-for="(tab, index) in tabs" 
          :key="tab" 
          :class="['tab', { active: activeTab === tab.label, first: index === 0, last: index === tabs.length - 1 }]" 
          @click="findActiveTab(tab.label)"
        >
          <div class="tab-item">
            <div class="tab-item-main">
              <div class="tab-item-main-icon">
                <i class="icon font_family" :class="tab.icon"></i>
              </div>
              <div class="tab-item-main-label">{{ tab.label }}</div>
            </div>
          </div>
          <div v-if="activeTab === tab" class="s-curve left"></div>
          <div v-if="activeTab === tab" class="s-curve right"></div>
        </div>
      </div>
      <div class="content">
        <div v-if="activeTab === '视频类'" class="tab-content">
          <div class="tab-content-main">
            <div class="title-of-work">
              <div class="title-of-work-main">
                <div class="title-of-work-main-ab" @click="findDisabled" v-if="isDisabled">
                  <div class="title-of-work-main-icon">
                    <i class="icon font_family icon-bianjigerenziliao24"></i>
                  </div>
                  <div class="title-of-work-main-label">
                    点击这里输入作品标题
                  </div>
                </div>
                <div class="title-of-work-main-input">
                  <input type="text" ref="videoTitle" :disabled="isDisabled" v-model="title" />
                </div>
              </div>
            </div>
            <div class="parting-line"></div>
            <div class="work-file">
              <div class="upload-area">
                <FileUpload upload-type="video" :on-upload-success="handleUploadSuccess" />
                <!-- <div v-if="uploadedUrls.length > 0">
                  <h3>已上传文件的URL列表：</h3>
                  <ul>
                    <li v-for="(url, index) in uploadedUrls" :key="index">{{ url }}</li>
                  </ul>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === '图片类'" class="tab-content">
          <div class="tab-content-main">
            <div class="title-of-work">
              <div class="title-of-work-main">
                <div class="title-of-work-main-ab" @click="findDisabled" v-if="isDisabled">
                  <div class="title-of-work-main-icon">
                    <i class="icon font_family icon-bianjigerenziliao24"></i>
                  </div>
                  <div class="title-of-work-main-label">
                    点击这里输入作品标题
                  </div>
                </div>
                <div class="title-of-work-main-input">
                  <input type="text" ref="videoTitle" :disabled="isDisabled" v-model="title" />
                </div>
              </div>
            </div>
            <div class="parting-line"></div>
            <div class="work-file">
              <div class="upload-area">
                <FileUpload upload-type="image" :on-upload-success="handleUploadSuccess" />
                <!-- <div v-if="uploadedUrls.length > 0">
                  <h3>已上传文件的URL列表：</h3>
                  <ul>
                    <li v-for="(url, index) in uploadedUrls" :key="index">{{ url }}</li>
                  </ul>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === '语音类'" class="tab-content">
          <div class="tab-content-main">
            <div class="title-of-work">
              <div class="title-of-work-main">
                <div class="title-of-work-main-ab" @click="findDisabled" v-if="isDisabled">
                  <div class="title-of-work-main-icon">
                    <i class="icon font_family icon-bianjigerenziliao24"></i>
                  </div>
                  <div class="title-of-work-main-label">
                    点击这里输入作品标题
                  </div>
                </div>
                <div class="title-of-work-main-input">
                  <input type="text" ref="videoTitle" :disabled="isDisabled" v-model="title" />
                </div>
              </div>
            </div>
            <div class="parting-line"></div>
            <div class="work-file">
              <div class="upload-area">
                <FileUpload upload-type="audio" :on-upload-success="handleUploadSuccess" />
                <!-- <div v-if="uploadedUrls.length > 0">
                  <h3>已上传文件的URL列表：</h3>
                  <ul>
                    <li v-for="(url, index) in uploadedUrls" :key="index">{{ url }}</li>
                  </ul>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === '文字类'" class="tab-content">
          <div class="tab-content-main">
            <div class="tab-content-main-txt">
              <div class="work-txt-name">
                <div class="title-of-work-txt-name">
                  <input type="text" placeholder="输入作品标题" v-model="title" />
                </div>
                <div class="title-of-work-txt-content">
                  <textarea placeholder="输入文章的摘要内容" v-model="content" maxlength="500"></textarea>
                </div>
              </div>
              <div class="work-file-content">
                <div class="work-file-content-main">
                  <div class="work-file-content-main-list">
                    <div 
                      class="file-list-item"
                      v-for="(item, index) in uploadedUrls"
                      :key="index"
                    >
                      <div class="file-list-item-mian">
                        <div class="file-icon">
                          <i class="icon font_family icon-a-PDFtubiao34"></i>
                        </div>
                        <div class="file-name">
                          {{ item }}
                        </div>
                        <div class="file-delete">
                          <i class="icon font_family icon-shanchulajitong24"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="work-file-content-main-upload">
                    <div class="upload-text">
                      <TextUpload
                        upload-type="txt" 
                        :on-upload-success="handleUploadSuccess"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, PropType, nextTick } from 'vue';
  import FileUpload from '@/components/upload/FileUpload.vue';
  import TextUpload from '@/components/upload/acceptUpload.vue';

  export default defineComponent({
    name: 'FileUpload',
    components: {
      FileUpload,
      TextUpload
    },
    props: {
      tabs: {
        type: Array as PropType<string[]>,
        default: () => [
          {
            value: 1,
            label: '视频类',
            icon: 'icon-shangchuanshipin24'
          }, {
            value: 2,
            label: '图片类',
            icon: 'icon-shangchuantupian24'
          }, {
            value: 3,
            label: '语音类',
            icon: 'icon-shangchuanyuyin24'
          }, {
            value: 4,
            label: '文字类',
            icon: 'icon-tianjiawenzi24'
          }
        ]
      },
      
    },
    setup(props, { emit }) {
      const activeTab = ref(props.tabs[0].label);
      const title = ref<string>('');
      const content = ref<string>('');

      // 输入标题
      const isDisabled = ref(true);
      const videoTitle = ref<HTMLInputElement | null>(null);
      const findDisabled = () => {
        isDisabled.value = false;
        nextTick(() => {
          if (videoTitle.value) {
            videoTitle.value.focus();
          }
        });
      };

      // tab 切换
      const findActiveTab = (tab: string) => {
        activeTab.value = tab;
        
      };

      // 获取上传文件
      const uploadedUrls = ref<string[]>([]);
      const handleUploadSuccess = (urls: string[]) => {
        console.log('上传的文件', urls);
        uploadedUrls.value = urls;
        const fileData = {
          title: title.value,
          content: content.value,
          fileType: activeTab.value,
          file: urls
        };
        emit('file-upload', fileData);
      };
      
      const handleFileUpload = (event: Event, fileType: string) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
          const file = uploadedUrls.value;
          const fileData = {
            title: title.value,
            fileType,
            file
          };
          console.log('选项卡子组件的数据', fileData);
          
        }
      };
  
      return {
        activeTab,
        title,
        content,
        isDisabled,
        videoTitle,
        uploadedUrls,
        findDisabled,
        findActiveTab,
        handleFileUpload,
        handleUploadSuccess
      };
    }
  });
  </script>
  
  <style scoped lang="scss">
  .file-upload {
    width: 100%;
    min-height: 350px;
    border-radius: 24px;
    color: white;
    .tabs {
      width: 100%;
      height: 49px;
      display: flex;
      justify-content: space-around;
      background-color: rgba(0, 0, 0, 0.02);
      overflow: hidden;
      position: relative;
      .tab {
        flex: 1;
        padding: 15px 0;
        text-align: center;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.2);
        transition: background-color 0.3s, color 0.3s;
        position: relative;
        z-index: 1;
        font-weight: 400;
        font-size: 18px;
        color: #FFFFFF;
        text-align: left;
        font-style: normal;
        text-transform: none;
        .tab-item{
          width: 100%;
          height: auto;
          border-right: 1px solid rgba(255, 255, 255, 0.38);
          .tab-item-main{
            width: 100%;
            display: flex;
            justify-content: center;
            .tab-item-main-icon{
              width: 24px;
              flex-shrink: 0;
              margin-right: 10px;
              & i{
                font-size: 24px;
                color: #FFFFFF;
                line-height: 18px;
              }
            }
            .tab-item-main-label{
              font-size: 18px;
              color: #FFFFFF;
              text-align: center;
              line-height: 18px;
              display: inline-block;
            }
          }
        }
        .s-curve {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 20px;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: -1;
        }
        .left {
          left: -20px;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }
        .right {
          right: -20px;
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
        }
      }
      .active {
        box-shadow: 12px 0px 52px 0px #000004;
        background: rgba(0, 0, 0, 0);
        color: white;
        z-index: 2;
      }
    }
    
    .content {
      width: calc(100% - 80px);
      height: calc(100% - 113px);
      padding: 32px 40px;
      border-radius: 10px;
      .tab-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .tab-content-main{
          width: 100%;
          height: 100%;
          .title-of-work{
            width: 100%;
            height: 110px;
            .title-of-work-main{
              width: 100%;
              height: 100%;
              position: relative;
              padding-top: 19px;
              .title-of-work-main-ab{
                position: absolute;
                top: 29px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                justify-content: center;
                cursor: pointer;
                .title-of-work-main-icon{
                  width: 24px;
                  height: auto;
                  margin-right: 10px;
                  i{
                    font-size: 24px;
                    color: #FFFFFF;
                    line-height: 24px;
                    display: inline-block;
                  }
                }
                .title-of-work-main-label{
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 24px;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                }
              }
              .title-of-work-main-input{
                width: 100%;
                height: auto;
                input{
                  width: 100%;
                  height: 40px;
                  border: none;
                  background-color: transparent;
                }
              }
            }
          }
          .parting-line{
            height: 1px;
            padding: 0 40px;
            background-color: rgba(255, 255, 255, 0.38);
          }
          .work-file{
            width: 100%;
            height: calc(100% - 111px);
            .upload-area {
              width: 100%;
              height: 100%;
            }
          }
          .tab-content-main-txt{
            width: 100%;
            height: auto;
            .work-txt-name{
              width: 100%;
              height: auto;
              .title-of-work-txt-name{
                width: 100%;
                height: 40px;
                input{
                  width: 100%;
                  height: 100%;
                  border: none;
                  line-height: 40px;
                  font-size: 16px;
                  color: #FFFFFF;
                  line-height: 56px;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                  background-color: transparent;
                  &::placeholder {
                    color: rgb(255, 255, 255, 0.68);
                  }
                }
              }
              .title-of-work-txt-content{
                width: 100%;
                height: 146px;
                textarea{
                  width: 100%;
                  height: 100%;
                  background: transparent;
                  font-weight: 400;
                  font-size: 14px;
                  color: #FFFFFF;
                  line-height: 1.6;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                  border: none;
                  resize: none;
                  letter-spacing: 1px;
                  padding-right: 8px;
                  &::placeholder {
                    color: rgb(255, 255, 255, 0.68);
                    font-size: 16px;
                  }
                  &:focus-visible{
                    outline: none;
                  }
                  @supports (-moz-appearance: none) {
                      scrollbar-width: thin;

                      ::-moz-scrollbar-track {
                          background-color: rgba(225,225,225,0);  /* 轨道颜色 */
                          border-radius: 2px;
                      }

                      ::-moz-scrollbar-thumb {
                          background-color: rgba(225,225,225,0.2);  /* 滑块颜色 */
                          border-radius: 2px;
                          width: 4px;
                      }

                      ::-moz-scrollbar-thumb:hover {
                      background-color: rgba(225,225,225,0.2);  /* 悬停时滑块颜色 */
                      }
                  }
                  /* 通用滚动条样式 */
                  &::-webkit-scrollbar { /* 整个滚动条 */
                    width: 4px; /* 滚动条宽度 */
                  }
                  &::-webkit-scrollbar-track { /* 滚动条轨道 */
                    background: rgba(225,225,225,0); 
                  }
                  &::-webkit-scrollbar-thumb { /* 滚动条滑块 */
                    background: rgba(225,225,225,0.2); 
                    border-radius: 2px;
                  }
                  &::-webkit-scrollbar-thumb:hover { /* 鼠标悬停时滚动条滑块样式 */
                    background: rgba(225,225,225,0.2); 
                  }
                }
              }
            }
            .work-file-content{
              width: 100%;
              height: auto;
              margin-top: 20px;
              .work-file-content-main{
                width: 100%;
                height: 100%;
                display: flex;
                .work-file-content-main-list{
                  flex: 1;
                  .file-list-item{
                    height: auto;
                    border-radius: 24px;
                    margin-bottom: 10px;
                    display: inline-block;
                    background-color: rgba(255, 255, 255, 0.2);
                    .file-list-item-mian{
                      width: calc(100% - 28px);
                      height: 30px;
                      display: flex;
                      justify-content: center;
                      padding: 9px 14px;
                      .file-icon{
                        width: 24px;
                        flex-shrink: 0;
                        i{
                          font-size: 24px;
                          color: #FFFFFF;
                          line-height: 30px;
                          display: inline-block;
                        }
                      }
                      .file-name{
                        font-size: 14px;
                        color: #FFFFFF;
                        line-height: 30px;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        margin: 0 10px;
                      }
                      .file-delete{
                        width: 24px;
                        flex-shrink: 0;
                        i{
                          font-size: 24px;
                          color: #FFFFFF;
                          line-height: 30px;
                          display: inline-block;
                        }
                      }
                    }
                  }
                }
                .work-file-content-main-upload{
                  width: 136px;
                  flex-shrink: 0;
                  margin-left: 20px;
                  .upload-text {
                    width: 110px;
                    height: 48px;
                    padding: 0 20px;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.38);
                  }
                }
              }
            }
          }
          
        }
        input[type="text"] {
          padding: 10px;
          margin-bottom: 20px;
          width: calc(100% - 20px);
          border-radius: 5px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
          &::placeholder {
            color: rgb(255, 255, 255, 0.68);
          }
        }
      }
    }
  }
  :deep(.el-upload-list__item:hover){
      background-color: rgba(255, 255, 255, 0.08);
  }
  :deep(.el-upload-list__item-name){
      color: rgba(255, 255, 255, 0.5);
      &:hover{
          color: rgba(255, 255, 255, 0.8) !important;
      }
  }
  
  
  </style>
  