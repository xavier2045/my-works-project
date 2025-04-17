<template>
  <div class="voice-recorder">
    <!-- @mousedown.prevent="start"
      @mouseup.prevent="stop" -->
    <button
      class="record-button"
      :class="{ recording: isRecording, loading: isLoading }"
      
      @touchstart.passive="start"
      @touchend.passive="stop"
      :disabled="isLoading"
      @mousedown.prevent="handleVoiceInput.start"
      @mouseup.prevent="handleVoiceInput.stop"
    >
      <span class="button-content">
        <span v-if="isLoading">初始化中...</span>
        <template v-else>
          <span class="icon">🎤</span>
          {{ buttonText }}
        </template>
      </span>
    </button>
    <textarea v-model="userInput" />
    <!-- <div class="result-container">
      <transition name="fade">
        <div v-if="result" class="result-text">
          <div class="result-label">识别结果：</div>
          <div class="result-content">{{ result }}</div>
        </div>
      </transition>

      <transition name="slide-down">
        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>
      </transition>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue';
import { useTencentAsr } from '@/hooks/useTencentASR';

export default defineComponent({
  name: 'VoiceRecorder',
  setup(props, { emit }) {
    const userInput = ref('');
    const {
      isRecording: isVoiceRecording,
      result: voiceResult,
      startRecording,
      stopRecording
    } = useTencentAsr();


    // 语音输入处理
    const handleVoiceInput = {
      start: async () => {
        try {
          await startRecording('simple'); // 使用简单版识别
        } catch (err) {
          console.error('语音启动失败:', err);
        }
      },
      stop: () => {
        stopRecording();
        if (voiceResult.value) {
          emit('getContent', {
            content: voiceResult.value,
          });
        }
      }
    };

    // 监听语音结果
    watch(voiceResult, (newVal) => {
      userInput.value = newVal;
    });

    const start = async () => {
      await startRecording();
    };

    const stop = () => {
      stopRecording();
    };

    const buttonText = computed(() => {
      return '长按开始录音';
    });

    return {
      buttonText,
      isVoiceRecording,
      handleVoiceInput,
      start,
      stop
    };
  }
});
</script>

<style scoped>
.voice-recorder {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.record-button {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  background: #007bff;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.record-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.record-button.recording {
  background: #dc3545;
  transform: scale(0.98);
}

.button-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  font-size: 14px;
}

.result-container {
  width: 100%;
  height: 100%;
}

.result-text {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
}

.result-label {
  color: #666;
  font-size: 14px;
}

.result-content {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.error-message {
  background: #ffe3e3;
  color: #dc3545;
  border-radius: 8px;
  border: 1px solid #ffc9c9;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 480px) {
  .voice-recorder {
    font-size: 14px;
  }
  
  .record-button {
    font-size: 14px;
  }
}
</style>