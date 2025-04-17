<template>
  <div :class="['message-wrapper', isFromCurrentUser ? 'current-user' : 'other-user']">
    <img v-if="!isFromCurrentUser" class="avatar" :src="avatarUrl" alt="User avatar" />
    <div class="message-content">
      <div v-if="!isFromCurrentUser" class="sender-name">{{ senderName }}</div>
      <div class="message-bubble" v-html="renderedMessage"></div>
      <div class="message-time">{{ formattedTime }}</div>
    </div>
    <img v-if="isFromCurrentUser" class="avatar" :src="avatarUrl" alt="User avatar" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { renderMessageContent, ChatMessage } from '@/utils/messageFormatter';
import { isMessageFromCurrentUser } from '@/utils/chatUtils';

export default defineComponent({
  name: 'MessageBubble',
  props: {
    message: {
      type: Object as () => ChatMessage,
      required: true
    },
    currentUserId: {
      type: String,
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isFromCurrentUser = computed(() => 
      isMessageFromCurrentUser(props.message, props.currentUserId)
    );

    const formattedTime = computed(() => {
      const messageDate = new Date(props.message.createTime);
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    const renderedMessage = computed(() => 
      renderMessageContent(props.message)
    );

    return {
      isFromCurrentUser,
      formattedTime,
      renderedMessage
    };
  }
});
</script>

<style scoped lang="scss">
.message-wrapper {
  display: flex;
  margin-bottom: 16px;
  width: 100%;
  
  &.current-user {
    flex-direction: row-reverse;
    
    .message-content {
      align-items: flex-end;
    }
    
    .message-bubble {
      background-color: #95ec69;
      border-radius: 16px 4px 16px 16px;
    }
  }
  
  &.other-user .message-bubble {
    background-color: #ffffff;
    border-radius: 4px 16px 16px 16px;
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 8px;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}

.sender-name {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.message-bubble {
  padding: 8px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  
  img, video {
    max-width: 100%;
    border-radius: 8px;
  }
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}
</style> 