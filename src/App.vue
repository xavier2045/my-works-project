<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
    <router-view :key="$route.fullPath" />
  <!-- <transition name="shatter" mode="out-in">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </transition> -->
  <!-- <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view> -->
</template>

<style scoped>
  html,body{width: 100%; height: 100%;font-family: 'PingFang SC' !important;}

  img{
    width: 100%;
    height: 100%;
    /* 使图片保持原始宽高比填充容器 */
    object-fit: cover;
    /* 图片内容居中对齐 */
    object-position: center;
    /* 确保图片占据其父容器的全部空间 */
  }
  /* 破碎效果 */
  @keyframes shatter {
    0% {
      transform: translate(0, 0) rotate(0);
      opacity: 1;
    }
    100% {
      transform: translate(var(--random-x, 0), var(--random-y, 0)) rotate(var(--random-angle, 0));
      opacity: 0;
    }
  }

  .shatter-enter-active,
  .shatter-leave-active {
    position: relative;
    animation: shatter 1s forwards;
    --random-x: calc(50vw - 100vw * var(--rand-x));
    --random-y: calc(50vh - 100vh * var(--rand-y));
    --random-angle: calc(720deg * var(--rand-angle));
  }

  .shatter-enter-from,
  .shatter-leave-to {
    opacity: 0;
    transform: translate(0, 0) rotate(0);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
</style>

function defineExpose(arg0: { beforeEnter: (el: HTMLElement) => void; enter: (el: HTMLElement, done: () => void) => void; leave: (el: HTMLElement, done: () => void) => void; }) {
  throw new Error('Function not implemented.');
}

function defineExpose(arg0: { beforeEnter: (el: HTMLElement) => void; enter: (el: HTMLElement, done: () => void) => void; leave: (el: HTMLElement, done: () => void) => void; }) {
  throw new Error('Function not implemented.');
}
