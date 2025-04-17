import { ref, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export function useChatInput(chat, scrollToBottom) {
  const store = useStore();
  
  // Input state
  const messageInput = ref('');
  const isTyping = ref(false);
  const isSending = ref(false);
  const inputRef = ref(null);
  const selectedFiles = ref([]);
  const isEmojiPickerVisible = ref(false);
  
  // Focus the input field
  const focusInput = () => {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });
  };
  
  // Generate temporary ID for messages
  const generateTempId = () => {
    return `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };
  
  // Handle text message sending
  const sendTextMessage = async () => {
    if (!messageInput.value.trim() || isSending.value) return;
    
    const messageText = messageInput.value.trim();
    messageInput.value = '';
    isSending.value = true;
    
    try {
      const tempId = generateTempId();
      const currentUser = store.state.user.userInfo;
      
      // Create message object
      const messageData = {
        id: tempId,
        content: messageText,
        type: 'TEXT',
        senderId: currentUser.id,
        senderName: currentUser.nickname,
        senderAvatar: currentUser.avatar,
        sendTime: new Date().toISOString(),
        status: 'SENDING',
        isTemp: true
      };
      
      // Add target info depending on chat type
      if (chat.value.type === 'GROUP') {
        messageData.chatId = chat.value.id;
        messageData.groupId = chat.value.targetId;
      } else {
        messageData.chatId = chat.value.id;
        messageData.receiverId = chat.value.targetId;
      }
      
      // Add to local message list first for immediate display
      store.commit('webSocket/addMessage', {
        chatId: chat.value.id,
        message: messageData
      });
      
      // Move this chat to top of recent chats
      store.dispatch('webSocket/moveToTop', chat.value.id);
      
      // Scroll to bottom to show new message
      scrollToBottom();
      
      // Send to server
      await store.dispatch('webSocket/sendMessage', {
        chatId: chat.value.id,
        chatType: chat.value.type,
        content: messageText,
        messageType: 'TEXT',
        tempId
      });
      
    } catch (error) {
      console.error('Failed to send message:', error);
      ElMessage.error('发送消息失败，请重试');
    } finally {
      isSending.value = false;
      focusInput();
    }
  };
  
  // Send file/image messages
  const sendFileMessage = async (file, type = 'FILE') => {
    if (!file || isSending.value) return;
    
    isSending.value = true;
    
    try {
      const tempId = generateTempId();
      const currentUser = store.state.user.userInfo;
      
      // Create message object with file data
      const messageData = {
        id: tempId,
        type,
        senderId: currentUser.id,
        senderName: currentUser.nickname,
        senderAvatar: currentUser.avatar,
        sendTime: new Date().toISOString(),
        status: 'SENDING',
        isTemp: true,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };
      
      if (type === 'IMAGE') {
        // Create preview for images
        messageData.content = URL.createObjectURL(file);
      } else {
        messageData.content = file.name;
      }
      
      // Add target info depending on chat type
      if (chat.value.type === 'GROUP') {
        messageData.chatId = chat.value.id;
        messageData.groupId = chat.value.targetId;
      } else {
        messageData.chatId = chat.value.id;
        messageData.receiverId = chat.value.targetId;
      }
      
      // Add to local message list first
      store.commit('webSocket/addMessage', {
        chatId: chat.value.id,
        message: messageData
      });
      
      // Move chat to top
      store.dispatch('webSocket/moveToTop', chat.value.id);
      
      // Scroll to show new message
      scrollToBottom();
      
      // Upload and send via store action
      await store.dispatch('webSocket/sendFileMessage', {
        chatId: chat.value.id,
        chatType: chat.value.type,
        file,
        messageType: type,
        tempId
      });
      
    } catch (error) {
      console.error('Failed to send file:', error);
      ElMessage.error('文件发送失败，请重试');
    } finally {
      isSending.value = false;
      focusInput();
    }
  };
  
  // Handle emoji selection
  const insertEmoji = (emoji) => {
    messageInput.value += emoji;
    isEmojiPickerVisible.value = false;
    focusInput();
  };
  
  // Toggle emoji picker visibility
  const toggleEmojiPicker = () => {
    isEmojiPickerVisible.value = !isEmojiPickerVisible.value;
  };
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Process selected files
    Array.from(files).forEach(file => {
      // Check file type and size
      if (file.size > 100 * 1024 * 1024) {
        ElMessage.warning('文件大小不能超过100MB');
        return;
      }
      
      selectedFiles.value.push(file);
      
      // Auto-send each file
      const isImage = file.type.startsWith('image/');
      sendFileMessage(file, isImage ? 'IMAGE' : 'FILE');
    });
    
    // Reset file input
    event.target.value = '';
  };
  
  // Handle pasting content
  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          event.preventDefault();
          const isImage = file.type.startsWith('image/');
          sendFileMessage(file, isImage ? 'IMAGE' : 'FILE');
          return;
        }
      }
    }
  };
  
  // Handle keyboard events
  const handleKeydown = (event) => {
    // Send on Enter (unless Shift is pressed for new line)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendTextMessage();
    }
  };
  
  // Detect typing status
  let typingTimeout;
  const updateTypingStatus = () => {
    if (!isTyping.value) {
      isTyping.value = true;
      
      // Send typing indicator if supported by your system
      if (chat.value.type === 'PRIVATE') {
        store.dispatch('webSocket/sendTypingStatus', {
          receiverId: chat.value.targetId
        });
      }
    }
    
    // Reset typing status after delay
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      isTyping.value = false;
    }, 2000);
  };
  
  // Watch input changes for typing status
  watch(messageInput, () => {
    updateTypingStatus();
  });
  
  return {
    messageInput,
    isTyping,
    isSending,
    inputRef,
    selectedFiles,
    isEmojiPickerVisible,
    sendTextMessage,
    sendFileMessage,
    insertEmoji,
    toggleEmojiPicker,
    handleFileSelect,
    handlePaste,
    handleKeydown,
    focusInput
  };
} 