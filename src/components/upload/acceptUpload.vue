<template>
  <div class="upload-wrapper">
      <div class="upload-content">
        <el-upload
          class="upload-demo"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :file-list="fileList"
          :show-file-list="true"
          drag
          :limit="5"
          :accept="acceptType"
          list-type="text"
          :http-request="uploadFile"
        >
          <div class="upload-style">
            <div class="upload-style-icon">
                <i class="icon font_family icon-shangchuanwenjian24"></i>
            </div>
            <div class="upload-style-text">上传文件</div>
          </div>
        </el-upload>
      </div>
    
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref,  } from 'vue';
  import { useUploadStore } from '@/stores/uploadStore';
  import { FILENAMELENGTH } from '@/utils/common';
  import { showPopup } from '@/utils/usePopup';
export default defineComponent({
  name: 'AcceptUpload',
  components: {
  },
  props: {
    uploadType: {
        type: String,
        required: true
    },
    onUploadSuccess: {
        type: Function as PropType<(urls: string[]) => void>,
        required: true
    }
  },
  setup(props) {
    const fileList = ref([]); // 上传文件列表
    const uploading = ref(false); // 是否正在上传
    const uploadProgress = ref(0);  // 上传进度
    const uploadStore = useUploadStore();


    // 动态设置 accept 类型
    const acceptType = computed(() => {
      if (props.uploadType === 'image') {
          return 'image/*';
      } else if (props.uploadType === 'video') {
          return 'video/*';
      } else if (props.uploadType === 'audio') {
          return 'audio/*';
      } else if (props.uploadType === 'txt') {
          return '.pdf,.doc,.docx,.xls,.xlsx,.txt';
      }
    });

    //  自定义上传函数，阻止默认请求
    const uploadFile = () => {
      // 不执行任何操作
    };

    const beforeUpload = (file: File) => {
      return new Promise((resolve, reject) => {
        let isValid = true;
        let errorMessage = '';
        // 检查文件大小
          const maxSize = props.uploadType === 'image' ? 6* 1024 * 1024 : (props.uploadType === 'video' ? 1024 * 1024 * 1024 : 1024 * 1024 * 1024);
        if (file.size > maxSize) {
          isValid = false;
          errorMessage = props.uploadType === 'image' ? '图片大小不能超过6M' : (props.uploadType === 'video' ? '视频大小不能超过1G' : '文件大小不能超过1G');
        }

        const nameSize = file.name.length;
        if(nameSize > FILENAMELENGTH) {
          showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
          return false;
        }

        if (isValid) {
          uploadStore.addMainFile(file);
          // 生成符合 el-upload 要求的文件列表项
          const fileItem = {
              uid: Date.now(), // 为每个文件生成唯一 ID
              name: file.name,
              status: 'success', // 文件状态
              url: URL.createObjectURL(file), // 生成预览 URL
              raw: file, // 保留原始文件对象
          };
          fileList.value.push(fileItem);
          console.log('fileList.value', fileList.value);
          let uploadedUrls = fileList.value.map((item) => item.name);
          console.log('uploadedUrls',uploadedUrls)
          props.onUploadSuccess(uploadedUrls);
          resolve(true); // 文件处理成功
        } else {
        reject(false);
        }
      });
    };

    const handleRemove = (file: File, fileList: File[]) => {
      const index = fileList.indexOf(file);
      uploadStore.removeMainFile(index);
    };

    return {
      fileList,
      uploading,
      acceptType,
      uploadProgress,
      handleRemove,
      beforeUpload,
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
                width: 100%;
                height: 100%;
                display: flex;
                .upload-style-icon{
                    width: 24px;
                    display: block;
                    margin-right: 10px;
                    i{
                        font-size: 24px;
                        color: #FFFFFF;
                        display: block;
                        line-height: 48px;
                    }
                }
                .upload-style-text{
                  font-weight: 400;
                  font-size: 16px;    
                  color: rgb(255, 255, 255, .7);
                  line-height: 48px;
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
