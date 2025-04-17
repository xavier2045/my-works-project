<template>
    <div class="uploadManger">
      <div 
        class="uploadManger-content" 
        v-if="type === 'text'"
        @mouseover="showclose = 1" 
        @mouseout="showclose = null"
      >
        <TextareaWithCounter 
          v-model="content" 
          @input="updateContent" 
          :placeholder="'请输入介绍文字内容...'" 
          :maxLength="500" 
        />
        <div 
          class="close-button" 
          v-show="showclose === 1"
          @click="removeContent">
          <div class="close-button-icon">
            <i class="icon font_family icon-guanbi24"></i>
          </div>
        </div>
      </div>
      <div class="uploadManger-content" v-else>
        <el-upload
          ref="fileInput"
          class="upload-demo"
          :auto-upload="false"
          :http-request="customUpload"
          :before-upload="beforeUpload"
          :on-remove= "handleRemove"
          :on-change="handleChange"
          :file-list="fileList"
          :show-file-list="true"
          drag
          :limit="4"
          multiple
          :accept="accept"
        >
        </el-upload>
        <div class="file-List" v-if="fileUrls.length">
          <div 
            class="file-List-item"
            :class="{ 'videoType': type === 'video' }"
            v-for="(url, index) in fileUrls" 
            :key="index"
            @mouseover="showActions = index" 
            @mouseout="showActions = null"
          >
            <img v-if="type === 'image'" :src="url" alt="Uploaded Image" />
            <!-- <video v-if="type === 'video'" controls :src="url"></video> -->
            <video 
              v-if="type === 'video'"
              ref="videoRef"
              :src="url" 
              controls 
              autoplay 
              @play="true" 
              @pause="false"
            >
              Your browser does not support the video tag.
            </video>
            <audio v-if="type === 'audio'" controls :src="url"></audio>
            <div 
              class="close-button" 
              v-show="showActions === index"
              @click="removeSingleContent(index)">
              <div class="close-button-icon">
                <i class="icon font_family icon-guanbi24"></i>
              </div>
            </div>
            <div 
              class="actions" 
              v-if="fileUrls.length || type === 'text'"
              v-show="showActions === index"
            >
            <div class="actions-main">
              <div class="actions-main-button" @click="seeSingleContent(index)">查看</div>
              <div class="actions-main-button" v-if="type !== 'text'" @click="triggerSingleUpload(index)">替换</div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, ref, computed, watch, onMounted, nextTick } from 'vue';
  import { useUploadStore } from '@/stores/uploadStore';
  import { showPopup } from '@/utils/usePopup';
  import { FILENAMELENGTH } from '@/utils/common';
  import TextareaWithCounter from '@/components/TextareaWithCounter/index.vue';
  
  export default defineComponent({
    name: 'UploadManager',
    props: {
      modelValue: {
        type: Object,
        required: true,
      },
      type: {
        type: String as PropType<string>,
        required: true,
      },
      autoUpload: {
        type: Boolean,
        default: false,
      },
      isIndex: {
        type: Number,
        default: true
      },
      isprevious: {
        type: Number,
        required: false
      },
    },
    emits: ['update:modelValue', 'remove'],
    setup(props, { emit }) {
      const uploadStore = useUploadStore();
      const content = ref(props.modelValue.content);
      const fileUrls = ref<string[]>([]);
      const fileInput = ref<InstanceType<typeof ElUpload>>(null);
      const fileList = ref<File[]>([]); // 上传文件列表
      const uploading = ref(false); // 是否正在上传
      const uploadProgress = ref(0);  // 上传进度
      const textareaRef = ref<HTMLElement | null>(null);
      const showclose = ref<number | null>(null); // 用于记录当前鼠标移入文本编辑
      const showActions = ref(null); // 用于记录当前鼠标移入的项
      const replaceIndex = ref(null); // 用于记录当前替换的文件索引
      const replaceFile = ref(null);  // 用于替换的文件
      const isprevious = ref(props.isprevious);

      if(props.modelValue.type == 'text'){
        content.value = props.modelValue.content || props.modelValue.data;
      } else if(props.modelValue.type == 'image') {
        // if (props.modelValue && 'content' in props.modelValue) {
        //   fileUrls.value = props.modelValue.content.split(',');
        // }
        if (props.modelValue.data !== null) {
          if (props.modelValue.data.length > 0) {
            fileUrls.value = props.modelValue.data;
          }
        } else {
          if (props.modelValue && 'content' in props.modelValue) {
            fileUrls.value = props.modelValue.content.split(',');
          }
        }
      }

      const focusTextarea = () => {
        if (textareaRef.value) {
          textareaRef.value.focus();
        }
      };
    
      const accept = computed(() => {
        switch (props.type) {
          case 'image':
            return 'image/*';
          case 'video':
            return 'video/*';
          case 'audio':
            return 'audio/*';
          default:
            return '';
        }
      });
  
      const updateContent = () => {
        emit('update:modelValue', { type: props.type, data: content.value });
      };

      const beforeUpload = (file: File, index: number | null = null) => {
        return new Promise((resolve, reject) => {
          let isValid = true;
          let errorMessage = '';
          const maxSize = props.type === 'image' ? 6 * 1024 * 1024 : (props.type === 'video' ? 1024 * 1024 * 1024 : 1024 * 1024 * 1024);
          if (file.size > maxSize) {
            isValid = false;
            errorMessage = props.type === 'image' ? '图片大小不能超过6M' : (props.type === 'video' ? '视频大小不能超过1G' : '文件大小不能超过1G');
            clearUploadFiles();
            return false;
          }
          const nameSize = file.name.length;
          if(nameSize > FILENAMELENGTH) {
            showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
            clearUploadFiles();
            return false;
          }

          if (isValid) {
            if (replaceIndex.value !== null) {
              // 替换指定索引位置的文件
              // fileList.value[index] = file;
              // fileUrls.value[index] = URL.createObjectURL(file);
              // uploadStore.updateDetailFile(props.isIndex, index, file);
              fileList.value[replaceIndex.value] = replaceFile.value;
              fileUrls.value[replaceIndex.value] = URL.createObjectURL(replaceFile.value);
              const files = {
                id: 0,
                file: fileList.value[replaceIndex.value]
              };
              uploadStore.updateDetailFile(replaceIndex.value, files);
            } else {
              uploadStore.addDetailFile(isprevious, props.isIndex, file);
              fileUrls.value.push(URL.createObjectURL(file)); // 生成本地预览路径
              fileList.value.push(file);
            }
            handleSuccess();
            console.log('缓存的附件文件', uploadStore);
            resolve(true);
          } else {
            reject(false);
          }
        });
      };
      const handleSuccess = () => {
        emit('update:modelValue', { type: props.type, data: fileUrls.value });
      };
      const clearUploadFiles = () => {
        // 清除 el-upload 的文件列表
        fileInput.value.clearFiles();
      };
      const handleRemove = (file: File, fileList_: File[]) => {
        const index = fileList_.indexOf(file);
        uploadStore.removeDetailFile(index);
        fileUrls.value.splice(index, 1);
        fileList.value.splice(index, 1);
      };

      // 删除单个文件
      const removeSingleContent = (index: number) => {
        fileUrls.value.splice(index, 1);
        fileList.value.splice(index, 1);
        // 从 uploadStore 中移除对应的文件
        uploadStore.removeDetailFile(props.isIndex, index);
        // 确保更新父组件的数据
        emit('update:modelValue', { type: props.type, data: fileUrls.value });
        if(fileUrls.value.length == 0){
          clearUploadFiles();
          emit('remove', { index, type: props.type });
        }
        
      };
      // 替换单个文件
      const triggerSingleUpload = (index: number) => {
        replaceIndex.value = index;
        nextTick(() => {
          if (fileInput.value) {
            const inputElement = fileInput.value.$el.querySelector('input[type="file"]');
            if (inputElement) {
              inputElement.addEventListener('change', handleFileChange);
              inputElement.click();
              // 保存当前索引以便在 handleFileChange 中使用
              inputElement.dataset.index = index.toString();
            }
          }
        });
      };

      // 处理替换单个文件选择后的逻辑
      const handleFileChange = (event) => {
        const indexStr = event.target.dataset.index;
        const index = indexStr ? parseInt(indexStr, 10) : null;
        console.log('Parsed index:', index);
        const files = event.target.files;
        const selectedFile = event.target.files[0];
        replaceFile.value = selectedFile;
        if (files.length > 4) {
          showPopup('最多只能选择4个文件', 'error', 3000);
          return; // 阻止后续处理
        }
        // 检查 index 是否为 NaN
        if (isNaN(index)) {
          console.error('Invalid index:', indexStr);
          return;
        }
        if (selectedFile && index !== null) {
          beforeUpload(selectedFile, index).then(() => {
            // 文件选择成功后的操作
            console.log('文件选择成功');
          }).catch(() => {
            // 文件选择失败后的操作
            console.error('文件选择失败');
          });
        } else {
          console.error('Invalid index:', indexStr);
        }
      };

      // 查看图片
      const seeSingleContent = () => {

      };


      const triggerUpload = () => {
        nextTick(() => {
          if (fileInput.value) {
            const inputElement = fileInput.value.$el.querySelector('input[type="file"]');
            if (inputElement) {
              inputElement.click();
            }
          }
        });
      };
      const removeContent = () => {
        emit('remove');
      };

      watch(() => props.modelValue, (newVal, oldVal) => {
        if(newVal.type == 'text'){
          content.value = newVal.data;
        } else if(newVal.type == 'image') {
          fileUrls.value = Array.isArray(newVal.data) ? newVal.data : [newVal.data];
        }
      });

      watch(() => props.isprevious, (newVal, oldVal) => {
        
        isprevious.value = newVal;
      });

      watch(() => props.type, (newType) => {
        if (newType === 'text') {
          nextTick(() => {
            focusTextarea();
          });
        }
      }, { immediate: true });
      const handleChange = (file: File, fileList: File[]) => {
        // 处理文件选择事件
        beforeUpload(file.raw as File).then(() => {
          // 文件选择成功后的操作
        }).catch(() => {
          // 文件选择失败后的操作
        });
      };
      const customUpload = (options: any) => {
        // 禁用默认的上传行为
        return new Promise(() => {});
      };
  
      onMounted(() => {
        nextTick(() => {
          focusTextarea();
          if (fileInput.value) {
            const inputElement = fileInput.value.$el.querySelector('input[type="file"]');
            if (inputElement) {
              inputElement.click();
              inputElement.addEventListener('change', handleFileChange);
            }
          }
          const textarea = textareaRef.value as HTMLTextAreaElement;
          function autoResize() {
            if (textarea) {
              textarea.style.height = 'auto'; // 重置高度
              textarea.style.height = Math.min(textarea.scrollHeight, 260) + 'px'; // 设置高度为内容的高度，但不超过最大高度
            }
          }

          if (textarea) {
            textarea.addEventListener('input', autoResize);
            autoResize(); // 初始化时调用一次，确保初始高度正确
          }
        });
      });
  
      return {
        content,
        fileUrls,
        accept,
        fileList,
        uploading,
        fileInput,
        showclose,
        showActions,
        replaceIndex,
        uploadProgress,
        replaceFile,
        isprevious,
        updateContent,
        triggerUpload,
        removeContent,
        beforeUpload,
        handleRemove,
        customUpload,
        handleChange,
        removeSingleContent,
        triggerSingleUpload,
        handleFileChange,
        seeSingleContent,
        TextareaWithCounter
      };
    },
  });
  </script>
  
  <style scoped lang="scss">
  .uploadManger{
    width: 87%;
    height: auto;
    margin: 0 auto;
    .uploadManger-content{
        width: 100%;
        height: auto;
        max-height: 260px;
        position: relative;
        textarea {
            width: calc(100% - 18px);
            min-height: 62px;
            background: transparent;
            font-weight: 400;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 1.6;
            text-align: left;
            font-style: normal;
            text-transform: none;
            resize: none;
            letter-spacing: 1px;
            margin: 8px;
            padding: 8px;
            border-radius: 12px;
            border: 1px solid rgba(225, 225, 225, .38);
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
        img, video, audio {
            max-width: 100%;
            display: block;
            margin: 0 auto;
            border-radius: 12px;
        }
        .upload-demo{
          display: none;
        }
        .file-List{
          width: 100%;
          height: auto;
          display: flex;
          justify-content: center;
          padding-bottom: 30px;
          .file-List-item{
            width: 210px;
            height: 210px;
            position: relative;
            border-radius: 12px;
            margin: 0 30px 0 0;
            box-shadow: 4px 0px 28px 0px rgba(0, 0, 0, .35);
            img{
              width: 100%;
              height: 100%;
              max-width: 100%;
              display: block;
            }
          }
          .videoType{
            width: 50%;
            height: auto;
          }
        }
        .textarea-with-counter{
          width: calc(100% - 18px);
          min-height: 62px;
          background: transparent;
          font-weight: 400;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 1.6;
          text-align: left;
          font-style: normal;
          text-transform: none;
          resize: none;
          letter-spacing: 1px;
          margin: 8px;
          padding: 8px;
          border-radius: 12px;
          border: 1px solid rgba(225, 225, 225, .38);
        }
    }
    &:hover{
      .actions{
        display: block;
        transition: all 3s;
      }
    }
    .actions {
      width: 100%;
      height: 36px;
      display: inline-block;
      position: absolute;
      left: 0;
      bottom: 0px;
      display: none;
      border-radius: 0 0 12px 12px;
      background-color: rgba(0, 0, 0, .35);
      
      .actions-main{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        .actions-main-button {
          width: 50%;
          font-size: 14px;
          color: #FFFFFF;
          line-height: 36px;
          display: inline-block;
          cursor: pointer;
          text-align: center;
        }
      }
    }
    .close-button{
      width: 36px;
      height: 36px;
      display: inline-block;
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 1;
      cursor: pointer;
      border-radius: 50%;
      background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
      background-size: 100% 100%;
      .close-button-icon{
        width: 27px;
        height: 27px;
        display: block;
        border-radius: 50%;
        margin: 4px auto 0 auto;
        background-color: rgba(0, 0, 0, .5);
        i{
          font-size: 16px;
          color: #FFFFFF;
          text-align: center;
          line-height: 27px;
          display: block;
        }
      }
    }
  }
  
  </style>
  