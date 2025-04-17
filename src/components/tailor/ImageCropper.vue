<template>
    <div class="popupModal" v-if="isShow">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper edit-info" @click.stop>
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="editAvatar-from">
                    <div class="editAvatar-from-main">
                        <div class="editAvatar-from-main-title">图片裁剪</div>
                        <div class="editAvatar-from-tailor">
                          <vue-cropper
                            ref="cropper"
                            :img="cropperImg"
                            :output-size="options.outputSize"
                            :output-type="options.outputType"
                            :info="options.info"
                            :can-scale="options.canScale"
                            :auto-crop="options.autoCrop"
                            :fixed="options.fixed"
                            :fixed-number="options.fixedNumber"
                            :high="options.high"
                            :full="options.full"
                            :can-move="options.canMove"
                            :can-move-box="options.canMoveBox"
                            :original="options.original"
                            :center-box="options.centerBox"
                          />
                        </div>
                        <div class="editAvatar-submit">
                            <div class="cancel" @click="handleCancel">取消</div>
                            <div class="submit" @click="submitCropper">保存</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
   
   <script lang="ts">
    import { defineComponent, PropType, ref,  } from 'vue';
    import COS from 'cos-js-sdk-v5';
    import { filesCos } from '@/api/common';
    import { showPopup } from '@/utils/usePopup';
    import 'vue-cropper/dist/index.css'
    import { VueCropper } from 'vue-cropper'
    import { useUploadStore } from '@/stores/uploadStore';  // 缓存上传封面的文件数据
 
    export default defineComponent({
      name: 'ImgUpload',
      components: {
        'vue-cropper': VueCropper
      },
      props: {
        cropperImg: {
            type: String,
            required: true,
            default: ''
        },
        type: {
            type: String, 
            required: true,
            default: '1' // 1:裁剪并上传 2：只裁剪
        },
        fileName: {
          type: String,
          required: true
        },
        isShow: {
          type: Boolean,
          required: true,
        },
        onUploadSuccess: {
            type: Function as PropType<(urls: string[]) => void>,
            required: true
        },
        aspectRatio: {
            type: Array,
            required: false,
            default: () => [1, 1]  // 默认值为 1:1
        }
      },
      setup(props, { emit }) {
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
        const isShow = ref(props.isShow);
        console.log('props', props);

        const cropper  = ref(); // 获取cropper实例
        const cropperImg = ref(props.cropperImg); // 预览图片
        const imgUrl = ref(''); // 裁剪后上传成功的图片路径
        const fileName = ref(props.fileName); // 文件名
        const options = {
          outputSize: 1,   // 裁剪生成图片的质量 0.1 ~ 1
          outputType: 'png',   // 裁剪生成图片的格式 jpeg, png, webp, jpg (jpg 需要传入jpeg)
          autoCrop: true,    // 是否默认生成截图框
          fixed: true,    // 是否开启截图框宽高固定比例
          fixedNumber: props.aspectRatio,    // 截图框的宽高比例, 开启fixed生效 [ 宽度 , 高度 ]
          canScale: true,   // 图片是否允许滚轮缩放
          high: true,    // 	是否按照设备的dpr 输出等比例图片
          full: true,    // 	是否输出原图比例的截图
          info: true,    // 裁剪框的大小信息
          canMove: true,   // 上传图片是否可以移动
          canMoveBox: true,   // 截图框能否拖动
          original: true,    // 	截图框是否被限制在图片里面
          centerBox: true   // 	截图框是否被限制在图片里面
        }
        const uploadStore = useUploadStore();

        const submitCropper = () => {
          cropper.value.getCropBlob((blob) => {
            const file = new File([blob], fileName.value, { type: "image/jpeg" });
            console.log('file', file);  
            // 这里可以发送请求上传图片
            if(props.type == '1'){
              uploadToCOS(file);
            } else {
              uploadStore.setCoverImage(file); // 保存文件到 Pinia 状态管理
              imageUrl.value = URL.createObjectURL(file); // 生成本地预览路径
              props.onUploadSuccess(imageUrl.value);
            }
            
          })
        }
        const handleCancel = () => {
            emit('close');
            isShow.value = false;
        }
  
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
            const Key = `File/${year}/${month}/${day}/${Date.now()}-${options.name}`;
            uploading.value = true;
            uploadProgress.value = 0;
            cos.putObject({
                Bucket: bucket.value,
                Region: region.value,
                Key: Key,
                Body: options,
                onProgress: function (progressData) {
                    console.log('进度:', JSON.stringify(progressData));
                    uploadProgress.value = Math.round(progressData.percent * 100);
                }
            }, function (err, data) {
                uploading.value = false;
                if (err) {
                  console.error('上传失败', err);
                  showPopup(err, 'error', 3000);
                } else {
                  console.log('上传成功', data);
                  imgUrl.value = `https://${data.Location}`;
                  imageUrl.value = options.url;
                  fileList.value.push(options);
                  props.onUploadSuccess(imgUrl.value);
                }
            });
        };

        return {
          imgUrl,
          fileName,
          cropper,
          cropperImg,
          submitCropper,
          handleCancel,

          options,
          isShow: props.isShow,
          bucket,
          region,
          sessionToken,
          tmpSecretId,
          tmpSecretKey,
          token,
          fileList,
          uploading,
          imageUrl,
          uploadProgress,
          handleToCOS,
          uploadToCOS,
        };
      },
    });
 </script>
   
<style lang='scss' scoped>
  .popupModal{
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    .modal-mask{
        width: 100%;
        height: 100%;
        position: relative;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,0);
    }
    .popupModal-wrapper{
        width: 400px;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .popupModal-wapper-center{
            position: relative;
            border-radius: 24px;
            overflow: hidden;
            padding: 39px 20px 53px 20px;
            border: 1px solid rgb(255, 255, 255, .38);
            box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
            .popupModal-wrapper-mask{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -1;
                background: rgba(255,255,255,0.06);
                backdrop-filter: blur(68px);
            }
        }
    }
    .edit-info{
        width: 403px;
        height: auto;
        .popupModal-wapper-center{
            height: 100%;
            padding: 24px 22px 39px 21px;
            .editAvatar-from{
                width: 100%;
                height: auto;
                .editAvatar-from-main{
                    width: 100%;
                    height: auto;
                    .editAvatar-from-main-title{
                        width: 100%;
                        font-weight: 600;
                        font-size: 20px;
                        color: #FFFFFF;
                        line-height: 1;
                        text-align: center;
                        font-style: normal;
                        text-transform: none;
                        margin-bottom: 10px;
                    }
                    .editAvatar-from-item{
                        width: 100%;
                        .item-avatar{
                            width: 139px;
                            height: 139px;
                            padding: 3px;
                            border-radius: 50%;
                            margin: 30px auto 0 auto;
                            position: relative;
                            background-color: #FFFFFF;
                            .item-avatar-img{
                                width: 100%;
                                height: 100%;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 50%;
                                }
                            }
                            .item-avatar-icon{
                                width: 42px;
                                height: 42px;
                                position: absolute;
                                right: 0;
                                bottom: 0;
                                z-index: 11;
                                border-radius: 50%;
                                overflow: hidden;
                                cursor: pointer;
                                background-color: rgba(255, 255, 255, 0.06);
                                backdrop-filter: blur(68px);
                                i{
                                    font-size: 24px;
                                    color: #FFFFFF;
                                    line-height: 42px;
                                    text-align: center;
                                    display: block;
                                    isolation: isolate;
                                }
                                .upload-icon{
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 50%;
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    z-index: 1;
                                    opacity: 0;
                                }
                            }
                        }
                        .item-name{
                            width: 100%;
                            height: 48px;
                            margin-top: 29px;
                            border-radius: 12px;
                            background-color: rgba(255, 255, 255, .16);
                            backdrop-filter: blur(56px);
                            .item-name-main{
                                height: auto;
                                display: flex;
                                padding: 0 24px;
                                isolation: isolate;
                                .item-name-main-icon{
                                    width: 24px;
                                    flex-shrink: 0;
                                    margin-right: 16px;
                                    i{
                                        font-size: 24px;
                                        color: #FFFFFF;
                                        display: block;
                                        line-height: 48px;
                                    }
                                }
                                .item-name-main-input{
                                    flex: 1;
                                    input{
                                        width: 100%;
                                        height: 100%;
                                        font-size: 16px;
                                        color: #FFFFFF;
                                        line-height: 48px;
                                        text-align: left;
                                        font-style: normal;
                                        text-transform: none;
                                        border: none;
                                        isolation: isolate;
                                        background-color: transparent;
                                        &::placeholder {
                                            color: rgb(255, 255, 255, 0.68);
                                            font-size: 12px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .editAvatar-from-tailor{
                        width: 100%;
                        height: 246px;
                    }
                    .editAvatar-submit{
                        width: 100%;
                        height: auto;
                        display: flex;
                        justify-content: center;
                        font-size: 16px;
                        color: #FFFFFF;
                        line-height: 42px;
                        text-align: center;
                        font-style: normal;
                        text-transform: none;
                        margin-top: 40px;
                        .cancel{
                            width: 96px;
                            height: 42px;
                            cursor: pointer;
                            margin-right: 15px;
                            border-radius: 21px;
                            color: rgba(255, 255, 255, .8);
                            background-color: rgba(0, 0, 0, .2);
                        }
                        .submit{
                            width: 96px;
                            height: 42px;
                            cursor: pointer;
                            border-radius: 21px;
                            background-color: rgba(0, 0, 0, .3);
                        }
                    }
                }
            }
        }
    }
    .masking{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0);
    }
}
</style>
  