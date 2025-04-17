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
                    <div class="table-cell">当前奇点</div>
                    <div class="table-cell">发起时间</div>
                    <div class="table-cell">状态</div>
                  </div>
                  <div class="table-row">
                    <div class="table-cell">
                      <div class="table-cell-main">
                        <div class="table-cell-main-avatar">
                          <div class="avatar-img">
                            <el-image
                                :src="kbData.userAvatar"
                                fit="cover"
                                >
                                <template #error>
                                  <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                </template>
                            </el-image>
                          </div>
                        </div>
                        <div class="table-cell-main-info">
                          <div class="info-name multi-line-1" :title="kbData.username">{{ kbData.username }}</div>
                          <div class="info-id multi-line-1">账号id：{{ kbData.userUuid }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="table-cell cell-line-height">{{ kbData.name }}</div>
                    <div class="table-cell cell-line-height">
                      <div class="cell-main-but">
                        <i 
                          class="icon font_family" 
                          :class="iconClass"
                        >
                        </i>
                      </div>
                    </div>
                    <div class="table-cell cell-line-height">{{ kbData.createTime }}</div>
                    <div class="table-cell cell-line-height">
                      <template v-if="kbData.auditStatus == '1'">待审核</template>
                      <template v-if="kbData.auditStatus == '2'">审核通过</template>
                      <template v-if="kbData.auditStatus == '3'">审核失败</template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="main-content">
                <div class="main-content-name">{{ kbData.name }}</div>
                <div class="main-content-text">{{ kbData.content }}</div>
                <div class="main-content-file" ref="fileContainer">
                  <div class="flie-item" v-for="(item, index) in kbData.urls" :key="index">
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
                  <template v-if="kbData.auditStatus == '1' && userType == 1 || userType == 2 || userType == 3">
                    <div class="but-group-but ae-btn" @click="handleVote(3, proKbId)">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-qidianshanglianzhuangtai20"></i>
                        </div>
                        <div class="exhibit-publish-name">不采纳</div>
                      </div>
                    </div>
                    <div class="but-group-but ae-btn" @click="handleVote(2, proKbId)">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-qidianshanglianzhuangtai20"></i>
                        </div>
                        <div class="exhibit-publish-name">采纳</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="kbData.auditStatus == '2'">
                    <div class="but-group-but ae-btn">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-qidianshanglianzhuangtai20"></i>
                        </div>
                        <div class="exhibit-publish-name">采纳</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="kbData.auditStatus == '3'">
                    <div class="but-group-but ae-btn">
                      <div class="exhibit-publish-main">
                        <div class="exhibit-publish-icon">
                            <i class="icon font_family icon-qidianshanglianzhuangtai20"></i>
                        </div>
                        <div class="exhibit-publish-name">不采纳</div>
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
              <div class="toggle-prev">
                <i class="icon font_family icon-a-jiantouxiangshangshousuo20"></i>
              </div>
              <div class="toggle-next">
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
  import { useUploadStore } from '@/stores/uploadStore';
  import { showPopup } from '@/utils/usePopup';
  import { aeUseStore } from '@/stores/user';
  import { missionsKnowledgeAudit, missionsKnowledgeGet } from '@/api/kanban';

  import NodeReviewT from '@/assets/images/task/node_review_t.png';
  import NodeReviewC from '@/assets/images/task/node_review_c.png';
  import NodeReviewB from '@/assets/images/task/node_review_b.png';

  
  export default defineComponent({
    name: 'NodeDetail',
    components: {
      PopupUpload
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
        const proKbId = ref(props.proId);
        const iconClass = ref('');
        const userType = ref(0); // 判断登录人

        const isEmpty = ref(true);
        const kbData = ref({});
        const userStore = aeUseStore();
        const userInfo = userStore.getUserInfo;
        
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

          
        // 获取奇点详情
        const findMissionsProDataGetFun = async () => {
          let getData = {
            id: proKbId.value
          }
          return new Promise<void>((resolve, reject) => {
            missionsKnowledgeGet(getData).then((response: any) => {
              const { code, message } = response;
              if (code !== 200) {
                showPopup(message, 'error', 3000);
                return;
              }
              if (response.data) {
                kbData.value = response.data;
                findFirstFileTypeFun(kbData.value.urls)
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

        const handleVote = (result: string, id: any) => {
          let reqData = {
            id: id,
            auditStatus: result
          }
          return new Promise<void>((resolve, reject) => {
            missionsKnowledgeAudit(reqData).then((response: any) => {
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
          // 获取 userInfo.knowledgeIdList 的索引
          const currentIndex = userInfo.knowledgeIdList.indexOf(proKbId.value);
          if (currentIndex !== -1) {
            let newProposalId: string | null = null;
            if (index === 1) {
              // 查找上一个 proKbId
              newProposalId = currentIndex > 0 ? userInfo.knowledgeIdList[currentIndex - 1] : null;
              if (!newProposalId) {
                showPopup('没有上一个奇点', 'info', 3000);
              }
            } else if (index === 2) {
              // 查找下一个 proKbId
              newProposalId = currentIndex < userInfo.knowledgeIdList.length - 1 ? userInfo.knowledgeIdList[currentIndex + 1] : null;
              if (!newProposalId) {
                showPopup('没有下一个奇点', 'info', 3000);
              }
            }

            if (newProposalId) {
              proKbId.value = newProposalId;
              findMissionsProDataGetFun();
            }
          } else {
            console.log('proKbId not found in userInfo.knowledgeIdList');
            showPopup('当前奇点未找到', 'error', 3000);
          }
        };

        const closeEditor = () => {
          emit('close');
        };

        watch(() => props.proId, (newValue) => {
            if (newValue) {
              proKbId.value = newValue;
              findMissionsProDataGetFun();
            }
        });
        
        onMounted(() => {
            console.log('fileContainer:', fileContainer.value);
            findMissionsProDataGetFun();
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

        return {
            proKbId,
            kbData,
            userType,
            iconClass,
            editableDiv,
            NodeReviewT,
            NodeReviewC,
            NodeReviewB,
            droppedFiles,
            fileContainer,
            editableText,
            placeholderText,
            textExtensions,
            imageExtensions,
            videoExtensions,
            showFileSection,
            getFileType,
            getFileTypes,
            getFileExtension,
            handleVote,
            closeEditor,
            findToggleFun,
            findFirstFileTypeFun,
            findMissionsProDataGetFun
        };
    }
  });
</script>
  
<style lang='scss' scoped>
    @use '@/assets/styles/common.scss';
    @use '@/assets/styles/popupModal.scss';
</style>