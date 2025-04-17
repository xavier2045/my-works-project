<template>
  <div class="message-input-container">
    <div class="toolbar">
      <div class="toolbar-button" @click="toggleEmojiPicker">
        <i class="icon iconfont icon-emoji">😊</i>
      </div>
      <div class="toolbar-button" @click="triggerFileInput">
        <i class="icon iconfont icon-attachment">📁</i>
      </div>
      <input 
        type="file" 
        ref="fileInputRef" 
        @change="handleFileSelect" 
        class="file-input" 
      />
    </div>
    
    <div class="input-area">
      <textarea
        ref="textareaRef"
        v-model="messageText"
        placeholder="Type a message"
        @keydown.enter.prevent="handleEnterPress"
        @input="autoGrow"
        maxlength="500"
      ></textarea>
    </div>
    
    <div class="button-area">
      <button class="send-button" @click="sendMessage" :disabled="!messageText.trim()">
        Send
      </button>
    </div>
    
    <!-- Emoji Picker Component (mounted when visible) -->
    <div v-if="showEmojiPicker" class="emoji-picker-container">
      <div class="emoji-picker">
        <div class="emojis">
          <span 
            v-for="emoji in commonEmojis" 
            :key="emoji" 
            class="emoji" 
            @click="addEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { sanitizeMessage } from '@/utils/chatUtils';

// Common emoji set
const commonEmojis = [
  '😀', '😂', '😊', '😍', '🥰', '😘', '🤔', '😎', 
  '👍', '👎', '👏', '🙌', '🎉', '🔥', '❤️', '💯',
  '🤣', '😢', '😭', '😡', '🥺', '😴', '🤮', '😷'
];

const emit = defineEmits<{
  (e: 'send-message', message: string, type: 'text' | 'image' | 'video' | 'file' | 'audio' | 'emoji'): void;
}>();

const messageText = ref('');
const showEmojiPicker = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Toggle emoji picker visibility
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// Add selected emoji to message text
const addEmoji = (emoji: string) => {
  messageText.value += emoji;
  showEmojiPicker.value = false;
  
  // Focus textarea after adding emoji
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
};

// Trigger file input click
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

// Handle file selection
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      // Determine file type
      let type: 'image' | 'video' | 'file' | 'audio';
      
      if (file.type.startsWith('image/')) {
        type = 'image';
      } else if (file.type.startsWith('video/')) {
        type = 'video';
      } else if (file.type.startsWith('audio/')) {
        type = 'audio';
      } else {
        type = 'file';
      }
      
      // Emit the file message with content as data URL
      if (reader.result) {
        emit('send-message', reader.result.toString(), type);
      }
      
      // Reset the input
      if (fileInputRef.value) {
        fileInputRef.value.value = '';
      }
    };
    
    reader.readAsDataURL(file);
  }
};

// Auto-grow textarea based on content
const autoGrow = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

// Handle Enter key press
const handleEnterPress = (event: KeyboardEvent) => {
  // If shift key is also pressed, allow new line
  if (event.shiftKey) {
    return;
  }
  
  // Otherwise, send the message
  sendMessage();
};

// Send text message
const sendMessage = () => {
  const trimmedMessage = messageText.value.trim();
  if (!trimmedMessage) return;
  
  // Sanitize the message to prevent XSS
  const sanitizedMessage = sanitizeMessage(trimmedMessage);
  
  // Emit the message
  emit('send-message', sanitizedMessage, 'text');
  
  // Clear the input
  messageText.value = '';
  
  // Reset height
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
  
  // Focus textarea
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
};
</script>

<style lang="scss" scoped>
.message-input-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 12px;
  position: relative;
}

.toolbar {
  display: flex;
  padding-bottom: 8px;
  
  .toolbar-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    margin-right: 8px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f0f0f0;
    }
    
    i {
      font-size: 20px;
      color: #666;
    }
  }
}

.file-input {
  display: none;
}

.input-area {
  flex: 1;
  
  textarea {
    width: 100%;
    min-height: 40px;
    max-height: 120px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 10px 12px;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: #07c160;
    }
  }
}

.button-area {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  
  .send-button {
    background-color: #07c160;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #06ad56;
    }
    
    &:disabled {
      background-color: #e0e0e0;
      cursor: not-allowed;
    }
  }
}

.emoji-picker-container {
  position: absolute;
  bottom: 100%;
  left: 0;
  padding: 8px;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 10;
  
  .emoji-picker {
    width: 300px;
    
    .emojis {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
      
      .emoji {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: 18px;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: #f0f0f0;
        }
      }
    }
  }
}
</style> 