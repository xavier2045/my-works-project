<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  images: string[];
  viewed: boolean[];
}>();

const currentIndex = ref(0);
const isHovered = ref(false);

function handleHover(hover: boolean) {
  isHovered.value = hover;
}

// 监听当前展示图片变化，确保背景图更新
watch(currentIndex, () => {
  // 更新背景图的样式
});
</script>

<template>
  <div class="carousel-container">
    <!-- 轮播图 -->
    <el-carousel 
      v-bind="{
        height: '100%',
        trigger: 'hover',
        autoplay: !isHovered, 
        interval: 5000,
        arrow: 'never' // 隐藏左右箭头 never always
      }"
      class="carousel"
      @mouseover="handleHover(true)"
      @mouseleave="handleHover(false)"
      @change="currentIndex = $event"
    >
      <el-carousel-item v-for="(image, index) in images" :key="index">
        <img :src="image" alt="Carousel Image" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
    
    <!-- 背景模糊效果 -->
    <div class="background-image" :style="{'background-image': `url(${images[currentIndex]})`}" />
  </div>
  
  <div class="indicators">
    <span 
      v-for="(viewed, index) in viewed" 
      :key="index" 
      :class="{ 'viewed': viewed, 'unviewed': !viewed }" 
      @click="currentIndex = index"
    ></span>
  </div>
</template>

<style lang="scss" scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  overflow: hidden; /* 防止背景图溢出 */
}

.carousel {
  position: relative;
  z-index: 1; /* 使轮播图处于最上层 */
  height: 100%; /* 轮播图高度填满容器 */
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 图片自适应容器 */
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0; /* 确保背景图在轮播图下方 */
  background-size: cover;
  background-position: center;
  filter: blur(40px); /* 模糊背景 */
  transition: background-image 0.5s ease-in-out;
}

.indicators {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc; /* Unviewed (gray) */
}

.indicators .viewed {
  background: #fff; /* Viewed (white) */
}
</style>
