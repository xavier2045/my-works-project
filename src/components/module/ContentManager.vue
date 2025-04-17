<template>
  <div class="introduce-container">
    <div class="introduce-head">
      <div class="introduce-head-main">
        <div class="introduce-head-main-left">
          <div class="introduce-head-main-left-flex">
            <div class="introduce-head-main-left-icon">
              <i class="icon font_family icon-jieshao24"></i>
            </div>
            <div class="introduce-head-main-left-name">
              {{name}}
              <i 
                class="icon font_family icon-wenhaoyuanquan20 cursorPointer"
                @click.stop="findIsShowFun"
              ></i>
            </div>
          </div>
          <div class="module-content" v-if="isShow">
            <div class="module-content-text">
              上传您的创作过程，以证明该作品为您原创或二创；您可选择仅上传部分片段，亦足以证明作品归属。
            </div>
            <div class="module-content-close relievoShadow" @click="hideIsShowFun">
              <i class="icon font_family icon-guanbi24"></i>
            </div>
          </div>
        </div>
        <div class="introduce-head-main-right">
          <div class="introduce-head-main-right-flex">
            <!-- <div class="item-list" v-for="(item, index) in typeList" :key="index" @click="addContent(item.typeName)">
              <div class="item-list-icon">
                <i class="icon font_family" :class="item.icon"></i>
              </div>
              <div class="item-list-name">{{ item.name }}</div>
            </div> -->
            <div class="item-list" @click="addImageContent">
              <div class="item-list-info">
                <div class="item-list-icon">
                  <i class="icon font_family icon-shangchuantupian24"></i>
                </div>
                <div class="item-list-name">图片</div>
              </div>
            </div>
            <div class="item-list" @click="addTextContent">
              <div class="item-list-info">
                <div class="item-list-icon">
                  <i class="icon font_family icon-tianjiawenzi24"></i>
                </div>
                <div class="item-list-name">文字</div>
              </div>
            </div>
            <div class="item-list" @click="addVideoContent">
              <div class="item-list-info">
                <div class="item-list-icon">
                  <i class="icon font_family icon-shangchuanshipin24"></i>
                </div>
                <div class="item-list-name">视频</div>
              </div>
            </div>
            <div class="item-list" @click="addAudioContent">
              <div class="item-list-info">
                <div class="item-list-icon">
                  <i class="icon font_family icon-shangchuanyuyin24"></i>
                </div>
                <div class="item-list-name">语音</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="introduce-content">
      
      <template v-if="contents.length === 0">
        <div class="interoduce-content-empty">
          <p>点击 图片/文字/视频/语音类型 上传内容</p>
          <span>为了您任务效果展示更佳，建议最小宽度为 800 像素。每个文件最大10MB（视频为 20MB）</span>
        </div>
      </template>
      <template v-else>
        <UploadManager
          v-for="(content, index) in contents"
          :key="index"
          v-model="contents[index]"
          :type="content.type"
          :isIndex = index
          :auto-upload="content.type !== 'text'"
          @remove="removeContent(index)"
          :isprevious = isprevious
        ></UploadManager>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch, onMounted } from 'vue';
import UploadManager from './UploadManager.vue';
import { getItem } from '@/utils/index';

export default defineComponent({
  name: 'ContentManager',
  components: {
    UploadManager,
  },
  props: {
    modelValue: {
      type: Array as PropType<{ type: string; data: any }[]>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isprevious: {
      type: Number,
      required: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isShow = ref(false);
    const contents = ref();
    const isprevious = ref(props.isprevious);
    const parseData = (contents: Array<any>) => {
      return contents.map(content => {
        if (['image', 'audio', 'video'].includes(content.type) && typeof content.data === 'string') {
          // 判断是否为多个URL拼接的字符串
          if (content.data.includes(',')) {
            content.data = content.data.split(',').map(url => url.trim());
          } else {
            content.data = [content.data];
          }
        }
        return content;
      });
    };


    contents.value = parseData(props.modelValue);
    // 介绍 	介绍类型：类型：1文本 2图片 3语音 4视频
    const addTextContent = () => {
      contents.value.push({ type: 'text', data: '' });
    };

    const addImageContent = () => {
      contents.value.push({ type: 'image', data: null });
    };

    const addVideoContent = () => {
      contents.value.push({ type: 'video', data: null });
    };

    const addAudioContent = () => {
      contents.value.push({ type: 'audio', data: null });
    };

    const removeContent = (index: number) => {
      contents.value.splice(index, 1);
      console.log('删除后的数据', contents.value);
    };

    const findIsShowFun = () => {
      isShow.value = !isShow.value;
    };
    const hideIsShowFun = () => {
      isShow.value = false;
    };

    watch(contents, (newContents) => {
      console.log( 'contents 变化了', newContents)
      emit('update:modelValue', newContents);
    }, { deep: true });

    watch(() => props.modelValue, (newVal, oldVal) => {
      console.log('modelValue 变化了', newVal, oldVal);
      contents.value = newVal;
    });

    watch(() => props.isprevious, (newVal, oldVal) => {
      
      isprevious.value = newVal;
    });
    
    // 介绍类型：类型：1文本 2图片 3语音 4视频
    const findAnalyzeFun = (contents: Array<any>) => {
      let attr: any = [];
      contents.forEach(v => {
        let types = '';
        if(v.type !== '') {
          if(v.type === '1') { types = 'text' }
          if(v.type === '2') { types = 'image' }
          if(v.type === '3') { types = 'audio' }
          if(v.type === '4') { types = 'video' }
          attr.push({
            type: types,
            content: v.content
          })
        }
      });
      return attr;
    };

    // 判断是否为空对象
    const isEmptyObject = (obj: Record<string, any>): boolean => {
      return Object.keys(obj).length === 0;
    }

    onMounted(() => {
      if(props.name == '任务介绍'){
        if(!isEmptyObject(getItem('postATask') || {})) {
          if(getItem('postATask').description.length > 0) {
            contents.value = parseData(findAnalyzeFun(getItem('postATask').description));
          }
        }
      }
      if(props.name == '活动介绍'){
        if(!isEmptyObject(getItem('releaseActivity') || {})) {
          if(getItem('releaseActivity').description.length > 0) {
            contents.value = parseData(findAnalyzeFun(getItem('releaseActivity').description));
          }
        }
      }
      if(props.name == '作品创作过程'){
        console.log("getItem('work')", getItem('work'));
        if(!isEmptyObject(getItem('work') || {})) {
          if(getItem('work').description.length > 0) {
            contents.value = parseData(findAnalyzeFun(getItem('work').description));
          }
        }
      }
      if (contents.value.length === 0) {
        addTextContent();
      }
    });

    return {
      isShow,
      contents,
      isprevious,
      addTextContent,
      addImageContent,
      addVideoContent,
      addAudioContent,
      removeContent,
      isEmptyObject,
      findIsShowFun,
      hideIsShowFun,
      parseData
    };
  },
});
</script>

<style scoped lang="scss">
  .introduce-container {
    width: 100%;
    height: auto;
    .introduce-head{
      width: 100%;
      height: 62px;
      margin-bottom: 10px;
      background-color: rgba(0, 0, 0, 0.06);      
      .introduce-head-main{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .introduce-head-main-left{
          width: 200px;
          height: 62px;
          position: relative;
          .introduce-head-main-left-flex{
            width: 100%;
            height: 62px;
            display: flex;
            .introduce-head-main-left-icon{
              width: 96px;
              background: url(@/assets/images/publish/fb-title-bg.png) no-repeat center center;
              background-size: 100% 100%;
              i{
                font-size: 24px;
                color: rgba(225,225,225,0.7);
                line-height: 62px;
                display: block;
                padding-left: 20px;
                display: inline-block;
              }
            }
            .introduce-head-main-left-name{
              font-weight: 400;
              font-size: 16px;
              color: rgba(225,225,225,0.7);
              line-height: 62px;
              text-align: left;
              font-style: normal;
              text-transform: none;
              margin-left: -20px;
            }
          }
          .module-content{
            width: 346px;
            height: 35px;
            border-radius: 12px;
            padding: 12px 15px;
            position: absolute;
            top: 3px;
            right: -350px;
            z-index: 999;
            display: flex;
            background: rgba(72, 71, 65, 1);
            box-shadow: 12px 0px 52px 0px #000004;
            &::before{
              content: '';
              position: absolute;
              left: -9px;
              top: 50%;
              transform: translateY(-50%);
              width: 0;
              height: 0;
              border-top: 8px solid transparent;
              border-bottom: 8px solid transparent;
              border-right: 10px solid rgba(72, 71, 65, 1);
            }
            .module-content-text{
              flex: 1;
              width: 0;
              font-weight: 400;
              font-size: 12px;
              color: #FFFFFF;
              line-height: 1.5;
              text-align: left;
            }
            .module-content-close{
              width: 24px;
              height: 24px;
              cursor: pointer;
              border-radius: 50%;
              margin: 5px 0 5px 20px;
              i{
                font-size: 18px;
                color: rgba(225, 225, 225, 0.7);
                text-align: center;
                line-height: 24px;
                display: block;
              }
            }
          }
        }
        .introduce-head-main-right{
          width: 416px;
          flex-shrink:0;
          .introduce-head-main-right-flex{
            width: 100%;
            display: flex;
            .item-list{
              width: 112px;
              height: 56px;
              // border-radius: 17px;
              cursor: pointer;
              position: relative;
              // background-color: rgba(0, 0, 0, .35);
              background: url(@/assets/images/publish/introduce_but_bg.png) no-repeat center center;
              background-size: 100% 100%;
              &:hover {
                background: url(@/assets/images/publish/introduce_but_bg_hover.png) no-repeat center center;
                background-size: 100% 100%;
              }
              .item-list-info{
                width: calc(100% - 20px);
                height: calc(100% - 20px);
                display: flex;
                padding: 10px;
                justify-content: center;
                .item-list-icon{
                  width: 24px;
                  margin-right: 5px;
                  i{
                    font-size: 24px;
                    color: #FFFFFF;
                    line-height: 39px;
                    display: block;
                  }
                }
                .item-list-name{
                  font-weight: 400;
                  font-size: 14px;
                  color: #FFFFFF;
                  line-height: 39px;
                  text-align: left;
                  font-style: normal;
                  text-transform: none;
                }
              }
              .item-list-upload{
                width: 100%;
                height: 100%;
                opacity: 0;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
              }
            }
          }
        }
      }
    }
    .introduce-content{
      width: 100%;
      min-height: 100px;
      margin-bottom: 50px;
      .interoduce-content-empty{
        width: 100%;
        height: auto;
        padding-top: 50px;
        p{
          font-weight: 400;
          font-size: 16px;
          color:rgba(225, 225, 225, 0.7);
          line-height: 1;
          text-align: center;
        }
        span{
          font-weight: 400;
          font-size: 14px;
          color:rgba(225, 225, 225, 0.38);
          line-height: 1;
          text-align: center;
          margin-top: 10px;
          display: block;
        }
      }
    }
  }
.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.buttons button {
  padding: 10px 20px;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.buttons button:hover {
  background-color: #3f51b5;
}

.content-area {
  border: 2px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  min-height: 200px;
  margin-bottom: 20px;
}

.content-area > * {
  margin-bottom: 20px;
}
</style>
