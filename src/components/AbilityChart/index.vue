<template>
    <div class="ability-graph">
      <div class="ability-container">
        <svg class="connections">
          <g class="connection-lines"></g>
          <g class="pulse-dots"></g>
        </svg>
        <div class="main-circle" ref="mainCircleRef">
          {{ mainText }}
          <div class="nucleus"></div>
          <div class="cytoplasm"></div>
        </div>
      </div>
  
      <div class="bottom-text" v-if="companyInfo">
        <div class="company-name">{{ companyInfo.name }}</div>
        <div class="company-cn">{{ companyInfo.cnName }}</div>
        <div class="slogan">{{ companyInfo.slogan }}</div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import type { AbilityGraphProps } from './types';
  import { NUCLEUS_COLORS, DEFAULT_ABILITIES } from './constants';
  import { useAbilityCircles } from './composables/useAbilityCircles';
  import { useCleanup } from './composables/useCleanup';
  import { useResizeHandler } from './composables/useResizeHandler';
  
  // Props定义
  const props = withDefaults(defineProps<AbilityGraphProps>(), {
    abilities: () => DEFAULT_ABILITIES,
    mainText: 'Who are you?',
    companyInfo: undefined
  });
  
  // Refs
  const mainCircleRef = ref<HTMLElement | null>(null);
  
  // Composables
  const { createAbilityCircles } = useAbilityCircles(props.abilities);
  const { cleanup } = useCleanup();
  const { initResizeHandler } = useResizeHandler(cleanup, createAbilityCircles);
  
  // 生命周期
  onMounted(() => {
    createAbilityCircles();
    initResizeHandler();
  });
  
  onUnmounted(() => {
    cleanup();
  });
  
  // 监听props变化
  watch(() => props.abilities, () => {
    cleanup();
    createAbilityCircles();
  }, { deep: true });
  </script>
  
  <style lang="scss" scoped>
  // 导入原有样式，转换为SCSS
  @use './styles/main.scss';
  @use './styles/animations.scss';
  </style> 