<template>
    <div class="popupModal" @click="closeEditor">
      <div class="modal-mask"></div>
      <div class="popupModal-wrapper nodeDetails" @click.stop>
        <div class="popupModal-wapper-center">
          <div class="popupModal-wrapper-mask"></div>
          <div class="nodeDetails-form">
            <div class="nodeDetails-form-mian overflowYAuto">
              <div class="main-table">
                <div class="table">
                  <div class="table-row">
                    <div class="table-cell">责任者</div>
                    <div class="table-cell">任务</div>
                    <div class="table-cell">当前提案</div>
                    <div class="table-cell">发起时间</div>
                    <div class="table-cell">状态</div>
                  </div>
                  <div class="table-row">
                    <div class="table-cell">
                      <div class="table-cell-main">
                        <div class="table-cell-main-avatar">
                          <div class="avatar-img">
                            <el-image
                                :src="proData.userAvatar"
                                fit="cover"
                                >
                                <template #error>
                                  <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                </template>
                            </el-image>
                          </div>
                        </div>
                        <div class="table-cell-main-info">
                          <div class="info-name multi-line-1" title="proData.username">{{ proData.username }}</div>
                          <div class="info-id multi-line-1">账号id：{{ proData.userUuid }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="table-cell cell-line-height">{{ proData.name }}</div>
                    <div class="table-cell cell-line-height">
                      <div class="cell-main-but">
                        <i 
                          class="icon font_family" 
                          :class="iconClass"
                        >
                        </i>
                      </div>
                    </div>
                    <div class="table-cell cell-line-height">{{ proData.createTime }}</div>
                    <div class="table-cell cell-line-height">
                      <template v-if="proData.isPass == null">待审核</template>
                      <template v-if="proData.isPass == 0">审核通过</template>
                      <template v-if="proData.isPass == 1">审核不通过</template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="main-content">
                <div class="main-content-name">{{ proData.name }}</div>
                <div class="main-content-text">{{ proData.content }}</div>
                <div class="main-content-file" ref="fileContainer">
                  <div class="flie-item" v-for="(item, index) in proData.urls" :key="index">
                    <template v-if="getFileType(item)=='image'">
                      <img
                        :src="item"
                        alt=""
                        draggable="true"
                        @dragstart="handleDragStart($event, item)"
                      />
                    </template>
                    <template v-else-if="getFileType(item)=='video'">
                      <video
                        ref="remoteVideo"
                        autoplay
                        controls
                        draggable="true"
                        @dragstart="handleDragStart($event, item)"
                      >
                        <source :src="item" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </template>
                    <template v-else>
                      <a
                        :href="item"
                        target="_blank"
                        draggable="true"
                        @dragstart="handleDragStart($event, item)"
                      >
                        {{ item }}
                      </a>
                    </template>
                  </div>
                </div>
              </div>
              
              <div class="options-but">
                <div class="but-group">
                  <template v-if="proData.isPass == null && userType == 1 || userType == 2 || userType == 3">
                    <div class="but-group-but ae-btn" @click="handleVote(0, proData.proposalId)">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-shenhebutongguo20"></i>
                        </div>
                        <div class="exhibit-publish-name">不支持</div>
                      </div>
                    </div>
                    <div class="but-group-but ae-btn" @click="handleVote(1, proData.proposalId)">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-kongxinyuanquan20"></i>
                        </div>
                        <div class="exhibit-publish-name">支持</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="proData.isPass == 1">
                    <div class="but-group-but ae-btn">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-kongxinyuanquan20"></i>
                        </div>
                        <div class="exhibit-publish-name">审核通过</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="proData.isPass == 0">
                    <div class="but-group-but ae-btn">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-shenhebutongguo20"></i>
                        </div>
                        <div class="exhibit-publish-name">拒绝通过</div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <div class="main-comment">
                <div class="main-comment-content">
                  <div class="main-comment-title">
                    <div class="main-comment-title-left">
                      <div class="main-comment-title-left-icon">
                        <i class="icon font_family icon-shequhudong24"></i>
                      </div>
                      <div class="main-comment-title-left-text">评论</div>
                    </div>
                    <div class="main-comment-title-right">
                      <i class="icon font_family icon-a-jiantouxiangxiazhankai20"></i>
                    </div>
                  </div>
                  <div class="main-comment-list">
                    <CommentList :refresh="refreshCommentList" :propoaslId='Number(proPropoaslId)' :type='Number(4)' />
                  </div>
                </div>
              </div>

              <div class="main-eval">
                  <div class="main-eval-content">
                    <div class="main-eval-content-m overflowYAuto">
                      <div
                        class="content-textarea"
                        @dragover.prevent
                        @drop="handleDrop"
                      >
                        <div
                          class="editableDiv"
                          contenteditable="true"
                          ref="editableDiv"
                          @input="handleInput"
                        >
                          <p v-if="editableText ==''">针对提案意见</p>
                        </div>
                        <!-- 文件展示区域 -->
                        <div v-if="droppedFiles.length > 0" class="fileSection">
                          <div v-for="(file, index) in droppedFiles" :key="index" class="file-item">
                            <div class="file-item-close" @click="removeFile(index)">
                              <i class="icon font_family icon-cha30"></i>
                            </div>
                            <img
                              v-if="getFileTypes(file.type) === 'image'"
                              :src="file.url"
                              alt="Dropped Image"
                            />
                            <video
                              v-if="getFileTypes(file.type) === 'video'"
                              controls
                              :src="file.url"
                            ></video>
                            <div
                              class="fileClass"
                              v-if="getFileTypes(file.type) === 'other'"
                              :href="file.url"
                              target="_blank"
                              :title="file.url"
                            >
                            <div class="fileClass-icon">
                              <i class="icon font_family icon-tianjiawenzi24"></i>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>
                      <div class="content-upload">
                        <div class="upload-icon">
                          <i class="icon font_family icon-shangchuantupian24"></i>
                        </div>
                        <PopupUpload 
                          upload-type="" 
                          :index='droppedFiles.length'
                          :on-upload-success="handleUploadSuccess" 
                        />
                      </div>
                      <div class="content-upload">
                        <div class="upload-icon">
                          <i class="icon font_family icon-fabu20"></i>
                        </div>
                        <PopupUpload 
                          upload-type="" 
                          :index='droppedFiles.length'
                          :on-upload-success="handleUploadSuccess" 
                        />
                      </div>
                      <div class="content-upload" @click="uploadToCOS">
                        <div class="upload-icon">
                          <i class="icon font_family icon-fasongxiaoxi34"></i>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="nodeDetail-options">
          <div class="options-list">
            <div class="list-toggle">
              <div class="toggle-prev" @click="findToggleFun(1)">
                <i class="icon font_family icon-a-jiantouxiangshangshousuo20"></i>
              </div>
              <div class="toggle-next" @click="findToggleFun(2)">
                <i class="icon font_family icon-a-jiantouxiangxiazhankai20"></i>
              </div>
            </div>
            <div class="list-tag">
              <div class="list-tag-content">
                <div class="list-tag-text" @click="isTagShow = !isTagShow">
                  <template v-if="isTagId == '0'">
                    <i class="icon font_family icon-biaoji20"></i>
                  </template>
                  <template v-else>{{ isTagName }}</template>
                </div>
                <div class="list-tag-line" v-if="isTagShow">
                  <div
                    class="lsit-item"
                    :class="{ falg: isTagId === item.id }"
                    v-for="(item, index) in tagList"
                    :key="index"
                    @click="handleTagClick(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="list-forwarding" @click="handleForwarding">
              <i class="icon font_family icon-zhuanfa24_1"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script lang="ts">
  import { defineComponent, ref, computed, watch, onMounted, reactive, onBeforeUnmount } from 'vue';
  import PopupUpload from '@/components/upload/popupUpload.vue';
  import CommentList from '@/components/comment/commentList.vue';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
  import { filesCos, categoryGet, commentAdd, commentList, commentDel, commentPoint, commentPointId, commentReport } from '@/api/common';
  import { missionsDaosProposalsGet, markAdd, markTagList, markCancel } from '@/api/kanban';
  import { proposaproposalsVotelsSave } from '@/api/dao';
  import { showPopup } from '@/utils/usePopup';
  import { aeUseStore } from '@/stores/user';
  import { copyToClipboard } from '@/utils/index';

  import NodeReviewT from '@/assets/images/task/node_review_t.png';
  import NodeReviewC from '@/assets/images/task/node_review_c.png';
  import NodeReviewB from '@/assets/images/task/node_review_b.png';


  
  export default defineComponent({
    name: 'ProposalDetail',
    components: {
      PopupUpload,
      CommentList
    },
    props: {
      proId: {
        type: String,
        required: true
      },
      daoId: {
        type: String,
        required: true
      },
      type: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
        const editableDiv = ref<HTMLDivElement | null>(null);
        const fileContainer = ref<HTMLDivElement | null>(null);
        const droppedFiles = reactive<Array<{ index: number, type: string; url: string }>>([]);
        const showFileSection = ref(false); // 控制文件区域显示
        const editableText = ref<string>(""); // 用户输入的文字内容
        const placeholderText = '审核节点具体描述';
        const uploadStore = useUploadStore();
        const isTagId = ref('0'); // 标签id
        const isTagName = ref(''); // 标签id
        const isTagShow = ref(false); // 标签显示
        const proPropoaslId = ref(props.proId); // 提案id
        const iconClass = ref('');
        const userType = ref(0); // 判断登录人

        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;

        const isEmpty = ref(true);
        const proData = ref({});
        
        const tagList = ref([]);

        // 定义图片和视频的后缀列表
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];
        const textExtensions = ['txt', 'docx', 'pdf', 'doc', 'xls', 'xlsx'];
        // 函数用于获取文件扩展名
        const getFileExtension = (filename: string) => {
            const match = filename.match(/\.([^.]+)$/);
            return match ? match[1].toLowerCase() : '';
        }

        const getFileType = (filename: string) => {
            const extension = getFileExtension(filename);
            if (imageExtensions.includes(extension)) {
                return 'image';
            } else if (videoExtensions.includes(extension)) {
                return 'video';
            } else if (textExtensions.includes(extension)) {
                return 'text';
            } else {
                return 'other';
            }
        };
        const findFirstFileTypeFun = (urls: string[]) => {
          if(urls !== null) {
            let length = urls.length;
            if(length > 0){
              const extension = getFileExtension(urls[0]);
              if (imageExtensions.includes(extension)) {
                iconClass.value = 'icon-shangchuantupian24';
              } else if (videoExtensions.includes(extension)) {
                iconClass.value = 'icon-shangchuanshipin24';
              } else if (textExtensions.includes(extension)) {
                iconClass.value = 'icon-tianjiawenzi24';
              } else {
                iconClass.value = 'icon-yinpinwenjian24';
              }
            } else {
              iconClass.value = 'icon-tianjiawenzi24';
            }
          } else {
            iconClass.value = 'icon-tianjiawenzi24';
          }
          console.log('iconClass.value', iconClass.value);
        };
        const getFileTypes = (filenameOrMimeType: string) => {
          if (filenameOrMimeType.startsWith('image')) {
              return 'image';
          } else if (filenameOrMimeType.startsWith('video')) {
              return 'video';
          } else {
              return 'other';
          }
        };

        // 获取提案详情
        const findMissionsProDataGetFun = async () => {
          let getData = {
            id: proPropoaslId.value
          }
          return new Promise<void>((resolve, reject) => {
            missionsDaosProposalsGet(getData).then((response: any) => {
              const { code, message } = response;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                return;
              }
              if (response.data) {
                proData.value = response.data;
                isTagId.value = response.data.myMarkId || '0';
                isTagName.value = response.data.markName;
                findFirstFileTypeFun(proData.value.urls)
                if (response.data.content) {
                  isEmpty.value = false;
                }
              }
              resolve()
            }).catch((error: any) => {
                reject(error)
            })
          })
        };

        // 投票
        const handleVote = (result: string, id: any) => {
          let reqData = {
            proposalId: id,
            isAgree: result
          }
          return new Promise<void>((resolve, reject) => {
            proposaproposalsVotelsSave(reqData).then((response: any) => {
              const { code, message } = response;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                return;
              }
              showPopup('投票成功', 'success', 3000);
              closeEditor();
              resolve()
            }).catch((error: any) => {
                reject(error)
            })
          })
        };

        // 切换
        const findToggleFun = (index: number) => {
          // 获取 userInfo.proposalIdList 的索引
          const currentIndex = userInfo.proposalIdList.indexOf(proPropoaslId.value);
          if (currentIndex !== -1) {
            let newProposalId: string | null = null;
            if (index === 1) {
              // 查找上一个 proposalId
              newProposalId = currentIndex > 0 ? userInfo.proposalIdList[currentIndex - 1] : null;
              if (!newProposalId) {
                showPopup('没有上一个提案', 'info', 3000);
              }
            } else if (index === 2) {
              // 查找下一个 proposalId
              newProposalId = currentIndex < userInfo.proposalIdList.length - 1 ? userInfo.proposalIdList[currentIndex + 1] : null;
              if (!newProposalId) {
                showPopup('没有下一个提案', 'info', 3000);
              }
            }

            if (newProposalId) {
              proPropoaslId.value = newProposalId;
              isTagId.value = '0';
              findMissionsProDataGetFun();
            }
          } else {
            console.log('proPropoaslId not found in userInfo.proposalIdList');
            showPopup('当前提案未找到', 'error', 3000);
          }
        };

        const handleDragStart = (event: DragEvent, item: string) => {
          // 动态设置拖拽数据
          const fileType = getFileType(item); // 调用现有方法获取文件类型
          event.dataTransfer?.setData(
            "file",
            JSON.stringify({ type: fileType, url: item })
          );
        };

        // 处理用户输入的内容
        const handleInput = () => {
          if (editableDiv.value) {
            editableText.value = editableDiv.value.innerText.trim();
          } else {
            console.warn('editableDiv is not available');
          }
        };

        // 处理文件拖拽放置
        const handleDrop = (event: DragEvent) => {
          event.preventDefault();
          const data = event.dataTransfer?.getData("file");
          if (data) {
            const parsedData = JSON.parse(data);
            droppedFiles.push(parsedData);
          } else {
            // 如果直接拖入文件
            const files = event.dataTransfer?.files;
            if (files) {
              Array.from(files).forEach((file) => {
                const url = URL.createObjectURL(file);
                const type = file.type.startsWith("image")
                  ? "image"
                  : file.type.startsWith("video")
                  ? "video"
                  : "link";

                droppedFiles.push({ index: droppedFiles.length+1, type, url });
              });
            }
          }
        };

        // 删除附件或者拖拽文件
        const removeFile = (index: number) => {
            droppedFiles.splice(index, 1);
            uploadStore.removePopFile(index);
        };

        // 上传成功
        const handleUploadSuccess = (index: number, type: any, urls: any) => {
          console.log('上传的文件', urls);
          let file = {
            index: index,
            type: type,
            url: urls
          }
          droppedFiles.push(file);
          console.log('droppedFiles.value', droppedFiles);
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

                  publish();
                  resolve()
              }).catch((error: any) => {
                  reject(error)
              })
          })
        
        };
        
        // 上传提交过的所有文件
        const publish = async () => {
            isPublishing.value = true;
            try {
              // 上传节点文件
              for (const files of uploadStore.popFiles) {
                const detailResult = await uploadFileToCOS(files.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
                console.log('节点文件序号', files.isprevious);
                let url = `https://${detailResult.data.Location}`;
                droppedFiles[files.isprevious].url = url;
                // contents.value[files.id].data = urlArrt;
                proData.value.droppedFiles = droppedFiles;
                // contents.value[file.id].data = `https://${detailResult.data.Location}`;
                if (!detailResult.success) throw detailResult.error;
              }

              // 所有文件上传成功后，执行发布操作
              handleApprovedFun();
              // 清空上传状态
              uploadStore.clearAllFiles();

            } catch (error) {
              console.error('发布失败：', error);
              showPopup('发布失败，请重试！', 'error', 3000);
            } finally {
              isPublishing.value = false;
            }
        };

        // 审核通过
        const handleApprovedFun = () => {
          console.log('发布内容', proData.value)
          handleCommentAddFun();
        };

        // 审核失败
        const handleAuditFailureFun = () => {
          console.log('审核失败');
        };


        // 刷新评论列表
        const refreshCommentList = ref(false);
        // 发布评论
        const handleCommentAddFun = () => {
          let arrt: any[] = [];
          droppedFiles.forEach((item: any) => {
              arrt.push(item.url);
          });
          let reqData = {
            businessId: proData.value.proposalId,
            businessType: 4,
            content: editableText.value,
            imageUrl: arrt.toString()
          }
          if (!editableText.value.trim()) { // 检查输入内容是否为空
            showPopup('评论内容不能为空', 'error', 3000);
            return;
          }
          return new Promise<void>((resolve, reject) => {
            commentAdd(reqData).then((response: any) => {
              const { code, data, message } = response;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              refreshCommentList.value = !refreshCommentList.value;
              editableText.value = '';
              // 添加空值检查
              if (editableDiv.value) {
                editableDiv.value.innerText = '';
              } else {
                console.warn('editableDiv is not available');
              }
              resolve()
            }).catch((error: any) => {
                reject(error)
            })
          })
        };

        // 获取标签列表
        const findTagListFun = () => {
          let resData = {};
          return new Promise<void>((resolve, reject) => {
            markTagList(resData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              tagList.value = resultData;
              resolve()
            }).catch((error: any) => {
                reject(error)
            })
          })
        }

        // 选择标签
        const handleTagClick = (item: any) => {
          isTagId.value = item.id;
          isTagName.value = item.name;
          isTagShow.value = false;
          findMarkAddFun(item)
        };

        const findMarkAddFun = (item: any) => {
          let reqData = {
            markTagId: item.id,
            markTagName: item.name,
            businessId: proData.value.proposalId,
            businessType: 1	
          }
          return new Promise<void>((resolve, reject) => {
            markAdd(reqData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              
              resolve()
            }).catch((error: any) => {
                reject(error)
            })
          })
        }

        // 转发
        const handleForwarding = () => {
          // 判断浏览器是否支持分享API
          const currentUrl = window.location.href;
          if (navigator.share) {
              // 要分享的内容
              const shareData = {
                  title: '分享标题',
                  text: '分享内容描述',
                  url: currentUrl // 要分享的网页链接
              };
              // 调用分享API
              navigator.share(shareData)
                  .then(() => console.log('分享成功'))
                  .catch((err) => console.error('分享失败', err));
          } else {
              console.log('当前浏览器不支持分享API');
              // 可以提供一个备选方案，如弹出一个包含分享链接的对话框
              showPopup('请复制以下链接进行分享：https', 'error', 3000);
          }
        };

        /** 点击复制NFT **/
        const copyContent = async (url: string) => {
            await copyToClipboard(url);
        };
        
        const closeEditor = () => {
          console.log('close方法被调用')
          emit('close');
        };

        watch(() => props.proId, (newValue) => {
            if (newValue) {
              proPropoaslId.value = newValue;
              findMissionsProDataGetFun();
            }
        });

        onMounted(() => {
            console.log('fileContainer:', fileContainer.value);
            findMissionsProDataGetFun();
            findTagListFun();
            const currentUrl = window.location.href; // 获取当前页面的 URL
            // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部,6 个人任务执行者查看
            if(currentUrl.includes('executeDetails')){
              if(userInfo.id == userInfo.bigTaskUserId) {
                if(userInfo.isMissKanbanType == 1) {
                  userType.value = 1;
                } else {
                  userType.value = 2;
                }
              } else if(userInfo.id == userInfo.daoAdminUserId) {
                userType.value = 3;
              } else if(userInfo.id == userInfo.subtaskAdminUserId) {
                userType.value = 4;  
              } else {
                userType.value = 5;
              }
            } else if(currentUrl.includes('personalTasks')){
              if(userInfo.id == userInfo.bigTaskUserId) {
                userType.value = 1;
              } else if(userInfo.id == userInfo.arAdminUserId) {
                userType.value = 6;
              } else {
                userType.value = 5;
              }
            }
        });

        // 清理副作用
        onBeforeUnmount(() => {
          // 清除任何可能的副作用，例如定时器或事件监听器
        });

        return {
            isTagShow,
            isTagId,
            tagList,
            proData,
            userType,
            isTagName,
            iconClass,
            editableDiv,
            NodeReviewT,
            NodeReviewC,
            NodeReviewB,
            droppedFiles,
            fileContainer,
            editableText,
            proPropoaslId,
            placeholderText,
            textExtensions,
            imageExtensions,
            videoExtensions,
            showFileSection,
            refreshCommentList,
            handleVote,
            getFileType,
            getFileTypes,
            getFileExtension,
            handleDrop,
            handleInput,
            removeFile,
            handleDragStart,
            handleUploadSuccess,
            handleAuditFailureFun,
            handleApprovedFun,
            uploadToCOS,
            publish,
            closeEditor,
            findTagListFun,
            handleTagClick,
            findFirstFileTypeFun,
            handleForwarding,
            findToggleFun,
            handleCommentAddFun
        };
    }
  });
</script>
  
<style lang='scss' scoped>
    @use '@/assets/styles/common.scss';
    @use '@/assets/styles/popupModal.scss';
</style>