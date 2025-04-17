<template>
    <div 
      class="carousel-container" 
      @mouseover="pauseCarousel" 
      @mouseleave="resumeCarousel">
      <div 
        class="carousel-wrapper" 
        :class="directionClass">
        <template v-if="images.length > 0">
          <div
            v-for="(item, index) in images"
            :key="item.id"
            class="carousel-item"
            :style="getItemStyle(index)">
            <template v-if ="item.avatar == '' || item.avatar == null">
              <div class="image-error">
                <img src="@/assets/images/common/default.png" alt="Default Image" />
              </div>
            </template>
            <template v-else>
              <el-image
                :src="item.avatar"
                fit="cover"
              >
                <template #error>
                  <div class="image-error">
                    <img src="@/assets/images/common/default.png" alt="Default Image" />
                  </div>
                </template>
              </el-image>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="carousel-item">
            <div class="image-error">
              <img src="@/assets/images/common/default.png" alt="Default Image" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue';
  
  export default defineComponent({
    name: 'Carousel',
    props: {
      images: {
        type: Array as () => { id: number, name: string, avatar: string; type: number }[],
        required: true
      },
      speed: {
        type: Number,
        default: 3000 // Speed in milliseconds
      },
      direction: {
        type: String,
        default: 'vertical', // 'horizontal' or 'vertical'
      },
    },
    setup(props) {
      const currentIndex = ref(0);
      let interval: ReturnType<typeof setInterval> | null = null;
  
      const directionClass = computed(() => {
        return props.direction === 'horizontal' ? 'horizontal' : 'vertical';
      });
  
      const startCarousel = () => {
        interval = setInterval(() => {
          currentIndex.value = (currentIndex.value + 1) % props.images.length;
        }, props.speed);
      };
  
      const pauseCarousel = () => {
        if (interval) clearInterval(interval);
      };
  
      const resumeCarousel = () => {
        startCarousel();
      };
  
      const getItemStyle = (index: number) => {
        const positionOffset = (index - currentIndex.value + props.images.length) % props.images.length;
        const zIndex = props.images.length - positionOffset;
        const opacity = 1 - positionOffset * 0.3;
  
        if (props.direction === 'horizontal') {
          return {
            zIndex,
            transform: `translateX(${positionOffset * 7}%)`,
            left: `${positionOffset * 7}%`,
            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
            opacity,
            width: '70%',
            height: '100%',
          };
        } else {
          return {
            zIndex,
            transform: `translateY(${positionOffset * 7}%)`,
            top: `${positionOffset * 7}%`,
            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
            opacity,
            width: '100%',
            height: '70%',
          };
        }
      };
  
      onMounted(() => {
        startCarousel();
      });
  
      onBeforeUnmount(() => {
        if (interval) clearInterval(interval);
      });
  
      return {
        directionClass,
        pauseCarousel,
        resumeCarousel,
        getItemStyle
      };
    }
  });
  </script>
  
  <style scoped>
  .carousel-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .carousel-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .carousel-wrapper.horizontal {
    flex-direction: row;
  }
  
  .carousel-item {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: transform 0.5s ease-in-out, z-index 0.3s ease, opacity 0.5s ease-in-out;
    cursor: pointer;
  }
  
  .carousel-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 28px;
  }

  .carousel-item .el-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 28px;
  }
  .image-error{
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    object-fit: cover;
    border-radius: 28px;
    background-color: rgb(255, 255, 255, .02);
    backdrop-filter: blur(32px);
    box-shadow: 8px 8px 18px 8px rgb(0, 0, 0, .18);
    border: 1px solid rgba(255, 255, 255, .38);
  }
  
  .carousel-caption {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
  }
  :deep(.el-image__placeholder) {
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    border-radius: 28px;
    background-color: rgb(255, 255, 255, .02);
    backdrop-filter: blur(32px);
    box-shadow: 8px 8px 18px 8px rgb(0, 0, 0, .18);
    border: 1px solid rgba(255, 255, 255, .38);
  }
  </style>
  