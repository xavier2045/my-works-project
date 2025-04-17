<template>
  <div class="upload-wrapper">
      <div class="upload-content">
        <el-upload
          class="upload-demo"
          :before-upload="beforeUpload"
          :http-request="uploadToCOS"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :show-file-list="false"
          drag
          :limit="1"
          accept="image/*"
        >
          <div class="image-style" v-if='imageUrl !== ""'>
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <div class="upload-style-close">
              <div class="upload-style-close-icon" @click="handleRemove()">
                <i class="icon font_family icon-shanchu20"></i>
              </div>
            </div>
          </div>
          <div class="upload-style" v-else>
            <div class="upload-style-icon">
                <i class="icon font_family icon-jiahaoyuanquanbiankuang34"></i>
            </div>
            <div class="upload-style-text">{{ uploadName }}</div>
          </div>
          
        </el-upload>
      </div>
      
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref,  } from 'vue';
  import COS from 'cos-js-sdk-v5';
  import { filesCos } from '@/api/common';
  import { showPopup } from '@/utils/usePopup';
  import { FILENAMELENGTH } from '@/utils/common';

export default defineComponent({
  name: 'ImgUpload',
  components: {
  },
  props: {
    uploadType: {
        type: String,
        required: true
    },
    name: {
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
    const bucket = ref('');
    const region = ref('');
    const sessionToken = ref('');
    const tmpSecretId = ref('');
    const tmpSecretKey = ref('');
    const token = ref('');
    const imageUrl = ref('');
    const uploadName = props.name;
    console.log('props', props);
    const beforeUpload = (file: File) => {
        return new Promise((resolve, reject) => {
            let isValid = true;
            let errorMessage = '';
            // 检查文件类型
            if (props.uploadType === 'image') {
              const isJPG = file.type === 'image/jpeg';
              const isPNG = file.type === 'image/png';
              if (!isJPG && !isPNG) {
                  isValid = false;
                  errorMessage = '只能上传jpg/png文件';
              }
            }

            const nameSize = file.name.length;
            if(nameSize > FILENAMELENGTH) {
              showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
              return false;
            }

            // 检查文件大小
            const maxSize = props.uploadType === 'image' ? 6 * 1024 * 1024 : (props.uploadType === 'video' ? 1024 * 1024 * 1024 : 1024 * 1024 * 1024);
            if (file.size > maxSize) {
            isValid = false;
            errorMessage = props.uploadType === 'image' ? '图片大小不能超过6M' : (props.uploadType === 'video' ? '视频大小不能超过1G' : '文件大小不能超过1G');
            }

            if (isValid) {
            resolve(true);
            } else {
            reject(false);
            }
        });   
    };

    const now = new Date();
    // 年
    const year = now.getFullYear();
    // 月
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    // 日
    const day = now.getDate().toString().padStart(2, '0');

    // const cos = new COS({
    //     SecretId: tmpSecretId.value,
    //     SecretKey: tmpSecretKey.value
    // });

    // 上传前获取参数
    const uploadToCOS = (options: any) => {
        let resData = {};
        return new Promise<void>((resolve, reject) => {
            filesCos(resData).then((response: any) => {
                const { code, data, message } = response;
                
                const resultData = data;
                if (code !== 200) {
                  showPopup(message, 'error', 3000);
                    return;
                }
                
                bucket.value = resultData.bucket;
                region.value = resultData.region;
                sessionToken.value = resultData.sessionToken;
                tmpSecretId.value = resultData.tmpSecretId;
                tmpSecretKey.value = resultData.tmpSecretKey;
                token.value = resultData.token;
                handleToCOS(options);
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    
    };
    // 上传过程
    const handleToCOS = (options: any) => {
        const cos = new COS({
            SecretId: tmpSecretId.value,
            SecretKey: tmpSecretKey.value,
            SecurityToken: sessionToken.value,
        });
        console.log("cos", cos);
        const { file, onSuccess, onError } = options;
        const Key = `File/${year}/${month}/${day}/${Date.now()}-${file.name}`;
        uploading.value = true;
        uploadProgress.value = 0;
        cos.putObject({
            Bucket: bucket.value,
            Region: region.value,
            Key: Key,
            Body: file,
            onProgress: function (progressData) {
                console.log('进度:', JSON.stringify(progressData));
                uploadProgress.value = Math.round(progressData.percent * 100);
            }
        }, function (err, data) {
            uploading.value = false;
            if (err) {
            console.error('上传失败', err);
            onError(err);
            } else {
            console.log('上传成功', data);
            file.url = `https://${data.Location}`;
            imageUrl.value = file.url;
            fileList.value.push(file);
            onSuccess(data);
            }
        });
    };
        

    const handleSuccess = (response: any, file: any, fileList: any) => {
        const uploadedUrls = fileList.map((item: any) => item.raw.url);
        props.onUploadSuccess(uploadedUrls);
    };

    const handleError = (error: any, file: any, fileList: any) => {
    console.error('文件上传失败', error);
    };

    const handleRemove = () => {
      fileList.value = [];
      imageUrl.value = ''; // 清空图片预览
    };


    return {
      bucket,
      region,
      uploadName,
      sessionToken,
      tmpSecretId,
      tmpSecretKey,
      token,
      fileList,
      uploading,
      imageUrl,
      uploadProgress,
      handleToCOS,
      handleSuccess,
      handleError,
      beforeUpload,
      uploadToCOS,
      handleRemove
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
              .image-style{
                width: 100%;
                height: 100%;
                position: relative;
                img{
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  object-position: center;
                }
                .upload-style-close{
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  z-index: 1;
                  display: none;
                  .upload-style-close-icon{
                    width: 34px;
                    height: 34px;
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    i{
                      font-size: 24px;
                      color: #FFFFFF;
                      display: block;
                      line-height: 34px;
                      text-align: center;
                    }
                  }
                }
                &:hover{
                  .upload-style-close{
                    display: block;
                  }
                }
              }
              .upload-style {
                display: inline-block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                .upload-style-icon{
                    width: 34px;
                    display: block;
                    margin: 24px auto 16px auto;
                    i{
                        font-size: 34px;
                        color: #FFFFFF;
                        display: block;
                    }
                }
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
