import { ref, computed, nextTick, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { formatTimeDisplay } from '@/utils/formatTime';

export function useChatMessages(chat, scrollRef) {
  const store = useStore();
  const route = useRoute();
  
  // References for message handling
  const messageList = ref([]);
  const unreadMessageCount = ref(0);
  const selectedMessage = ref(null);
  const isLoading = ref(false);
  const noMoreMessages = ref(false);
  const scrollToBottomFlag = ref(true);
  const isScrollingUp = ref(false);
  
  // Computed properties for message display
  const filteredMessages = computed(() => {
    if (!chat.value?.id) return [];
    
    const messages = store.state.webSocket.messages[chat.value.id] || [];
    return messages.filter(msg => !msg.isDeleted);
  });
  
  const groupedMessages = computed(() => {
    if (!filteredMessages.value.length) return [];
    
    // Group messages by date for timestamp display
    const groups = [];
    let currentGroup = null;
    
    filteredMessages.value.forEach((message) => {
      // Format the date for display
      const date = new Date(message.sendTime);
      const timeString = formatTimeDisplay(date);
      
      // Check if we need a new group based on time or sender
      const needNewGroup = !currentGroup || 
                          currentGroup.senderId !== message.senderId ||
                          date - new Date(currentGroup.messages[currentGroup.messages.length - 1].sendTime) > 300000; // 5 minutes
      
      if (needNewGroup) {
        currentGroup = {
          id: message.id,
          senderId: message.senderId,
          timeString,
          messages: [message]
        };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(message);
      }
    });
    
    return groups;
  });
  
  // Load initial messages
  const loadInitialMessages = async () => {
    if (!chat.value?.id) return;
    
    isLoading.value = true;
    
    try {
      // Check if we already have messages for this chat
      const existingMessages = store.state.webSocket.messages[chat.value.id] || [];
      
      if (existingMessages.length === 0) {
        // Load messages from server
        await store.dispatch('webSocket/fetchMessages', {
          chatId: chat.value.id,
          chatType: chat.value.type,
          page: 1
        });
      }
      
      // Reset unread count for this chat
      store.commit('webSocket/setUnreadCount', {
        chatId: chat.value.id,
        count: 0
      });
      
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load initial messages:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Load more messages (for pagination)
  const loadMoreMessages = async () => {
    if (!chat.value?.id || isLoading.value || noMoreMessages.value) return;
    
    isLoading.value = true;
    isScrollingUp.value = true;
    scrollToBottomFlag.value = false;
    
    try {
      const existingMessages = store.state.webSocket.messages[chat.value.id] || [];
      const oldestMessage = existingMessages[0];
      
      if (!oldestMessage) {
        noMoreMessages.value = true;
        return;
      }
      
      // Get the current scroll position before loading more
      const scrollContainer = scrollRef.value;
      const scrollHeight = scrollContainer.scrollHeight;
      
      // Fetch older messages
      const result = await store.dispatch('webSocket/fetchOlderMessages', {
        chatId: chat.value.id,
        chatType: chat.value.type,
        beforeId: oldestMessage.id
      });
      
      // If no more messages were fetched, mark as complete
      if (!result || result.length === 0) {
        noMoreMessages.value = true;
      }
      
      // Maintain scroll position
      await nextTick();
      const newScrollHeight = scrollContainer.scrollHeight;
      scrollContainer.scrollTop = newScrollHeight - scrollHeight;
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      isLoading.value = false;
      isScrollingUp.value = false;
    }
  };
  
  // Handle message selection
  const selectMessage = (message) => {
    selectedMessage.value = message;
  };
  
  const clearSelectedMessage = () => {
    selectedMessage.value = null;
  };
  
  // Message scroll handling
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    
    // Check if scrolling near the top to load more messages
    if (scrollTop < 50 && !isLoading.value && !noMoreMessages.value) {
      loadMoreMessages();
    }
    
    // Check if scrolled to bottom
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    scrollToBottomFlag.value = isAtBottom;
    
    // Reset unread count when scrolled to bottom
    if (isAtBottom && unreadMessageCount.value > 0) {
      unreadMessageCount.value = 0;
      store.commit('webSocket/setUnreadCount', {
        chatId: chat.value.id,
        count: 0
      });
    }
  };
  
  const scrollToBottom = async () => {
    await nextTick();
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
      scrollToBottomFlag.value = true;
    }
  };
  
  // Watch for new messages and scroll to bottom if needed
  watch(() => store.state.webSocket.messages[chat.value?.id], async (newMessages, oldMessages) => {
    if (!newMessages || !oldMessages) return;
    
    // If new messages were added
    if (newMessages.length > oldMessages.length) {
      const lastMessage = newMessages[newMessages.length - 1];
      
      // If we're already scrolled to bottom or the message is from current user
      if (scrollToBottomFlag.value || lastMessage.senderId === store.state.user.userInfo.id) {
        await scrollToBottom();
      } else {
        // Increment unread count for messages not yet seen
        unreadMessageCount.value += 1;
      }
    }
  }, { deep: true });
  
  // Watch for chat changes to load messages
  watch(() => chat.value?.id, async (newChatId) => {
    if (newChatId) {
      // Reset states
      unreadMessageCount.value = 0;
      selectedMessage.value = null;
      noMoreMessages.value = false;
      scrollToBottomFlag.value = true;
      
      // Load messages for the new chat
      await loadInitialMessages();
    }
  });
  
  return {
    messageList,
    filteredMessages,
    groupedMessages,
    unreadMessageCount,
    selectedMessage,
    isLoading,
    noMoreMessages,
    scrollToBottomFlag,
    isScrollingUp,
    loadInitialMessages,
    loadMoreMessages,
    selectMessage,
    clearSelectedMessage,
    handleScroll,
    scrollToBottom
  };
} 