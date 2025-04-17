<template>
    <div class="ae-tab-panel">
      <div class="ae-tabs">
        <div
          v-for="(item, index) in tabData"
          :key="index"
          :class="['tab-item', { active: activeTab === index }]"
          @click="activeTab = index"
        >
          <div class="tab-content">
            <div class="tab-content-main">
              <div class="tab-content-main-title">
                <i :class="['icon font_family', item.icon]"></i>
                <span>{{ item.name }}</span>
              </div>
              <div class="tab-content-main-arge multi-line-2">{{ item.tips }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content"> 
        <div class="content-main overflowYAuto">
          <div class="shadow">
            <template v-if="activeTab == 0">
              <img class="shadow-t" src="@/assets/images/task/tab_t_c_bg.png" />
            </template>
            <template v-if="activeTab == 1">
              <img class="shadow-c" src="@/assets/images/task/tab_c_c_bg.png" />
            </template>
            <template v-if="activeTab == 2">
              <img class="shadow-b" src="@/assets/images/task/tab_b_c_bg.png" />
            </template>
          </div>
          <div v-if="tabData && tabData[activeTab] && !Array.isArray(tabData[activeTab].content)">
            <p>{{ tabData[activeTab].content }}</p>
          </div>
          <div v-else-if="tabData && tabData[activeTab] && Array.isArray(tabData[activeTab].content)">
            <div v-for="(introduction, introIndex) in tabData[activeTab].content" :key="introIndex">
              <div v-if="introduction.type === 1">
                <p>{{ introduction.content }}</p>
              </div>
              <div class="mat-20" v-if="introduction.type === 2">
                <div class="image-gallery">
                  <img
                    v-for="(image, imageIndex) in stringToArray(introduction.content)"
                    :key="imageIndex"
                    :src="image"
                    :class="['gallery-image', { active: currentImageIndex === imageIndex }]"
                    @click="openImageModal(image, imageIndex, introduction.content)"
                  />
                </div>
              </div>
              
              <div class="mat-20" v-if="introduction.type === 4">
                <video controls>
                  <source :src="introduction.content" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
          <div v-else>
            <p>数据加载中...</p>
          </div>
        </div>
      </div>
      <div class="popupModal" v-if="currentImage" @click="handleClickOutside">
        <div class="masking"></div>
        <div class="popupModal-center" @click.stop>
          <div class="popupModal-main">
              <div class="popupModal-module"></div>
              <div class="popupModal-main-content">
                <div class="popupModal-main-content-img">
                  <img :src="currentImage" alt="modal image" class="modal-image" />
                  <div class="but-prev" @click="prevImage">上一张</div>
                  <div class="but-next" @click="nextImage">下一张</div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  
  export default defineComponent({
    name: 'TabPanel',
    props: {
      tabData: {
        type: Array,
        required: true
      }
    },
    setup(props) {
      const activeTab = ref(0);
      const currentImageIndex = ref(0);
      const currentImage = ref('');
      const imageList = ref([]); // 图片列表

      console.log('props.tabData', props.tabData);

      const stringToArray = (str) => {
        return str.split(",");
      }
  
      const openImageModal = (url: string, index: number, list: string) => {
        currentImage.value = url;
        currentImageIndex.value = index;
        imageList.value = stringToArray(list);
      };

      const handleClickOutside = (event: any) => {
        // 检查点击的目标是否在弹框内部
        const popupModalCenter = event.target.closest('.popupModal-center');
        if (!popupModalCenter) {
          currentImage.value = '';
        }
      };
    
      // 图片切换上一张
      const prevImage = () => {
        if (currentImageIndex.value > 0) {
          currentImageIndex.value--;
          currentImage.value = imageList.value[currentImageIndex.value];
        }
      };
      
      // 图片切换下一张
      const nextImage = () => {
        if (currentImageIndex.value < imageList.value.length - 1) {
          currentImageIndex.value++;
          currentImage.value = imageList.value[currentImageIndex.value];
        }
      };

      watch(() => props.tabData, (newValue) => {
        console.log('newValue', newValue);
      });
  
      return {
        activeTab,
        currentImage,
        currentImageIndex,
        openImageModal,
        prevImage,
        nextImage,
        stringToArray,
        handleClickOutside
      };
    }
  });
  </script>
  
  <style lang="scss" scoped>
    @use '@/assets/styles/popupModal.scss';
    :root {
        --common-bg-color: rgba(0, 0, 0, .05);
    }
    .ae-tab-panel {
      width: 100%;
      height: 443px;
      display: flex;
      justify-content: space-between;
      .ae-tabs {
        width: 358px;
        height: 100%;
        flex-shrink: 0;
        .tab-item {
          width: 358px;
          height: 173px;
          display: flex;
          margin-top: -20px;
          align-items: center;
          cursor: pointer;
          background: url(@/assets/images/task/tab_bg.png) no-repeat center center;
          background-size: 100% 100%;
          &:first-child{
            margin-top: -16px;
          }
          &:hover{
            background: url(@/assets/images/task/tab_bg_hover.png) no-repeat center center;
            background-size: 100% 100%;
            .tab-content{
              border: 1px solid rgba(255, 255, 255, .38);
            }
          }
          .tab-content{
            width: 311px;
            height: 138px;
            margin: 19px 29px 19px 20px;
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, .18);
            background-color: var(--common-bg-color);
            backdrop-filter: blur(24px);
            .tab-content-main{
              width: calc(100% - 60px);
              height: calc(100% - 52px);
              padding: 26px 30px;
              .tab-content-main-title{
                width: 100%;
                height: auto;
                display: flex;
                justify-content: flex-start;
                i{
                  font-size: 24px;
                  color: #FFFFFF;
                  margin-right: 10px;
                  line-height: 24px;
                }
                span{
                  font-weight: 400;
                  font-size: 18px;
                  color: #FFFFFF;
                  line-height: 24px;
                  text-align: left;
                }
              }
              .tab-content-main-arge{
                width: 100%;
                height: auto;
                font-weight: 400;
                font-size: 14px;
                color: #FFFFFF;
                line-height: 22px;
                text-align: left;
                margin-top: 20px;
              }
            }
            .icon {
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
          }
        }
        .active {
          background: url(@/assets/images/task/tab_bg_hover.png) no-repeat center center;
          background-size: 100% 100%;
          .tab-content{
            border: 1px solid rgba(255, 255, 255, .38);
          }
        }
        
      }
      .content {
        flex: 1;
        overflow: hidden;
        padding: 40px;
        border-radius: 28px;
        background-color: var(--common-bg-color);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, .38);
        position: relative;
          .shadow{
            .shadow-t{
              width: 146px;
              height: auto;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
            }
            .shadow-c{
              width: 146px;
              height: auto;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
            }
            .shadow-b{
              width: 146px;
              height: auto;
              position: absolute;
              left: 0;
              bottom: 0;
              z-index: -1;
            }
          }
        .content-main{
          width: 100%;
          height: 100%;
          p{
            font-weight: 400;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 32px;
            text-align: left;
            word-break: break-all;
          }
          .image-gallery {
            display: flex;
            flex-wrap: wrap;
            .gallery-image{
              width: 143px;
              height: 143px;
              cursor: pointer;
              box-shadow: 6px 0px 10px 0px rgba(0, 0, 0, 0.25);
              border-radius: 24px 24px 24px 24px;
              opacity: 0.9;
              margin: 0 2% 20px 0;
            }
            .active {
              box-shadow: 6px 0px 10px 0px rgba(0, 0, 0, 0.25);
            }
          }
        }
      }
    }
    .popupModal-center{
      width: 80% !important;
      height: 80% !important;
      .popupModal-main{
        width: 100% !important;
        height: 100% !important;
        padding-bottom: 0 !important;
        .popupModal-main-content{
          width: calc(100% - 40px) !important;
          height: calc(100% - 40px) !important;
          padding: 20px;
          position: relative;
          &:hover{
            .but-prev, .but-next{
              display: block;
            }
          }
          .popupModal-main-content-img{
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 24px;
            img{
              width: auto;
              height: 100%;
              display: block;
              margin: 0 auto;
              border-radius: 24px;
              transition: transform 0.5s ease;
            }
          }
          .but-prev{
            width: 40px;
            height: 200px;
            color: #FFFFFF;
            line-height: 200px;
            cursor: pointer;
            display: none;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background: radial-gradient(circle at center, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
          }
          .but-next{
            width: 40px;
            height: 200px;
            color: #FFFFFF;
            line-height: 200px;
            cursor: pointer;
            display: none;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: radial-gradient(circle at center, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
          }
        }
      }
    }
</style>