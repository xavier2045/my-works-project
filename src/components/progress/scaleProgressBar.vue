<template>
    <div class="progress-container">
      <div class="progress-ticks">
        <div
          v-for="(tick, index) in ticks"
          :key="index"
          class="tick"
          :style="tickStyle(index)"
        ></div>
      </div>
      <div class="progress-bar" :style="{ width: progressWidth }"></div>
      <div class="progress-value" v-if="showPercentage">{{ progress }}%</div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'ProgressBar',
    props: {
      max: {
        type: Number,
        required: true,
      },
      progress: {
        type: Number,
        required: true,
      },
      showPercentage: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      const progressWidth = computed(() => {
        return (props.progress / props.max) * 100 + '%';
      });
  
      const ticks = computed(() => {
        const numTicks = Math.min(props.max, 50); // 最多50根刻度线
        return Array.from({ length: numTicks });
      });
  
      const tickStyle = (index: number) => {
        const isMajorTick = index === 0 || index === ticks.value.length - 1 || index % 4 === 0;
        const left = (index / (ticks.value.length - 1)) * 100 + '%';
        const backgroundColor = (props.progress / props.max) * 100 >= parseFloat(left) ? '#ffffff' : '#888';
        return {
          left,
          width: '2px',
          height: isMajorTick ? '10px' : '5px',
          backgroundColor,
          position: 'absolute',
          bottom: 0,
        };
      };
  
      return { progressWidth, ticks, tickStyle };
    },
  });
  </script>
  
  <style scoped>
  .progress-container {
    width: 100%;
    height: 20px;
    background-color: transparent;
    overflow: hidden;
    position: relative;
  }
  
  .progress-bar {
    height: 5px; /* 进度条高度为 5px */
    background-color: rgba(255, 255, 255, 0.38); /* 修改背景色 */
    position: absolute;
    bottom: 0;
    z-index: 1; /* 确保进度条在刻度线下方 */
  }
  
  .progress-ticks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
  }
  
  .tick {
    position: absolute;
    bottom: 0;
  }
  
  .progress-value {
    position: absolute;
    top: -20px; /* 调整位置，使其显示在刻度线上方 */
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: #000;
    z-index: 2; /* 确保进度数值在最上方 */
  }
  </style>