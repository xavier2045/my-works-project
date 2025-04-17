<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  videoUrls: string[];  // 传入的视频URL数组
  cover: string;        // 传入的视频封面图
}>();

const isPlaying = ref(false);

const videoRef = ref<HTMLVideoElement | null>(null);

// 切换播放/暂停
function togglePlay() {
  if (videoRef.value) {
    if (videoRef.value.paused) {
      videoRef.value.play();
    } else {
      videoRef.value.pause();
    }
    isPlaying.value = !isPlaying.value;
  }
}
</script>

<template>
  <div class="video-container">
    <!-- 使用 video 标签的 poster 属性设置封面图 -->
    <video 
      ref="videoRef"
      :src="videoUrls[0]" 
      :poster="cover" 
      controls 
      autoplay 
      @play="isPlaying = true" 
      @pause="isPlaying = false"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<style lang="scss" scoped>
.video-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    overflow: hidden;
    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 18px;
        object-fit: contain; /* 保证封面图和视频显示完整，不会撑开容器 */
    }
}


</style>
