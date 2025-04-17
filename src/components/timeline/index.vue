<template>
    <div class="parent">
      <div v-for="(group, index) in groupedData" :key="index" class="group">
        <div v-for="(item, idx) in group" :key="idx" class="item">
          {{ item }}
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    setup() {
      // 原始数据
      const data = [1, 2, 3, 4, 5, 6, 7];
  
      // 将数据每两项分为一组
      const groupedData = computed(() => {
        const result = [];
        for (let i = 0; i < data.length; i += 2) {
          result.push(data.slice(i, i + 2));
        }
        return result;
      });
  
      return {
        groupedData,
      };
    },
  });
  </script>
  
  <style scoped>
  .parent {
    display: flex; /* 外层横向排列 */
    flex-wrap: wrap; /* 允许折行 */
  }
  
  .group {
    display: flex;
    flex-direction: column; /* 组内垂直排列 */
    margin-right: 20px; /* 每组之间的间距 */
  }
  
  .item {
    width: 100px;
    height: 100px;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px; /* 每个 item 之间的垂直间距 */
  }
  </style>
  