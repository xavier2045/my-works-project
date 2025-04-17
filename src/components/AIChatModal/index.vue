<template>
  <div class="modal" v-if="visible" @click="handleClose">
    <div class="modal-content" @click.stop>
      <!-- <h3>{{ title }}</h3> -->
      <div class="chat-history overflowYAuto">
        <div 
          v-for="(message, index) in chatHistory" 
          :key="index" 
          :class="['chat-message', message.role === 'user' ? 'user-message' : 'assistant-message']"
        >
          <div class="message-bubble">
            
            <template v-if="message.role === 'user'">
              {{ message.content }}
            </template>
            <template v-else>
              <span>🤖 </span>
              <div class="message-content">
                <template v-if="message.content.generateResult !== undefined">
                  <DynamicDataDisplay
                    :data="message.content"
                    :fields="fieldsConfig"
                    :businessType="Number(types)"
                  />
                </template>
                <template v-else>
                  {{ message.content }}
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="input-container">
        <button 
          class="voice-btn" 
          @click="toggleVoice"
          :class="{ 'listening': isListening }"
        >
          🎤
        </button>
        <textarea 
          v-model="userInput" 
          placeholder="请输入问题或使用语音输入" 
          class="input-area"
          @keyup.enter.exact="handleSubmit"
        />
        <button 
          class="submit-btn" 
          @click="handleSubmit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '生成中...' : '发送' }}
        </button>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { aiGenerate } from '@/api/common';
import { showPopup } from '@/utils/usePopup';
import DynamicDataDisplay from '@/components/AIChatModal/DynamicDataDisplay.vue';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

declare global {
  interface Navigator {
    permissions?: Permissions;
    mediaDevices?: MediaDevices;
  }
}

declare interface Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

export default defineComponent({
  name: 'AIChatModal',
  components: { DynamicDataDisplay },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'AI智能助手',
    },
    type: {
      type: String,
      required: true
    },
    context: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'aiResponse'],
  setup(props, { emit }) {
    const userInput = ref('');
    const chatHistory = ref<ChatMessage[]>([]);
    const isSubmitting = ref(false);
    const error = ref('');
    const types = ref(props.type);
    const generateResult = ref(0);

    // 聊天数据回显
    const fieldsConfig = [
        { key: 'name', label: '任务名称', businessType: [1] },
        { key: 'payAmount', label: '任务报酬', businessType: [1] },
        { key: 'categoryName', label: '所属行业', businessType: [1] },
        { key: 'trustValue', label: '信任值', businessType: [1] },
        { key: 'target', label: '任务目标', businessType: [1] },
        { key: 'day', label: '任务周期', businessType: [1] },
        { key: 'nodeChangeTimes', label: '节点可改', businessType: [1] },
        { key: 'nodePeriod', label: '单节点周期', businessType: [1] },
        { key: 'nodeChangeHour', label: '修改期限', businessType: [1] },
        { key: 'startTime', label: '开始时间', businessType: [1] },
        { key: 'endTime', label: '结束时间', businessType: [1] },
        { key: 'isOnline', label: '任务方式', businessType: [1] },
        { key: 'address', label: '任务地址', businessType: [1] },
        { key: 'fullAddress', label: '详细地址', businessType: [1] },
        { key: 'cover', label: '封面url', businessType: [1] },
        { key: 'coverDescription', label: '封面描述', businessType: [1] },
        { key: 'description', label: '任务介绍', businessType: [1] },
        { key: 'competencyRequirement', label: '能力要求', businessType: [1] },
      ]

    // 语音识别功能
    const {
      isListening,
      recognizing,
      speechText,
      error: speechError,
      startListening,
      stopListening,
      reset
    } = useSpeechRecognition();

    const toggleVoice = async () => {
      try {
        const hasPermission = await checkMicrophonePermission();
        if (!hasPermission) return;

        if (recognizing.value) {
          stopListening();
        } else {
          startListening();
        }
      } catch (err) {
        console.error(err);
        // error.value = '语音识别失败，请检查麦克风权限';
        showPopup('语音识别失败，请检查麦克风权限', 'error', 3000);
      }
    };

    async function checkMicrophonePermission(): Promise<Boolean> {
      try {
        if (!navigator.permissions || !navigator.mediaDevices) {
          // error.value = '浏览器不支持麦克风权限检查';
          showPopup('浏览器不支持麦克风权限检查', 'error', 3000);
          return false;
        }

        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        switch (permissionStatus.state) {
          case 'granted':
            return true;
          case 'denied':
            // error.value = '您拒绝了麦克风权限，请前往设置允许';
            showPopup('您拒绝了麦克风权限，请前往设置允许', 'error', 3000);
            return false;
          case 'prompt':
            try {
              await navigator.mediaDevices.getUserMedia({ audio: true });
              return true;
            } catch (err) {
              // error.value = '麦克风授权失败，请检查您的设备或浏览器设置';
              showPopup('麦克风授权失败，请检查您的设备或浏览器设置', 'error', 3000);
              return false;
            }
        }
      } catch (err) {
        // error.value = '麦克风权限检查失败';
        showPopup('麦克风权限检查失败', 'error', 3000);
        return false;
      }
    }

    const scrollToBottom = () => {
      nextTick(() => {
        const container = document.querySelector('.chat-history');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    };

    const handleSubmit = async () => {
      if (!userInput.value.trim() || isSubmitting.value) return;

      isSubmitting.value = true;
      error.value = '';
      
      try {
        const userMessage = userInput.value.trim();
        chatHistory.value.push({ role: 'user', content: userMessage });
        scrollToBottom();
        // let isBoolean = false;
        // if(generateResult.value == 0) {
        //   isBoolean = true;
        // } else {
        //   isBoolean = chatHistory.value.length > 1 ? false : true
        // }
        const response = await aiGenerate({
          description: userMessage,
          businessType: 1,
          llmType: 2,
          llmModel: "moonshot-v1-8k",
          isNew: chatHistory.value.length > 1 ? false : true
        });

        const { code, data, message } = response;
  
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return null;
        }
        if (code == 200) {
          userInput.value = '';
          // 0失败 1成功
          if(response.data.generateResult == 0) {
            generateResult.value = 0;
            chatHistory.value.push({ 
              role: 'assistant', 
              content: response.data.data
            });
            return false;
          } else {
            generateResult.value = 1;
          }
        }

        chatHistory.value.push({ 
          role: 'assistant', 
          content: data 
        });
        
        emit('aiResponse', {
          content: data,
          type: props.type
        });

        scrollToBottom();
      } catch (err) {
        // error.value = '生成失败，请稍后重试';
        showPopup('生成失败，请稍后重试', 'error', 3000);
        chatHistory.value.push({ 
          role: 'assistant', 
          content: '抱歉，生成内容时出现错误，请尝试重新提问。' 
        });
      } finally {
        isSubmitting.value = false;
        userInput.value = '';
        reset();
      }


    };

    const handleClose = () => {
      emit('close');
      chatHistory.value = [];
      userInput.value = '';
      reset();
    };

    watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          nextTick(() => scrollToBottom());
        }
      }
    );

    watch(speechText, (newVal) => {
      userInput.value = newVal;
    });

    return {
      types,
      error,
      userInput,
      chatHistory,
      isSubmitting,
      isListening,
      fieldsConfig,
      generateResult,
      toggleVoice,
      handleClose,
      handleSubmit,
    };
  }
});
</script>

<style lang="scss" scoped>
.modal {
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; */
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* display: flex;
  justify-content: center; */
  align-items: center;
  z-index: 1000;
  border-radius: 12px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chat-history {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
  /* overflow-y: auto; */
  flex-grow: 1;
}

.chat-message {
  display: flex;
  margin: 8px 0;
}

.message-bubble {
  padding: 10px 16px;
  border-radius: 18px;
  line-height: 1.5;
  max-width: 85%;
  display: flex;
  width: calc(100% - 32px);
  span{
    width: 30px;
    height: auto;
    flex-shrink: 0;
  }
  .message-content{
    flex: 1;
    width: 0;
  }
}

.user-message .message-bubble {
  background: #007bff;
  color: white;
  margin-left: auto;
}

.assistant-message .message-bubble {
  background: #ffffff;
  border: 1px solid #dee2e6;
  margin-right: auto;
}

.input-container {
  height: 100px;
  display: flex;
  gap: 8px;
  padding: 16px;
  align-items: center;
}

.voice-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 50%;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  will-change: transform;
}

.voice-btn.listening {
  background: #dc3545;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.input-area {
  flex: 1;
  padding: 12px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.input-area:focus {
  border-color: #007bff;
  outline: none;
}

.submit-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 8px;
  font-size: 0.9em;
  padding: 8px;
}
</style>