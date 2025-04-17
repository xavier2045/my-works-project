<template>
  <div class="file-viewer">
    <!-- 背景模糊层 -->
    <div 
      v-if="cover" 
      class="background-cover"
      :style="{ backgroundImage: `url(${cover})` }"
    ></div>

    <div 
      class="file-content-container" 
      ref="contentContainer"
      @scroll="handleScroll"
      :style="{ maxHeight: containerHeight }"
    >
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loader"></div>
      </div>

      <!-- 文本内容 -->
      <pre 
        v-if="fileContent && isText" 
        class="text-content"
        :class="{ 'scrollable': isContentOverflow }"
      >{{ fileContent }}</pre>

      <!-- 富文本内容 -->
      <div 
        v-else-if="docxContent" 
        class="rich-text-content"
        v-html="docxContent"
        :class="{ 'scrollable': isContentOverflow }"
      ></div>

      <!-- PDF预览 -->
      <div v-else-if="isPdf" class="pdf-container">
        <embed 
          :src="fileUrl" 
          type="application/pdf" 
          width="100%" 
          height="100%"
        />
      </div>

      <!-- 图片预览 -->
      <img
        v-else-if="isImage"
        :src="fileUrl"
        alt="File preview"
        class="image-preview"
        @load="handleImageLoad"
      />

      <!-- 不支持的类型 -->
      <div v-else class="unsupported-message">
        {{ supportMessage }}
      </div>
    </div>

    <!-- 智能进度条 -->
    <div 
      v-if="showProgressBar" 
      class="smart-progress-bar"
      :style="{ opacity: isScrolling ? 1 : 0 }"
    >
      <div 
        class="progress-indicator" 
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import * as mammoth from 'mammoth';

const props = defineProps({
  fileUrl: Array as () => string[],
  cover: String,
  containerHeight: {
    type: String,
    default: '80vh'
  }
});

// 响应式状态
const isLoading = ref(true);
const isScrolling = ref(false);
const fileUrl = ref(props.fileUrl?.[0] || '');
const progress = ref(0);
const scrollTimeout = ref<number>();
const contentContainer = ref<HTMLElement | null>(null);

// 内容存储
const fileContent = ref('');
const docxContent = ref('');
const supportMessage = ref('');





// 计算属性
const fileExtension = computed(() => {
  const parts = fileUrl.value.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
});

const isText = computed(() => fileExtension.value === 'txt');
const isPdf = computed(() => fileExtension.value === 'pdf');
const isImage = computed(() => 
  ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension.value)
);
const isWord = computed(() => 
  ['doc', 'docx'].includes(fileExtension.value)
);

const showProgressBar = computed(() => 
  isContentOverflow.value && (isText.value || isWord.value)
);

const isContentOverflow = computed(() => {
  if (!contentContainer.value) return false;
  return contentContainer.value.scrollHeight > contentContainer.value.clientHeight;
});

// 方法
const loadContent = async () => {
  try {
    isLoading.value = true;
    
    if (isText.value) {
      const response = await fetch(fileUrl.value);
      fileContent.value = await response.text();
    }
    else if (isWord.value) {
      const response = await fetch(fileUrl.value);
      const result = await mammoth.convertToHtml({ 
        arrayBuffer: await response.arrayBuffer() 
      });
      docxContent.value = result.value;
    }
  } catch (error) {
    console.error('文件加载失败:', error);
    supportMessage.value = '内容加载失败，请尝试重新加载';
  } finally {
    isLoading.value = false;
    await nextTick();
    updateProgress();
  }
};

const handleScroll = () => {
  isScrolling.value = true;
  updateProgress();
  clearTimeout(scrollTimeout.value);
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false;
  }, 1000);
};

const updateProgress = () => {
  if (!contentContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = contentContainer.value;
  progress.value = (scrollTop / (scrollHeight - clientHeight)) * 100;
};

// 生命周期
onMounted(() => {
  loadContent();
  window.addEventListener('resize', updateProgress);
});

watch(() => props.fileUrl, (urls) => {
  fileUrl.value = urls?.[0] || '';
  loadContent();
});
</script>

<style lang="scss" scoped>
.file-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.background-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.8);
  z-index: 0;
}

.file-content-container {
  width: 70%;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;
  position: relative;
  background: rgba(255,255,255,0.95);
  border-radius: 12px;
  z-index: 1;
  transition: max-height 0.3s ease;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.text-content {
  font-family: 'Segoe UI', system-ui;
  line-height: 1.8;
  padding: 32px;
  font-size: 16px;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

.rich-text-content {
  padding: 20px;
  /* 保留Word文档样式 */
  :deep(p) {
    margin: 1em 0;
    line-height: 1.6;
  }
  
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
  }
}

.pdf-container {
  height: 80vh;
  embed {
    height: 100%;
  }
}

.image-preview {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.smart-progress-bar {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 4px;
  background: rgba(0,0,0,0.1);
  border-radius: 2px;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.progress-indicator {
  height: 100%;
  background: linear-gradient(90deg, #2196f3, #64b5f6);
  border-radius: 2px;
  transition: width 0.2s ease;
}

.loading-overlay {
  /* 保持原有加载样式 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-content-container {
    border-radius: 8px;
  }
  
  .text-content, .rich-text-content {
    width: 100%;
    height: 100%;
    font-size: 14px;
  }
  
  .smart-progress-bar {
    width: 80%;
  }
}
</style>