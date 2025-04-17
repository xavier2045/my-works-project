<template>
  <div class="empty-chat-content">
    <div class="empty-chat-icon">💬</div>
    <h3>Select a contact to start chatting</h3>
    <p>Choose a friend from the list to begin a conversation</p>
  </div>
</template>

<script setup lang="ts">
// This component is a stateless UI component
</script>

<style lang="scss" scoped>
.empty-chat-content {
  text-align: center;
  padding: 32px;
  max-width: 400px;
  
  .empty-chat-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  h3 {
    margin: 0 0 8px;
    font-size: 18px;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #999;
    font-size: 14px;
  }
}
</style> 