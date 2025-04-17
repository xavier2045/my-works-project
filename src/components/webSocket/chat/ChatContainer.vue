<template>
  <div class="chat-container">
    <div class="sidebar">
      <FriendsList
        :friends="friends"
        :active-friend-id="activeChatId"
        :unread-counts="unreadCounts"
        :last-messages="lastMessages"
        @select-friend="handleSelectFriend"
      />
    </div>
    
    <div class="chat-area">
      <div v-if="!activeChatId" class="empty-chat">
        <EmptyChatPlaceholder />
      </div>
      
      <div v-else class="active-chat">
        <ChatHeader :active-friend-name="getActiveFriendName()" />
        
        <MessageDisplay
          :messages="filteredMessages"
          :current-user-id="userId"
          :friends-list="friends"
        />
        
        <MessageInput @send-message="handleSendMessage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import FriendsList from './FriendsList.vue';
import MessageDisplay from './MessageDisplay.vue';
import MessageInput from './MessageInput.vue';
import EmptyChatPlaceholder from './EmptyChatPlaceholder.vue';
import ChatHeader from './ChatHeader.vue';
import { useChatContainer } from '@/hooks/useChatContainer';

// Use a composable to handle chat container logic
const {
  userId,
  activeChatId,
  friends,
  filteredMessages,
  unreadCounts,
  lastMessages,
  getActiveFriendName,
  handleSelectFriend,
  handleSendMessage
} = useChatContainer();
</script>

<style lang="scss" scoped>
@import './styles/ChatContainer.scss';
</style> 