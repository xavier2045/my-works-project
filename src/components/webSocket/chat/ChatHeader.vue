<template>
  <div class="chat-header">
    <h2>{{ activeFriendName }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeFriendName: string;
}>();
</script>

<style lang="scss" scoped>
.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  
  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}
</style> 