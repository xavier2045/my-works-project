<template>
  <div class="file-upload-container">
    <div class="file-type-selector" v-if="uploadedFiles.length < 1">
      <div class="file-title">请选择您的作品类型</div>
      <div class="file-type-buttons">
        <div
          v-for="button in fileTypes"
          :key="button.type"
          class="file-type-button"
          @click="selectFileType(button.type, button.id)"
        >
          <div class="type-button-main">
            <i :class="['icon font_family', button.icon]"></i>
            <div class="type-button-name">{{ button.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="uploaded-files" v-if="uploadedFiles.length > 0">
      <div 
        class="uploaded-file-list overflowYAuto" 
        :class="selectedType == 'image' ? 'overfShow' : 'overfHide'"
        :style="uploadedFiles.length < 3 && selectedType !== 'text' ? { 'justifyContent': 'center' } : { 'justifyContent': 'flex-start' }">
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="uploaded-file"
          :class="selectedType !== 'text' ? 'contentWidth' : 'fillWidth'"
        >
          <div v-if="file.type === 'image'" class="file-preview">
            <img :src="file.url" class="avatar" />
            <div class="file-del" @click="removeFile(index)">
              <i class="icon font_family icon-cha30"></i>
            </div>
            <div class="file-actions">
              <div class="file-action-item" @click="viewFile(file)">查看</div>
              <div class="cover-option-split"></div>
              <div class="file-action-item" @click="replaceFile(file)">替换</div>
            </div>
          </div>

          <div v-if="file.type === 'video'" class="file-preview videoAudioRelace">
            <video controls :key="file.url">
              <source :src="file.url" :type="file.mimeType" />
            </video>
            <div class="file-del" @click="removeFile(index)">
              <i class="icon font_family icon-cha30"></i>
            </div>
            
            <div class="file-reolace relievoShadow" @click="replaceFile(file)">
              <div class="actions-icon">
                <i class="icon font_family icon-shangchuanzuopin24"></i>
              </div>
              <div class="actions-text">
                重新上传
              </div>
            </div>
          </div>

          <div v-if="file.type === 'audio'" class="file-preview videoAudioRelace">
            <audio controls :key="file.url">
              <source :src="file.url" :type="file.mimeType" />
            </audio>
            <div class="file-del" @click="removeFile(index)">
              <i class="icon font_family icon-cha30"></i>
            </div>
            <div class="file-reolace relievoShadow" @click="replaceFile(file)">
              <div class="actions-icon">
                <i class="icon font_family icon-shangchuanzuopin24"></i>
              </div>
              <div class="actions-text">
                重新上传
              </div>
            </div>
          </div>

          <div v-if="file.type === 'text'" class="file-info">
            <!-- 新增圆形进度条组件v-if="file.progress < 100" -->
            <div  class="circular-progress">
              <el-progress type="circle" color="#FFFFFF" :percentage="file.progress" />
            </div>
            
            <div class="file-upload-tip">
              <p>支持TXT、PPT、DOCX、PDF格式，文本文件大小不超过50MB</p>
            </div>
            <div class="text-file-card">
              <div class="file-meta inputBg relievoShadow">
                  <div class="input_bg">
                    <div class="input_bg_l"></div>
                    <div class="input_bg_c"></div>
                    <div class="input_bg_r"></div>
                  </div>
                  <div class="file-meta-main">
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-wenbenwenjian24"></i>
                        </div>
                        <div class="item-main-name">文件作品</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="file-meta-content">
                        <p class="file-name">{{ file.name }}</p>
                        <p class="file-size">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                  </div>
              </div>
              <div class="text-file-actions">
                <div class="actions-but relievoShadow" @click="removeFile(index)">
                  <div class="actions-icon">
                    <i class="icon font_family icon-shanchu20"></i>
                  </div>
                  <div class="actions-text">
                    删除文件
                  </div>
                </div>
                <!-- replaceFile(index) -->
                <div class="actions-but relievoShadow" @click="replaceFile(file)">
                  <div class="actions-icon">
                    <i class="icon font_family icon-shangchuanzuopin24"></i>
                  </div>
                  <div class="actions-text">
                    重新上传
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="selectedType === 'image'">
        <div class="add-more-files">
          <p>您已添加 {{ uploadedFiles.length }} 张图片</p>
          <div class="add-more-files-btn relievoShadow" @click="addMoreFiles">继续添加</div>
        </div>
      </template>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input
      type="file"
      ref="fileInput"
      class="hidden-file-input"
      @change="handleFileChange"
      :accept="fileAccept"
      :multiple="selectedType === 'image'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useWorkUpload } from "@/stores/workUpload";
import { FILENAMELENGTH } from '@/utils/common';
import { showPopup } from "@/utils/usePopup";
import { getFileInfoFromUrl } from "@/utils/index";

export default defineComponent({
  name: "FileUpload",
  props: {
    fileData: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const workUploadStore = useWorkUpload();
    const selectedType = ref<string | null>(null);
    const selectedId = ref<number>(0);
    const uploadedFiles = ref<
      Array<{
        name: string;
        type: string;
        url: string;
        mimeType: string;
        progress: number;
      }>
    >([]);
    const fileInput = ref<HTMLInputElement | null>(null);
    const replaceIndex = ref<number | null>(null);

    // 文件类型数组
    const fileTypes = ref([
      {
        id: 1,
        type: "video",
        label: "视频类",
        icon: "icon-shangchuanshipin24",
        accept: "video/*",
      },
      {
        id: 2,
        type: "image",
        label: "图片类",
        icon: "icon-shangchuantupian24",
        accept: "image/*",
      },
      {
        id: 3,
        type: "audio",
        label: "音频类",
        icon: "icon-yinpin68",
        accept: "audio/*",
      },
      {
        id: 4,
        type: "text",
        label: "文字类",
        icon: "icon-tianjiawenzi24",
        accept: ".docx,.pdf,.ppt,.pptx,.txt",
      },
    ]);

    // 动态计算文件类型
    const fileAccept = computed(() => {
      return fileTypes.value.find((type) => type.type === selectedType.value)?.accept || "";
    });

    // Map type number to selectedType string
    const typeToSelectedType = (type: number): string | null => {
      switch (type) {
        case 1:
          return "video";
        case 2:
          return "image";
        case 3:
          return "audio";
        case 4:
          return "text";
        default:
          return null;
      }
    };
    const loadFileData = () => {
      if (props.fileData.length > 0 && props.type !== 0) {
        const isUrlArray = props.fileData.every(item => typeof item === 'string' && /^https?:\/\/.+/.test(item));
        if(isUrlArray) {
          let fileUrl = props.fileData;
          const filePromises = fileUrl.map((item, index) => {
              try {
                  const url = new URL(item); // 解析 URL
                  const pathname = url.pathname; // 获取路径部分
                  const extension = pathname.split('.').pop()?.toLowerCase(); // 获取文件后缀名并转为小写

                  let type = 'unknown'; // 默认类型为未知

                  // 根据文件后缀名判断类型
                  if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
                      type = 'video';
                  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
                      type = 'image';
                  } else if (['mp3', 'wav', 'aac', 'flac'].includes(extension)) {
                      type = 'audio';
                  } else if (['txt', 'docx', 'pdf', 'ppt', 'pptx'].includes(extension)) {
                      type = 'text';
                  }
                  selectedType.value = type;
                  return {
                      name: pathname.split('/').pop() || 'Unknown File', // 取文件名
                      url: item,
                      mimeType: extension || "", // 文件后缀名作为 MIME 类型
                      size: 0, // 无法获取文件大小，默认为 0
                      type: type, // 文件类型
                  };
              } catch (error) {
                  console.error('Error fetching file info:', error);
                  return null;
              }
          });

          Promise.all(filePromises).then(fileResults => {
              const validFiles = fileResults.filter(file => file !== null);
              uploadedFiles.value = validFiles;
          });
        } else {
          const typeString = typeToSelectedType(props.type);
          if (typeString) {
            selectedType.value = typeString;
            selectedId.value = props.type;

            uploadedFiles.value = props.fileData.map((file: any) => {
              return {
                name: file.name || "Unknown File",
                type: typeString,
                url: file.url || URL.createObjectURL(file),
                mimeType: file.webKitRelativePath || "",
                progress: 100,
                size: file.size || 0,
              };
            });
          }
        }
      }
    };

    onMounted(() => {
      if (!fileInput.value) {
        fileInput.value = document.querySelector<HTMLInputElement>('.hidden-file-input');
      }

      loadFileData();
    });

    watch(() => props.fileData, () => {
      loadFileData();
    }, { deep: true });

    watch(() => props.type, () => {
      loadFileData();
    });


    const selectFileType = (type: string, id: number) => {
      
      emit('emit-type', id);
      selectedType.value = type;
      selectedId.value = id;
      if (fileInput.value) {
        fileInput.value.accept = fileAccept.value; // 确保 accept 属性正确设置
        fileInput.value.multiple = selectedType.value === 'image'; // 确保 multiple 属性正确设置
        fileInput.value.click();
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);

        // 根据文件类型限制上传数量
        let allowedFiles = files;
        if (selectedType.value !== "image") {
          allowedFiles = files.slice(0, 1); // 只允许一个文件
        }

        allowedFiles.forEach((file) => {
          const fileUrl = URL.createObjectURL(file);
          const mimeType = file.type;
          let progress = 0; // 初始化进度为 0

          const nameSize = file.name.length;
          if(nameSize > FILENAMELENGTH) {
            showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
            return false;
          }
          
          // 如果是替换操作，更新对应索引的文件
          if (replaceIndex.value !== null) {
            uploadedFiles.value[replaceIndex.value] = {
              name: file.name,
              type: selectedType.value,
              url: fileUrl,
              mimeType: mimeType,
              progress: progress,
              size: file.size,
            };
            replaceIndex.value = null;
          } else {
            uploadedFiles.value.push({
              name: file.name,
              type: selectedType.value,
              url: fileUrl,
              mimeType: mimeType,
              progress: progress,
              size: file.size,
            });
          }

          // 模拟上传进度
          const interval = setInterval(() => {
            if (progress < 100) {
              progress = Math.min(progress + 10, 100);
              // 更新对应的 file.progress
              const fileIndex = uploadedFiles.value.findIndex(
                (f) => f.name === file.name
              );
              if (fileIndex !== -1) {
                uploadedFiles.value[fileIndex].progress = progress;
              }
              if (progress === 100) {
                clearInterval(interval);
              }
            }
          }, 500);

          // 保存到状态管理
          workUploadStore.addWorksFile(file);
          console.log('作品文件', uploadedFiles.value);
        });

        target.value = ""; // 清空文件输入
      }
    };

    // 删除文件
    const removeFile = (index: number) => {
      const file = uploadedFiles.value[index];
      uploadedFiles.value.splice(index, 1);
      // 从状态管理中移除文件
      workUploadStore.removeWorksFile(index);
    };

    // 查看文件
    const viewFile = (file: { name: string; url: string; type: string }) => {
      if (file.type === "image") {
        window.open(file.url, "_blank");
      }
    };

    // 替换文件
    const replaceFile = (file: { name: string; url: string; type: string }) => {
      // 找到要替换的文件索引
      const index = uploadedFiles.value.findIndex(f => f.name === file.name);
      if (index !== -1) {
        replaceIndex.value = index;
        if (fileInput.value) {
          fileInput.value.accept = fileAccept.value; // 确保 accept 属性正确设置
          fileInput.value.multiple = false; // 替换时只能选择一个文件
          fileInput.value.click();
        }
      }
    };

    // 添加更多图片文件
    const addMoreFiles = () => {
      selectFileType(selectedType.value, 2);
    };

    return {
      fileTypes,
      fileInput,
      fileAccept,
      selectedType,
      uploadedFiles,
      replaceIndex,
      workUploadStore,
      selectFileType,
      handleFileChange,
      removeFile,
      viewFile,
      replaceFile,
      addMoreFiles,
      formatFileSize,
      typeToSelectedType,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common.scss';
$primary-color: #007bff;
$secondary-color: #dc3545;
$background-color: #f9f9f9;
$border-radius: 4px;
$box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
$gap: 10px;

.file-upload-container {
  width: calc(100% - 78px);
  height: 270px;
  margin: 4px 36px;
  border-radius: 12px;
  // background: rgba(255, 255, 255, 0.08);
  // background: rgba(229,229,229,0.16);
  backdrop-filter: blur(20px);
  border: 2px dashed rgba(255, 255, 255, .38);
  box-shadow: 12px 0px 52px 0px #000004;

  .file-type-selector {
    width: 100%;
    margin-bottom: 43px;

    .file-title {
      width: 100%;
      height: auto;
      font-weight: 400;
      font-size: 18px;
      color: #FFFFFF;
      line-height: 1;
      text-align: center;
      margin: 43px 0 30px 0;
    }

    .file-type-buttons {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      gap: 10px;

      .file-type-button {
        width: 230px;
        height: 148px;
        display: flex;
        gap: 10px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 12px;
        position: relative;
        &:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
          background: rgba(255, 255, 255, 0.4);
        }
        .type-button-main {
          display: inline-block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          i {
            font-size: 42px;
            color: rgba(255, 255, 255, .7);
            text-align: center;
            display: block;
          }

          .type-button-name {
            font-weight: 400;
            font-size: 16px;
            color: rgba(255, 255, 255, .7);
            line-height: 1;
            text-align: center;
            padding-top: 20px;
          }
        }
      }
    }
  }

  .uploaded-files {
    width: calc(100% - 66px);
    padding: 0 33px;
    .overfShow{
      overflow-y: auto;
    }
    .overfHide{
      overflow-y: inherit;
    }
    .uploaded-file-list {
      max-height: 190px;
      display: flex;
      flex-wrap: wrap;
      gap: $gap;
      justify-content: flex-start;
      padding-top: 20px;
      padding-right: 6px;
      .contentWidth {
        width: calc(33.3333% - 7px);
      }
      .fillWidth {
        width: 100%;
      }
      .uploaded-file {
        height: 178px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        position: relative;
        border-radius: 18px;
        .file-preview {
          width: 100%;
          height: 100%;
          border-radius: 18px;
          position: relative;
          img, video , audio{
            width: 100%;
            height: 100%;
            border-radius: 18px;
          }
          .file-del {
            width: 20px;
            height: 20px;
            position: absolute;
            top: -7px;
            right: -7px;
            cursor: pointer;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(9px);
            i{
                font: 14px;
                color: #FFFFFF;
                text-align: center;
                line-height: 20px;
                display: block;
            }
          }
          .file-reolace{
            width: 90px;
            height: 42px;
            line-height: 42px;
            color: rgb(255, 255, 255, 1);
            padding: 0 12px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            font-size: 16px;
            margin: 20px auto 0 auto;
            .actions-icon{
              margin-right: 10px;
              font-size: 16px;
            }
            .actions-text{
              font-size: 14px;
            }
          }
        }

        .file-info {
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .circular-progress {
            width: 60px;
            height: 60px;
            margin-top: 30px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            :deep(.el-progress) {
              width: 60px;
              height: 60px;
            }
            :deep(.el-progress-circle) {
              width: 60px !important;
              height: 60px !important;
            }
            :deep(.el-progress__text) {
              font-size: 12px;
              text-align: center;
              color: rgba(255, 255, 255, 0.7);
            }
            :deep(.el-progress-circle__path) {
              stroke: rgb(255, 255, 255, .7);
            }
          }
          .file-upload-tip {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            margin: 10px 0;
            p {
              margin: 0;
              font-size: 14px;
            }
          }
          .file-info-detail {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            p {
              margin: 0;
              font-size: 14px;
            }
          }
          /* 优化文字类文件样式 */
          .text-file-card {
            display: flex;
            align-items: center;
            padding: 16px;
            width: calc(100% - 32px);

            .file-meta {
              flex: 1;
              width: 0;
              .file-meta-main{
                width: 100%;
                height: 42px;
                display: flex;
                .item-main-flex-head{
                  width: 130px;
                  height: auto;
                  flex-shrink: 0;
                  .head-main{
                    width: 100%;
                    display: flex;
                    .item-main-icon{
                      width: 50px;
                      height: auto;
                      flex-shrink:0;
                      margin-right: 8px;
                      text-align: center;
                      line-height: 40px;
                      i{
                        font-size: 22px;
                        color: rgba(225,225,225,0.7);
                        display: block;
                        line-height: 40px;
                      }
                    }
                    .item-main-name{
                      flex: 1;
                      width: 0;
                      font-size: 14px;
                      color: rgba(225,225,225,0.7);
                      line-height: 40px;
                      text-align: left;
                    }
                  }
                }
                .item-main-content{
                  flex: 1;
                  width: 0;
                  height: auto;
                  .file-meta-content{
                    width: calc(100% - 20px);
                    display: flex;
                    padding-right: 20px;
                    justify-content: space-between;
                    line-height: 42px;
                    .file-name {
                      color: white;
                      margin: 0;
                      font-size: 14px;
                      max-width: 200px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }
                    .file-size {
                      color: rgba(255, 255, 255, 0.6);
                      margin-left: 10px;
                      font-size: 12px;
                    }
                  }
                }
              }
            }
            .text-file-actions {
              width: 230px;
              flex-shrink: 0;
              display: flex;
              padding-left: 20px;
              justify-content: space-between;
              .actions-but {
                width: auto;
                height: 42px;
                line-height: 42px;
                color: rgb(255, 255, 255, 1);
                padding: 0 12px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                font-size: 16px;
                .actions-icon{
                  margin-right: 10px;
                  font-size: 16px;
                }
                .actions-text{
                  font-size: 14px;
                }
              }
            }
          }

          /* 调整文件操作按钮位置 */
          .file-actions {
            position: absolute;
            bottom: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
            width: 100%;
            padding: 16px;
            justify-content: flex-end;
          }
        }

        .file-actions {
          width: 100%;
          height: 30px;
          border-radius: 0 0 18px 18px;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          background: rgba(0, 0, 0, 0.3);
          background: rgba(229, 229, 229, 0.08);
          backdrop-filter: blur(40px);
          display: flex;
          .file-action-item {
            flex: 1;
            width: 0;
            font-size: 14px;
            text-align: center;
            line-height: 30px;
            color: rgba(255, 255, 255, .7);
            border: none;
            cursor: pointer;
            &:hover {
              color: rgba(255, 255, 255, 1);
            }
          }
          .cover-option-split{
            width: 1px;
            height: 16px;
            margin: 7px 0;
            background: rgb(255, 255, 255, .7);
          }
        }
      }
    }

    .add-more-files {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $gap;
      margin-top: 10px;
      margin-bottom: 18px;
      p {
        margin: 0;
        font-size: 14px;
        color: rgb(255, 255, 255, .7);
      }

      .add-more-files-btn {
        padding: 5px 10px;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        i{
          font-size: 14px;
          color: rgb(255, 255, 255, .7);
        }
        span{
          font-size: 14px;
          margin-left: 10px;
          display: inline-block;
        }
      }
    }
  }
  .hidden-file-input {
    display: none;
  }
}
</style>