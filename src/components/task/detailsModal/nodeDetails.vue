<template>
    <div class="popupModal" @click="closeEditor">
      <div class="modal-mask"></div>
      <div class="popupModal-wrapper nodeDetails">
        <div class="popupModal-wapper-center" @click.stop>
          <div class="popupModal-wrapper-mask"></div>
          <div class="nodeDetails-form">
            <div class="nodeDetails-form-mian overflowYAuto">
              <div class="main-table">
                <div class="table">
                  <div class="table-row">
                    <div class="table-cell">责任者</div>
                    <div class="table-cell">任务</div>
                    <div class="table-cell">当前节点</div>
                    <div class="table-cell">时间</div>
                    <div class="table-cell">状态</div>
                  </div>
                  <div class="table-row">
                    <div class="table-cell">
                      <div class="table-cell-main">
                        <div class="table-cell-main-avatar">
                          <div class="avatar-img">
                            <el-image
                                :src="nodeData.userAvatar"
                                fit="cover"
                                >
                                <template #error>
                                  <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                </template>
                            </el-image>
                          </div>
                        </div>
                        <div class="table-cell-main-info">
                          <div class="info-name multi-line-1" title="nodeData.username">{{ nodeData.username }}</div>
                          <div class="info-id multi-line-1">账号id：{{ nodeData.userId }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="table-cell cell-line-height">{{ nodeData.name }}</div>
                    <div class="table-cell cell-line-height">6项</div>
                    <div class="table-cell cell-line-height">{{ nodeData.uploadTime }}</div>
                    <div class="table-cell cell-line-height">
                      <template v-if="nodeData.auditStatus == '1'">待审核</template>
                      <template v-if="nodeData.auditStatus == '2'">审核通过</template>
                      <template v-if="nodeData.auditStatus == '3'">审核不通过</template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="main-content">
                <div class="main-content-name">{{ nodeData.name }}</div>
                <div class="main-content-text">{{ nodeData.description }}</div>
                <div class="main-content-file" ref="fileContainer">
                  <div class="flie-item" v-for="(item, index) in nodeData.urls" :key="index">
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
              
              <div class="main-eval">
                <template v-if="nodeData.auditStatus !== '1'">
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
                          <p v-if="editableText ==''">审核节点具体描述</p>
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
                          <i class="icon font_family icon-fabu20"></i>
                        </div>
                        <PopupUpload 
                          upload-type="" 
                          :index='droppedFiles.length'
                          :on-upload-success="handleUploadSuccess" 
                        />
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="auditInfo">
                    <div class="auditInfo-main">
                      <div class="auditInfo-main-m">
                        <div class="auditInfo-main-m-header">
                          <div class="header-user-info">
                            <div class="user-info-main">
                              <div class="auditInfo-avatar">
                                <div class="auditInfo-avatar-m">
                                  <el-image
                                    :src="nodeData.userAvatar"
                                    fit="cover"
                                    >
                                    <template #error>
                                      <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                    </template>
                                  </el-image>
                                </div>
                              </div>
                              <div class="auditInfo-name multi-line-1">管理员名称管理员名称管理员名称管理员名称</div>
                              <div class="auditInfo-role">任务管理员</div>
                            </div>
                          </div>
                          <div class="auditInfo-title">任务管理员节点审核反馈</div>
                        </div>
                        <div class="auditInfo-main-m-content">
                          <div class="auditInfo-main-m-title">
                            文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容
                            文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容
                            文本内容文本内容文本内容文本内容文本内容文本内容文本内容
                            文本内容文本内容文本内容文本内容文本内容文本内容
                            文本内容文本内容文本内容文本内容文本内容
                            文本内容文本内容文本内容文本内容
                            文本内容文本内容文本内容
                            文本内容文本内容
                            文本内容
                          </div>
                          <div class="auditInfo-main-m-file">
                            <div class="flie-item" v-for="(item, index) in nodeData.urls" :key="index">
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
                          <div class="auditInfo-main-m-time">2024.12.20 15:24:23</div>
                        </div>
                        <div class="auditInfo-main-m-footer"></div>
                      </div>
                    </div>
                  </div>
                </template>

              </div>

              <div class="options-but">
                <div class="but-group">
                  <template v-if="nodeData.auditStatus == '1'">
                    <div class="but-group-but ae-btn" @click="uploadToCOS(3)">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-shenhebutongguo20"></i>
                        </div>
                        <div class="exhibit-publish-name">拒绝通过</div>
                      </div>
                    </div>
                    <div class="but-group-but ae-btn" @click="uploadToCOS(2)">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-kongxinyuanquan20"></i>
                        </div>
                        <div class="exhibit-publish-name">审核通过</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="nodeData.auditStatus == '2'">
                    <div class="but-group-but ae-btn">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-kongxinyuanquan20"></i>
                        </div>
                        <div class="exhibit-publish-name">审核通过</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="nodeData.auditStatus == '3'">
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
          </div>
        </div>
      </div>
    </div>
  </template>

<script lang="ts">
  import { defineComponent, ref, computed, watch, onMounted, reactive } from 'vue';
  import PopupUpload from '@/components/upload/popupUpload.vue';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
  import { filesCos, categoryGet } from '@/api/common';
  import { showPopup } from '@/utils/usePopup';
  import { missionsNodeDataGet } from '@/api/kanban';
  import { nodeDataAudit } from '@/api/dao';
  import { aeUseStore } from '@/stores/user';

  import NodeReviewT from '@/assets/images/task/node_review_t.png';
  import NodeReviewC from '@/assets/images/task/node_review_c.png';
  import NodeReviewB from '@/assets/images/task/node_review_b.png';
  
  export default defineComponent({
    name: 'NodeDetail',
    components: {
      PopupUpload
    },
    props: {
      nodeId: {
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
        const proNodeId = ref(props.nodeId);
        const isAuditStatus = ref(0);

        const isEmpty = ref(true);
        const nodeData = ref({});
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;

        // 定义图片和视频的后缀列表
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
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
        const getFileTypes = (filenameOrMimeType: string) => {
          if (filenameOrMimeType.startsWith('image')) {
              return 'image';
          } else if (filenameOrMimeType.startsWith('video')) {
              return 'video';
          } else {
              return 'other';
          }
        };


        // 获取节点详情
        const findMissionsNodeDataGetFun = async () => {
          let getData = {
            id: proNodeId.value
          }
          return new Promise<void>((resolve, reject) => {
            missionsNodeDataGet(getData).then((response: any) => {
              const { code, message } = response;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                return;
              }
              if (response.data) {
                nodeData.value = response.data;
                if (response.data.description) {
                  isEmpty.value = false;
                }
              }
              resolve()
            }).catch((error: any) => {
                reject(error)
            })
          })
        };

        // 切换
        const findToggleFun = (index: number) => {
          // 获取 userInfo.nodeIdList 的索引
          const currentIndex = userInfo.nodeIdList.indexOf(proNodeId.value);
          if (currentIndex !== -1) {
            let newProposalId: string | null = null;
            if (index === 1) {
              // 查找上一个 proNodeId
              newProposalId = currentIndex > 0 ? userInfo.nodeIdList[currentIndex - 1] : null;
              if (!newProposalId) {
                showPopup('没有上一个节点', 'info', 3000);
              }
            } else if (index === 2) {
              // 查找下一个 proNodeId
              newProposalId = currentIndex < userInfo.nodeIdList.length - 1 ? userInfo.nodeIdList[currentIndex + 1] : null;
              if (!newProposalId) {
                showPopup('没有下一个节点', 'info', 3000);
              }
            }

            if (newProposalId) {
              proNodeId.value = newProposalId;
              findMissionsNodeDataGetFun();
            }
          } else {
            console.log('proNodeId not found in userInfo.nodeIdList');
            showPopup('当前节点未找到', 'error', 3000);
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
        const uploadToCOS = async (type: number) => {
          isAuditStatus.value = type;
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
              if(uploadStore.popFiles.length > 0) {
                for (const files of uploadStore.popFiles) {
                  const detailResult = await uploadFileToCOS(files.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
                  console.log('节点文件序号', files.isprevious);
                  let url = `https://${detailResult.data.Location}`;
                  droppedFiles[files.isprevious].url = url;
                  // contents.value[files.id].data = urlArrt;
                  nodeData.value.droppedFiles = droppedFiles;
                  // contents.value[file.id].data = `https://${detailResult.data.Location}`;
                  if (!detailResult.success) throw detailResult.error;
                }
              } else {
                  nodeData.value.droppedFiles = [];
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
         
        // 审核
        const handleApprovedFun = () => {
          console.log('发布内容', nodeData.value)
          console.log('daoId', props.daoId)
          console.log('type', props.type)
          
          // 1 大任务发布者查看个人，2 大任务发布者查看全部，3 Dao管理员查看所有，4 子任务发布者查看个人， 5 路人查看全部
          let businessType = '';
          if(props.type == 3) {
            businessType = '2'
          } else if(props.type == 1) {
            businessType = '1'
          }

          let urlArrt: any[] = [];
          if(nodeData.value.droppedFiles.length > 0) {
            nodeData.value.droppedFiles.forEach((item: any, index: number) => {
              urlArrt.push(item.url);
            });
          }

          let reqData = {
            businessId: nodeData.value.jobId, //	String	必传	类型为1对应任务id 类型为2对应子任务id
            businessType: businessType, //	String	必传	类型： 1任务 2子任务
            nodeDataId: nodeData.value.nodeDataId, //	Long	必传	节点数据id
            remark: editableText.value, //	String	选传	审核失败时备注内容
            auditStatus: isAuditStatus.value, //	Byte	必传	审核状态: 3审核失败 2审核成功
            urls: urlArrt
          }
          console.log('droppedFiles', nodeData.value.droppedFiles);
          console.log('reqData', reqData);
          
          return new Promise<void>((resolve, reject) => {
            nodeDataAudit(reqData).then((response: any) => {
              const { code, data, message } = response;
              
              const resultData = data;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                  return;
              }
              showPopup('审核成功', 'success', 3000);
              closeEditor();
              resolve()
            }).catch((error: any) => {
              reject(error)
            })
          })
        };

        const closeEditor = () => {
          emit('close');
        };

        watch(() => props.nodeId, (newValue) => {
            if (newValue) {
                findMissionsNodeDataGetFun();
            }
        });

        onMounted(() => {
            console.log('fileContainer:', fileContainer.value);
            findMissionsNodeDataGetFun();
        });

        return {
            proNodeId,
            nodeData,
            editableDiv,
            NodeReviewT,
            NodeReviewC,
            NodeReviewB,
            droppedFiles,
            fileContainer,
            editableText,
            isAuditStatus,
            placeholderText,
            textExtensions,
            imageExtensions,
            videoExtensions,
            showFileSection,
            getFileType,
            getFileTypes,
            getFileExtension,
            handleDrop,
            handleInput,
            removeFile,
            handleDragStart,
            handleUploadSuccess,
            handleApprovedFun,
            uploadToCOS,
            publish,
            closeEditor,
            findToggleFun,
            findMissionsNodeDataGetFun
        };
    }
  });
</script>
  
<style lang='scss' scoped>
    @use '@/assets/styles/common.scss';
    @use '@/assets/styles/popupModal.scss';
</style>