<template>
  <div class="chat-app-container">
    <ChatContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import ChatContainer from './chat/ChatContainer.vue';
import WebSocketService from '@/services/WebSocketService';
import { aeUseStore } from '@/stores/user';
import { getItem } from '@/utils/index';

    const userStore = aeUseStore();
const wsService = WebSocketService.getInstance();

onMounted(() => {
  // Initialize service if not already connected
  if (wsService.isDisconnected) {
    const websocketUrl = import.meta.env.VITE_WS_URL;
    const uuid = userStore.userInfo.uuid || getItem('uuid');
    const token = userStore.userInfo.token || getItem('token');
    
    if (uuid && token) {
      wsService.connect(websocketUrl, 300000, uuid, token);
    }
  }
});

    onBeforeUnmount(() => {
  // No need to disconnect WebSocket on unmount since it's a singleton service
  // that should maintain connection across page navigation
});
</script>

<style lang="scss">
.chat-app-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
