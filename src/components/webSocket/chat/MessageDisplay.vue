<template>
  <div class="messages-container" ref="containerRef">
    <div v-if="messages.length === 0" class="empty-state">
      <p>No messages yet. Start a conversation!</p>
    </div>
    <template v-else>
      <div v-for="message in messages" :key="message.messageId" class="message-wrapper">
        <MessageBubble
          :message="message"
          :is-from-current-user="message.sendId === currentUserId"
          :avatar-url="getAvatarUrl(message.sendId)"
          :sender-name="getSenderName(message.sendId)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUpdated, nextTick, defineProps, PropType } from 'vue';
import MessageBubble from './MessageBubble.vue';
import { ChatMessage } from '@/utils/messageFormatter';

interface Props {
  messages: ChatMessage[];
  currentUserId: string;
  friendsList: Array<{
    friendId: string;
    friendNickName: string;
    friendAvatar: string;
  }>;
}

const props = defineProps<Props>();
const containerRef = ref<HTMLDivElement | null>(null);

// Get the avatar URL for a user
const getAvatarUrl = (userId: string): string => {
  if (userId === props.currentUserId) {
    return ''; // Current user's avatar - could be from a store or prop
  }
  
  const friend = props.friendsList.find(f => f.friendId === userId);
  return friend ? friend.friendAvatar : '';
};

// Get the name for a user
const getSenderName = (userId: string): string => {
  if (userId === props.currentUserId) {
    return 'Me';
  }
  
  const friend = props.friendsList.find(f => f.friendId === userId);
  return friend ? friend.friendNickName : 'Unknown';
};

// Scroll to the bottom when new messages arrive
const scrollToBottom = () => {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight;
    }
  });
};

// Scroll to bottom on messages change
watchEffect(() => {
  if (props.messages.length) {
    scrollToBottom();
  }
});

onMounted(scrollToBottom);
onUpdated(scrollToBottom);
</script>

<style lang="scss" scoped>
.messages-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background-color: #f7f7f7;
  scroll-behavior: smooth;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 14px;
  
  p {
    background-color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
}

.message-wrapper {
  margin-bottom: 8px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 