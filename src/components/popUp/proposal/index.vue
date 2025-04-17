<template>
    <div class="popupModal" v-if="isVisible" @click="closeEditor">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper">
            <div class="popupModal-wapper-center" @click.stop>
                <div class="popupModal-wrapper-mask"></div>
                <div class="popupModal-wrapper-avatar">
                  <img :src="evt03" alt="" />
                </div>
                <div class="proposal-from">
                    <div class="proposal-from-content">
                      <div class="proposal-from-header">
                        <div class="proposal-from-header-avatar">
                          <div class="proposal-from-header-avatar-img">
                            <div class="proposal-from-header-avatar-img-content">
                              <img :src="userInfo.avatar" alt="" />
                            </div>
                          </div>
                        </div>
                        <div class="proposal-from-header-text">{{ userInfo.userName }}的提案</div>
                      </div>
                      <div class="proposal-from-content-info">
                        <div class="proposal-from-content-info-content pdl">
                          <div class="content-item-name inputBg">
                            <div class="info-content-item ">
                              <div class="info-content-item-left">
                                <div class="info-content-item-icon">
                                  <i class="icon font_family icon-gexingmingyan24"></i>
                                </div>
                                <div class="info-content-item-name">提案主题</div>
                              </div>
                              <div class="info-content-item-right">
                                <input type="text" v-model="name" />
                              </div>
                            </div>
                          </div>
                          <div class="content-item-task inputBg">
                            <div class="info-content-item ">
                              <div class="info-content-item-left">
                                <div class="info-content-item-icon">
                                  <i class="icon font_family icon-gexingmingyan24"></i>
                                </div>
                              </div>
                              <div class="info-content-item-right">
                                <div class="topics">
                                  <template v-if="type !== '1'">
                                    <div class="topic-title" @click="isTopic = true">#{{ selectedTopic }}</div>
                                    <div class="topic-list" v-if="isTopic">
                                      <div class="topic-list-item" v-for="(topic, index) in topics" :key="index" @click="insertTopic(topic)">
                                        <div class="topic-list-item-avatar">
                                          <img :src="topic.adminAvatar" alt="" />
                                        </div>
                                        <div class="topic-list-item-name">{{ topic.jobName }}</div>
                                      </div>
                                    </div>
                                  </template>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="proposal-from-content-info-editor textareaBg">
                          <div class="textarea_bg">
                              <div class="textarea_bg_t"></div>
                              <div class="textarea_bg_c"></div>
                              <div class="textarea_bg_b"></div>
                          </div>
                          <div class="item-name">
                            <div class="item-name-title">
                                <div class="item-name-title-content">
                                    <i class="icon font_family icon-jieshao24"></i>
                                    <div class="name">提案内容</div>
                                </div>
                            </div>
                          </div>
                          <div class="kb-from-info-content-textarea">
                            <div 
                              ref="editor" 
                              class="editor overflowYAuto" 
                              :class="{ 'is-empty': isEditorEmpty }"
                              :contenteditable="true" 
                              @input="handleInput"
                              @beforeinput="limitTextLength"
                              :data-placeholder="placeholder"
                            ></div>
                            <div class="editor-footer">
                              <div class="char-count">{{ charCount }}/{{ maxLength }} 字符</div>
                            </div>
                          </div>
                          <div class="kb-from-info-content-flie">
                            <div class="flie-content">
                              <div class="flie-list">
                                <div 
                                  class="file-list-item"
                                  v-for="(item, index) in uploadedUrls"
                                  :key="index"
                                  >
                                  <div class="file-list-item-mian">
                                    <div class="file-icon">
                                      <i class="icon font_family icon-a-PDFtubiao34"></i>
                                    </div>
                                    <div class="file-name multi-line-1" :title="item.name">
                                        {{ item.name }}
                                    </div>
                                    <div class="file-delete" @click="deleteFile(item)">
                                      <i class="icon font_family icon-shanchulajitong24"></i>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="flie-upload">
                                <TextUpload
                                  upload-type=".*" 
                                  :on-upload-success="handleUploadSuccess"
                                />
                              </div>
                            </div>
                        </div>
                        </div>
                      </div>
                      <div class="proposal-from-content-footer">
                        <div class="proposal-from-content-footer-btn" @click="uploadToCOS">发起提案</div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { aeUseStore } from '@/stores/user';
import evt03 from '@/assets/images/dao/proUserBg.png';
import { missionsDaosTasksDrop } from '@/api/kanban';
import { filesCos } from '@/api/common';
import { uploadFileToCOS } from '@/services/uploadService';
import { showPopup } from '@/utils/usePopup';
import TextUpload from '@/components/upload/allTypeUpload.vue';

export default defineComponent({
  name: 'AddProposalEditor',
  components: {
      TextUpload
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    initialContent: {
      type: String,
      default: ''
    },
    daoId: {
      type: String,
      default: ''
    },
    missionId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 200 // 字符限制
    },
    placeholder: {
      type: String,
      default: '请输入提案内容' // 默认 placeholder
    }
  },
  emits: ['update:content', 'close'],
  setup(props, { emit }) {
    const editor = ref<HTMLDivElement | null>(null);
    const content = ref<string>(props.initialContent || '');
    const charCount = ref<number>(content.value.length); // 字符计数
    const selectedTopic = ref('指定任务'); // 当前输入的话题
    const isTopic = ref(false); // 是否显示话题列表
    const isEditorEmpty = ref<boolean>(true); // 是否为空判断
    const name = ref('');
    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const topics = ref([]); // 预定义话题
    const type = ref(props.type); // 1: 任务详情，2：dao详情
    const delUrls = ref([]);

    // 获取子任务列表
  const findSubTasksListFun = () => {
    let id = props.missionId;
    let reqData = {
      businessId: id,
      businessType: 1
    }
    return new Promise<void>((resolve, reject) => {
      missionsDaosTasksDrop(reqData).then((response: any) => {
        const { code, message } = response;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        topics.value = response.data;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };


    // 处理输入事件，更新内容和字符计数
    const handleInput = () => {
      const currentText = editor.value?.innerText || '';
      charCount.value = currentText.length;
      content.value = editor.value?.innerHTML || ''; // 获取带有 HTML 标签的内容
      isEditorEmpty.value = currentText.trim().length === 0; // 检查编辑器是否为空
    };

    // 限制字数输入
    const limitTextLength = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      const currentText = editor.value?.innerText || '';
      if (currentText.length >= props.maxLength && keyboardEvent.key !== 'Backspace') {
        showPopup('字数超出限制', 'error', 3000);
        keyboardEvent.preventDefault(); // 超过字数限制时阻止输入
      }
    };

    // 插入话题到编辑器，并应用样式
    const insertTopic = (item: any) => {
      if (editor.value && charCount.value + item.jobName.length <= props.maxLength) {
        editor.value.focus(); // 确保编辑器获得焦点
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && editor.value.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);

          // 创建话题 <span>
          const span = document.createElement('span');
          span.className = 'topic';
          span.textContent = '#' + item.jobName;

          // 插入话题 <span> 并在其后插入空格
          range.deleteContents();
          range.insertNode(span);
          range.collapse(false);
          const space = document.createTextNode(' ');
          range.insertNode(space);

          // 将光标移到空格之后
          selection.removeAllRanges();
          const newRange = document.createRange();
          newRange.setStartAfter(space);
          newRange.setEndAfter(space);
          selection.addRange(newRange);
          isTopic.value = false;
          handleInput(); // 更新字符计数和内容
        }
      }
    };


    // 上传的文件信息
    const uploadedUrls = ref<string[]>([]);
    const handleUploadSuccess = (urls: string[]) => {
        console.log('上传的文件', urls);
        if(delUrls.value.length < 1){
            uploadedUrls.value = urls;
        } else {
            let filteredArray = urls.filter(item => !delUrls.value.includes(item.uid));

            console.log('filteredArray', filteredArray);
            uploadedUrls.value = filteredArray;
        }
    };

    const deleteFile = (item: any) => {
        console.log('删除文件', item);
        delUrls.value.push(item.uid);
        uploadedUrls.value = uploadedUrls.value.filter((item2) => item2 !== item);
        console.log('delUrls.value', delUrls.value);
    };

    // 获取cos配置
    const bucket = ref('');
    const region = ref('');
    const sessionToken = ref('');
    const tmpSecretId = ref('');
    const tmpSecretKey = ref('');
    const token = ref('');

    const isPublishing = ref(false);

    // 上传前获取参数
    const uploadToCOS = async () => {
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

                submitContent();
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };


    // 提交内容
    const submitContent = async () => {
        isPublishing.value = true;
        try {
        // 上传主体文件
            let attr = [];
            for (const [index, file] of uploadedUrls.value.entries()) {
                console.log('index', index);
                console.log('file', file);
                console.log('fileraw', file.raw);
                const mainResult = await uploadFileToCOS(file.raw, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
                console.log('mainResult', mainResult);
                console.log('index', index);
                attr.push(`https://${mainResult.data.Location}`)
                console.log(attr.join(','));
                if (!mainResult.success) throw mainResult.error;
            };
            // 所有文件上传成功后，执行发布操作
            submitContents(attr);

        } catch (error) {
            console.error('发布失败：', error);
            showPopup('文件上传失败，请重试！', 'error', 3000);
        } finally {
            isPublishing.value = false;
        }
    };

    // 提交内容
    const submitContents = (str: any) => {
      let proData = {
        daoId: props.daoId,
        name: name.value,
        content: content.value,
        urls: str
      }
      emit('update:content', proData);
      closeEditor();
    };

    // 关闭编辑器
    const closeEditor = () => {
      emit('close');
    };
    // 初始化时填充初始内容
    onMounted(() => {
      if(props.type !== '1'){
        findSubTasksListFun();
      }
      if (editor.value) {
        editor.value.innerText = props.initialContent;
        charCount.value = editor.value.innerText.length;
      }
    });

    return {
      evt03,
      name,
      editor,
      content,
      userInfo,
      charCount,
      topics,
      isTopic,
      type,
      delUrls,
      uploadedUrls,
      isEditorEmpty,
      selectedTopic,
      handleInput,
      submitContent,
      closeEditor,
      insertTopic,
      limitTextLength,
      handleUploadSuccess,
      deleteFile,
      uploadToCOS,
    };
  }
});
</script>
  
  <style scoped lang="scss">
    .popupModal{
        width: 100% !important;
        height: 100vh !important;
        position: fixed;
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
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
            width: 683px;
            height: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .popupModal-wapper-center{
                width: 100%;
                height: 100%;
                position: relative;
                border-radius: 52px;
                .popupModal-wrapper-mask{
                    width: calc(100% - 3px);
                    height: calc(100% - 3px);
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    border-radius: 52px;
                    border: 1px solid rgb(255, 255, 255, .38);
                    box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
                    background: rgba(100, 99, 98, .16);
                    backdrop-filter: blur(36px);
                }
                .popupModal-wrapper-avatar{
                  width: 464px;
                  height: 401px;
                  position: absolute;
                  top: -50px;
                  left: 50%;
                  right: 0;
                  bottom: 0;
                  z-index: -1;
                  transform: translate(-50%,0);
                  img{
                    width: 100%;
                  }
                }
                .proposal-from{
                    padding: 30px 0;
                    isolation: isolate;
                    border-radius: 52px;
                        .proposal-from-content{
                          width: 100%;
                          height: auto;
                          .proposal-from-header{
                            width: 100%;
                            height: auto;
                            .proposal-from-header-avatar{
                              width: 106px;
                              height: auto;
                              border-radius: 50%;
                              margin: 0 auto;
                              position: relative;
                              .proposal-from-header-avatar-img{
                                width: 106px;
                                height: 106px;
                                border-radius: 50%;
                                padding: 10px;
                                position: absolute;
                                top: -76px;
                                left: 50%;
                                z-index: 9;
                                transform: translateX(-50%);
                                // background-color: rgba(255, 255, 255, .6);
                                .triangle {
                                  position: absolute;
                                  bottom: -10px; /* 调整指针位置 */
                                  left: 50%;
                                  transform: translateX(-50%);
                                  width: 50px;
                                  height: 50px;
                                  transform: rotate(180deg);
                                }
                                .proposal-from-header-avatar-img-content{
                                  width: 106px;
                                  height: 106px;
                                  overflow: hidden;
                                  border-radius: 50%;
                                  img{
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                  }
                                }
                              }
                              .big{
                                width: 126px;
                                height: 126px;
                                border-radius: 50%;
                                margin: 0 auto;
                                position: absolute;
                                top: 30px;
                                left: 50%;
                                z-index: 6;
                                // animation: growAndFade 3s infinite;
                                transform: translateX(-50%);
                                background-color: rgba(0, 0, 0, .1);
                                .inThe{
                                  width: 38px;
                                  height: 38px;
                                  border-radius: 50%;
                                  margin: 44px auto;
                                  display: block;
                                  // animation: growAndFade 2s 0.5s infinite;
                                  background-color: rgba(255, 255, 255, .6);
                                  .small{
                                    width: 26px;
                                    height: 26px;
                                    display: inline-block;
                                    margin: 6px;
                                    border-radius: 50%;
                                    // animation: growAndFade 2s 1s infinite;
                                    background-color: rgba(0, 0, 0, .2);
                                  }
                                }
                              }
                              @keyframes growAndFade {
                                0% {
                                  transform: scale(1);
                                  opacity: 1;
                                }
                                50% {
                                  transform: scale(2);
                                  opacity: 1;
                                }
                                100% {
                                  transform: scale(2);
                                  opacity: 0;
                                }
                              }
                            }
                            .proposal-from-header-text{
                              font-weight: 500;
                              font-size: 18px;
                              color: #FFFFFF;
                              line-height: 46px;
                              text-align: center;
                              font-style: normal;
                              text-transform: none;
                              padding-top: 90px;
                            }
                          }
                          .proposal-from-content-info{
                            width: 100%;
                            height: auto;
                            margin-top: 30px;
                            .proposal-from-content-info-content{
                              width: calc(100% - 30px);
                              height: auto;
                              display: flex;
                              justify-content: space-between;
                              .content-item-name{
                                width: 500px;
                                height: auto;
                              }
                              .content-item-task{
                                width: 244px;
                                height: auto;
                                .info-content-item{
                                height: 48px;
                                display: flex;
                                padding: 0 10px;
                                border-radius: 12px;
                                .info-content-item-left{
                                  width: 50px;
                                  height: auto;
                                  flex-shrink: 0;
                                  display: flex;
                                  .info-content-item-icon{
                                    width: 24px;
                                    height: auto;
                                    margin-right: 10px;
                                    flex-shrink: 0;
                                    i{
                                      font-size: 24px;
                                      color: #FFFFFF;
                                      display: block;
                                      line-height: 48px;
                                    }
                                  }
                                  .info-content-item-name{
                                    flex: 1;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    line-height: 48px;
                                    text-align: left;
                                    font-style: normal;
                                    text-transform: none;
                                  }
                                }
                                .info-content-item-right{
                                  flex: 1;
                                  width: 0;
                                  height: auto;
                                  line-height: 48px;
                                  
                                }
                              }
                                .topics{
                                  height: auto;
                                  margin-top: 6px;
                                  border-radius: 16px;
                                  position: relative;
                                  .topic-title{
                                    min-width: 86px;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    text-align: left;
                                    line-height: 32px;
                                    border-radius: 16px;
                                    padding: 0 22px;
                                    cursor: pointer;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                  }
                                  .topic-list{
                                    width: 294px;
                                    height: auto;
                                    max-height: 240px;
                                    border-radius: 18px;
                                    background-color: rgb(117 109 103);
                                    padding: 15px 0;
                                    position: absolute;
                                    top: 40px;
                                    left: 0;
                                    z-index: 10;
                                    border: 1px solid rgb(255, 255, 255, .38);
                                    overflow-y: auto; /* 超出时出现滚动条 */
                                    word-wrap: break-word;
                                    white-space: pre-wrap;
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
                                    .topic-list-item{
                                      font-size: 16px;
                                      color: #FFFFFF;
                                      line-height: 42px;
                                      text-align: left;
                                      font-style: normal;
                                      text-transform: none;
                                      cursor: pointer;
                                      display: flex;
                                      padding: 0 26px;
                                      .topic-list-item-avatar{
                                        width: 26px;
                                        height: 26px;
                                        flex-shrink: 0;
                                        margin: 8px 10px 8px 0;
                                        img{
                                          width: 26px;
                                          height: 26px;
                                          border-radius: 50%;
                                        }
                                      }
                                      .topic-list-item-name{
                                        flex: 1;
                                        width: 0;
                                        font-size: 16px;
                                        color: #FFFFFF;
                                        line-height: 42px;
                                        text-align: left;
                                        font-style: normal;
                                        text-transform: none;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                      }
                                      &:hover{
                                        color: #FFFFFF;
                                        background: radial-gradient(circle at 50% 50%, rgb(255, 255, 255, .7), rgb(255, 255, 255, 0));
                                      }
                                    }
                                  }
                                }
                              }
                              .info-content-item{
                                height: 48px;
                                display: flex;
                                padding: 0 22px;
                                border-radius: 12px;
                                .info-content-item-left{
                                  width: 110px;
                                  height: auto;
                                  flex-shrink: 0;
                                  display: flex;
                                  .info-content-item-icon{
                                    width: 24px;
                                    height: auto;
                                    margin-right: 10px;
                                    flex-shrink: 0;
                                    i{
                                      font-size: 24px;
                                      color: #FFFFFF;
                                      display: block;
                                      line-height: 48px;
                                    }
                                  }
                                  .info-content-item-name{
                                    flex: 1;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    line-height: 48px;
                                    text-align: left;
                                    font-style: normal;
                                    text-transform: none;
                                  }
                                }
                                .info-content-item-right{
                                  flex: 1;
                                  width: 0;
                                  height: auto;
                                  line-height: 48px;
                                  input{
                                    width: 100%;
                                    height: 100%;
                                    line-height: 48px;
                                    text-align: left;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    font-style: normal;
                                    text-transform: none;
                                    border: 0;
                                    padding-left: 0;
                                    padding-right: 0;
                                    color: #FFFFFF;
                                    background: transparent;
                                    display: block;
                                    &::placeholder {
                                      color: rgb(255, 255, 255, 0.68);
                                      font-size: 16px;
                                    }
                                  }
                                  :deep(.el-range-editor.el-input__wrapper){
                                    padding: 0;
                                  }
                                  :deep(.el-date-editor:focus-visible){
                                    border: none;
                                  }
                                  :deep(.el-input__wrapper){
                                    width: 100%;
                                    background: transparent;
                                  }
                                  :deep(.el-range-editor.is-active){
                                    border-color: transparent;
                                    box-shadow: none;
                                  }
                                  :deep(.el-date-editor .el-range__icon){
                                    display: none;
                                  }
                                  :deep(.el-date-editor .el-range-input){
                                    color: #FFFFFF;
                                  }
                                  :deep(.el-date-editor .el-range-separator){
                                    color: #FFFFFF;
                                  }
                                  :deep(.el-date-editor.el-input__wrapper){
                                    box-shadow: none;
                                  }
                                }
                              }
                            }
                            .proposal-from-content-info-editor{
                              height: auto; 
                              padding: 20px 30px 30px 30px;
                              border-radius: 12px;
                              .item-name{
                                width: 100%;
                                height: auto;
                                display: flex;
                                margin: 0 auto;
                                .item-name-title{
                                    width: 150px;
                                    height: 48px;
                                    flex-shrink: 0;
                                    .item-name-title-content{
                                        display: flex;
                                        i{
                                            width: 60px;
                                            font-size: 24px;
                                            color: #FFFFFF;
                                            margin-right: 10px;
                                            line-height: 64px;
                                            float: left;
                                            text-align: center;
                                        }
                                        .name{
                                            display: inline-block;
                                            font-size: 16px;
                                            color: #FFFFFF;
                                            line-height: 64px;
                                            text-align: left;
                                            font-style: normal;
                                            text-transform: none;
                                        }
                                    }
                                }
                                .item-name-input{
                                    flex: 1;
                                    width: 0;
                                    
                                    input{
                                        width: 100%;
                                        height: 64px;
                                        font-size: 16px;
                                        line-height: 64px;
                                        color: #FFFFFF;
                                        border: none;
                                        padding: 0;
                                        display: block;
                                        background-color: transparent;
                                    }
                                }
                            }
                            .kb-from-info-content-textarea{
                                width: 100%;
                                height: auto;
                                position: relative;
                                .editor{
                                  width: 100%;
                                  height: calc(100% - 30px);
                                  font-size: 16px;
                                  color: #FFFFFF;
                                  line-height: 1.5;
                                  text-align: left;
                                  font-style: normal;
                                  text-transform: none;
                                  overflow-y: auto; /* 超出时出现滚动条 */
                                  word-wrap: break-word;
                                  white-space: pre-wrap;
                                  :deep(.topic){
                                    font-size: 14px;
                                    line-height: 1;
                                    padding: 7px 14px;
                                    border-radius: 12px;
                                    display: inline-block;
                                    background-color: rgb(104, 102, 98, 1);
                                  }
                              }
                              .is-empty{
                                &::before {
                                  content: attr(data-placeholder);
                                  position: absolute;
                                  top: 30px;
                                  left: 30px;
                                  color: #999;
                                  pointer-events: none;
                                }
                              }
                              
                              .editor-footer{
                                width: 100%;
                                height: auto;
                                display: flex;
                                justify-content: flex-end;
                                .char-count{
                                  width: 100%;
                                  font-size: 16px;
                                  color: rgb(255, 255, 255, .7);
                                  line-height: 32px;
                                  text-align: right;
                                }
                              }
                            }
                              
                            }
                            .pdl{
                                padding-left: 10px;
                            }
                            .inputBg{
                                height: 64px;
                                padding: 0;
                                background: url(@/assets/images/publish/longInput_bg.png) no-repeat center center;
                                background-size: 100% 100%;
                                &:hover {
                                    background: url(@/assets/images/publish/longInput_bg_hover.png) no-repeat center center;
                                    background-size: 100% 100%;
                                }
                                .item-name-title{
                                    width: 180px !important;
                                    height: 42px;
                                    flex-shrink: 0;
                                    padding-left: 20px;
                                    .item-name-title-content{
                                        display: flex;
                                        i{
                                            width: 60px;
                                            font-size: 24px;
                                            color: #FFFFFF;
                                            margin-right: 10px;
                                            line-height: 42px;
                                            float: left;
                                            text-align: center;
                                        }
                                        .name{
                                            display: inline-block;
                                            font-size: 16px;
                                            color: #FFFFFF;
                                            line-height: 42px;
                                            text-align: left;
                                            font-style: normal;
                                            text-transform: none;
                                        }
                                    }
                                }
                            }
                            .textareaBg{
                                position: relative;
                                padding-right: 0;
                                &:last-child{
                                    margin-bottom: 0;
                                }
                                .textarea_bg{
                                    width: 100%;
                                    height: 100%;
                                    position: absolute;
                                    top: 0;
                                    left: -5px;
                                    right: 0;
                                    bottom: 0;
                                    z-index: -1;
                                    .textarea_bg_t{
                                    width: 100%;
                                    height: 64px;
                                    background: url(@/assets/images/publish/bg-top.png) no-repeat center center;
                                    background-size: 100% 100%;
                                    }
                                    .textarea_bg_c{
                                    width: 100%;
                                    height: calc(100% - 90px);
                                    background: url(@/assets/images/publish/bg_center.png) no-repeat center center;
                                    background-size: 100% 100%;
                                    }
                                    .textarea_bg_b{
                                    width: 100%;
                                    height: 39px;
                                    background: url(@/assets/images/publish/bg_bottom.png) no-repeat center center;
                                    background-size: 100% 100%;
                                    }
                                }
                                .item-name{
                                    width:100%;
                                    height: 42px;
                                    .item-name-title{
                                        width: 150px;
                                        height: 42px;
                                        flex-shrink: 0;
                                        .item-name-title-content{
                                            display: flex;
                                            i{
                                                width: 60px;
                                                font-size: 24px;
                                                color: #FFFFFF;
                                                margin-right: 20px;
                                                line-height: 42px;
                                                float: left;
                                                text-align: center;
                                            }
                                            .name{
                                                display: inline-block;
                                                font-size: 16px;
                                                color: #FFFFFF;
                                                line-height: 42px;
                                                text-align: left;
                                                font-style: normal;
                                                text-transform: none;
                                            }
                                        }
                                    }
                                }
                                .kb-from-info-content-textarea{
                                    width: calc(100% - 70px);
                                    height: 218px;
                                    margin: 10px 50px 0 20px;
                                }
                            }
                          }
                          .kb-from-info-content-flie{
                              width: calc(100% - 60px);
                              height: auto;
                              padding: 0 50px 20px 10px;
                              .flie-content{
                                  width: 100%;
                                  height: auto;
                                  display: flex;
                                  .flie-list{
                                      flex: 1;
                                      width: 0;
                                      height: auto;
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
                                                  display: block;
                                                  }
                                              }
                                              .file-name{
                                                  width: 90px;
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
                                                  cursor: pointer;
                                                  i{
                                                  font-size: 24px;
                                                  color: rgb(255, 255, 255, .7);
                                                  line-height: 30px;
                                                  display: block;
                                                  }
                                                  &:hover{
                                                      i{
                                                          color: #fff;
                                                      }
                                                  }
                                              }
                                          }
                                      }
                                  }
                                  .flie-upload{
                                      width: 110px;
                                      height: 52px;
                                      cursor: pointer;
                                      flex-shrink: 0;
                                      padding: 0 20px;
                                      border-radius: 24px;
                                      background: url(@/assets/images/task/publish_bg.png) no-repeat center center;
                                      background-size: 100% 100%;
                                      &:hover{
                                          background: url(@/assets/images/task/publish_bg_hover.png) no-repeat center center;
                                          background-size: 100% 100%;
                                      }
                                  }
                              }
                          }
                          .proposal-from-content-footer{
                            width: 100%;
                            height: auto;
                            .proposal-from-content-footer-btn{
                              width: 138px;
                              height: 65px;
                              cursor: pointer;
                              border-radius: 23px;
                              font-size: 16px;
                              color: #FFFFFF;
                              line-height: 65px;
                              text-align: center;
                              font-style: normal;
                              text-transform: none;
                              margin: 20px auto 0 auto;
                              background-color: rgb(255, 255, 255, .16);
                              background: url(@/assets/images/task/publish_bg.png) no-repeat center center;
                              background-size: 100% 100%;
                              &:hover{
                                  background: url(@/assets/images/task/publish_bg_hover.png) no-repeat center center;
                                  background-size: 100% 100%;
                              }
                            }
                          }
                        }
                    }
            }
            .close{
                width: 34px;
                height: 34px;
                cursor: pointer;
                margin: 30px auto 0 auto;
                i{
                    font-size: 34px;
                    color: #000000;
                    display: block;
                }
            }
        }
    }
  </style>
  