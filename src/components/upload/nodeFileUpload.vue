<template>
    <div class="upload-wrapper">
        <div class="upload-content">
          <el-upload
            class="upload-demo"
            ref="uploadRef"
            :before-upload="beforeUpload"
            :show-file-list="false"
            drag
            :limit="1"
            :http-request="uploadFile"
          >
            <div class="upload-style-text">{{ uploadName }}</div>
          </el-upload>
        </div>
    </div>
  </template>
  
  <script lang="ts">
    import { defineComponent, PropType, ref, watch } from 'vue';
    import { useUploadStore } from '@/stores/uploadStore';  // 缓存上传封面的文件数据
    import { showPopup } from '@/utils/usePopup';
    import { FILENAMELENGTH } from '@/utils/common';
  
  export default defineComponent({
    name: 'NodeFileUpload',
    components: {
    },
    props: {
      uploadType: {
          type: String,
          required: true
      },
      index: {
          type: Number,
          required: true
      },
      uploadName: {
          type: String,
          required: true
      },
      onUploadSuccess: {
          type: Function as PropType<(index: Number, urls: string) => void>,
          required: true
      }
    },
    setup(props) {
      const uploadStore = useUploadStore();
      const uploadRef = ref(null); // 用于手动触发上传
      const fileList = ref([]); // 上传文件列表
      const uploading = ref(false); // 是否正在上传
      const uploadProgress = ref(0);  // 上传进度
      const fileUrl = ref('');
      const uploadName = ref(props.uploadName);
      const indexs = ref(props.index);

      //  自定义上传函数，阻止默认请求
      const uploadFile = () => {
        // 不执行任何操作
      };
      const beforeUpload = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {

          const nameSize = file.name.length;
          if(nameSize > FILENAMELENGTH) {
            showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
            return false;
          }
          if (file) { // 检查是否为图片文件
            let files = {
                file: file,
                isprevious: indexs.value,
            }
            uploadStore.addNodeFile(files); // 保存文件到 Pinia 状态管理
            fileUrl.value = URL.createObjectURL(file); // 生成本地预览路径
            props.onUploadSuccess(indexs.value, fileUrl.value);
            resolve(true); // 文件处理成功
          } else {
            showPopup('请选择文件', 'success', 3000);
            resolve(false); // 文件处理失败
          }
          return false; // 阻止默认上传行为
        });
      };
      const handleRemove = () => {
        uploadStore.setCoverImage(null);
        fileList.value = [];
        fileUrl.value = '';
      };

      // 处理手动上传
      const handleUpload = () => {
        if (uploadRef.value) {
          uploadRef.value.submit(); // 手动触发上传
        }
      };

      const handleError = (error: any, file: any, fileList: any) => {
      console.error('文件上传失败', error);
      };

      watch(() => props.index, (newVal, oldVal) => {
        
        indexs.value = newVal;
      });
  
      return {
        fileList,
        uploading,
        fileUrl,
        indexs,
        uploadRef,
        uploadName,
        uploadProgress,
        handleRemove,
        handleError,
        beforeUpload,
        handleUpload,
        uploadFile
      };
    },
  });
  </script>
  
  <style scoped lang="scss">
  .upload-wrapper {
    width: 100%;
    height: 100%;
    .upload-content{
        width: 100%;
        height: 100%;
        .upload-demo{
            width: 100%;
            height: 100%;
            :deep(.el-upload.is-drag){
              width: 100%;
              height: 100%;
              .el-upload-dragger{
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                border: none;
                background-color: transparent;
                .upload-style {
                  display: inline-block;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  .upload-style-text{
                    font-weight: 400;
                    font-size: 16px;    
                    color: rgb(255, 255, 255, .7);
                    line-height: 1;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;
                  }
                }
              }
            }
        }
    }
  }
  
  .upload-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 120px; /* 根据需要调整宽度 */
    height: 150px; /* 根据需要调整高度 */
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px dashed #ccc;
    border-radius: 10px;
    cursor: pointer;
  }
  
  .upload-button .iconfont {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .upload-button span {
    font-size: 14px;
    color: #666;
  }
  
  .upload-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .upload-wrapper .a-upload {
    width: 100%;
    height: 100%;
  }
  
  .upload-wrapper .a-upload > .a-upload-select {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  </style>
  