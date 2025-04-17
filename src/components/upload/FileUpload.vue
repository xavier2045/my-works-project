<template>
    <!--  -->
    <el-upload
        ref="upload"
        class="upload-demo"
        :before-upload="findBeforeUpload"
        :on-remove= "handleRemove"
        :file-list="fileList"
        drag
        multiple
        :limit="5"
        :accept="acceptType"
        :show-file-list="true"
        :http-request="uploadFile"
    >
    <div class="el-upload__text">
        <template v-if="uploadType === 'image'">
            拖放图片，或  <em>浏览</em>
        </template>
        <template v-if="uploadType === 'video'">
            拖放视频，或  <em>浏览</em>
        </template>
        <template v-if="uploadType === 'audio'">
            拖放语音，或  <em>浏览</em>
        </template>
    </div>
    <template #tip>
    <div class="el-upload__tip">
        {{ uploadTip }}
    </div>
    </template>
    </el-upload>
    <el-progress v-if="uploading" :percentage="uploadProgress" />
  </template>
  
  <script lang="ts">
    import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref,  } from 'vue';
    import { useUploadStore } from '@/stores/uploadStore';
    import { FILENAMELENGTH } from '@/utils/common';
    import { showPopup } from '@/utils/usePopup';
  export default defineComponent({
    name: 'FileUpload',
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
        const uploadStore = useUploadStore();
        const uploading = ref(false); // 是否正在上传
        const uploadProgress = ref(0);  // 上传进度

        // 动态设置 accept 类型
        const acceptType = computed(() => {
            if (props.uploadType === 'image') {
                return 'image/*';
            } else if (props.uploadType === 'video') {
                return 'video/*';
            } else if (props.uploadType === 'document') {
                return '.pdf,.doc,.docx,.xls,.xlsx';
            } else if (props.uploadType === 'audio') {
                return 'audio/*';
            }
        });

  
        const uploadTip = computed(() => {
            // 根据上传类型设置提示信息
            if (props.uploadType === 'image') {
                return '只能上传jpg/png文件，且不超过500kb';
            } else if (props.uploadType === 'video') {
                return '只能上传mp4文件，且不超过10MB';
            } else if (props.uploadType === 'image') {
                return '只能上传mp4文件，且不超过10MB';
            } else if (props.uploadType === 'audio') {
                return '只能上传mp4文件，且不超过10MB';
            }
        });
       
        //  自定义上传函数，阻止默认请求
        const uploadFile = () => {
                // 不执行任何操作
        };
        const findBeforeUpload = (file: File) => {
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

            
        const handleRemove = (file: any, fileList: any) => {
            console.log('remove', file, fileList);
            const index = fileList.indexOf(file);
            uploadStore.removeMainFile(index);
        };

        onMounted(() => {
            // 监听父组件的上传触发事件
        });

        // 在组件卸载前，移除事件监听器
        onBeforeUnmount(() => {
        });

      return {
        fileList,
        uploadTip,
        uploading,
        acceptType,
        uploadProgress,
        findBeforeUpload,
        handleRemove,
        uploadFile
      };
    }
  });
  </script>
  
  <style scoped lang="scss">
  .upload-demo{
    width: 100%;
    height: 100%;
    position: relative;
    }
    :deep(.el-upload-dragger){
        background-color: transparent;
        border: none;
    }
    :deep(.el-upload){
    width: 100%;
    height: 100%;
    .el-upload-dragger{
        padding: 0;
        width: 100%;
        height: 100%;
        .el-upload__text{
        width: 100%;
        height: 100%;
        font-size: 16px;
        color: #FFFFFF;
        line-height: 114px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        em{
            color: #FFFFFF;
            text-decoration-line: underline;
        }
        }
    }
    }
    :deep(.el-upload__tip){
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-top: 15px;
        position: absolute;
        top: 53%;
        left: 50%;
        z-index: -1;
        transform: translateX(-50%);
    }
    :deep(.el-progress-bar__outer){
        background-color: rgba(255, 255, 255, 0.2);
    }
    :deep(.el-progress-bar__inner){
        background-color: rgba(255, 255, 255, 0.6);
    }
    :deep(.el-upload-list__item):hover{
        background-color: rgba(255, 255, 255, 0.08);
    }
    :deep(.el-upload-list__item-name){
        color: rgba(255, 255, 255, 0.5);
        &:hover{
            color: rgba(255, 255, 255, 0.8) !important;
        }
    }
  </style>
  