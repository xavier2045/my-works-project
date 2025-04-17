<template>
  <div v-if="visible" class="dialog-overlay" @click="$emit('close')">
    <div 
      class="dialog-container"
      :class="{ 'notice': types == 1, 'notices': types == 2 }" 
      @click.stop
    >
      <div class="dialog-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="dialog-content">
        <div v-if="type === 1" class="notification-content">
          <!-- 使用 v-html 渲染富文本内容 -->
          <div v-html="sanitizedContent" class="rich-text-content"></div>
          <div class="action-button">
            <button class="btn btn-primary relievoShadow" @click="handleConfirm">知道了</button>
          </div>
        </div>
        <div v-else class="announcement-content">
          <div class="content-wrapper overflowYAuto" ref="contentWrapper">
            <div class="content-inner">
              <!-- 使用 v-html 渲染富文本内容 -->
              <div v-html="sanitizedContent" class="rich-text-content"></div>
            </div>
          </div>
          <div class="timer-display">
            
            <div class="timer-info">
              <!-- <span class="timer-text">剩余时间: {{ timeRemaining }}秒</span> -->
              <button class="btn btn-primary relievoShadow" @click="handleDisagree">不同意</button>
              <button 
                :disabled="!canAgree" 
                class="btn btn-primary relievoShadow agree-btn" 
                @click="handleAgree"
              >
                <template v-if="timeRemaining !== 0">
                  {{ timeRemaining }}s
                </template>
                <template v-else>
                  同意
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import DOMPurify from 'dompurify'; // 用于净化HTML内容

export default defineComponent({
  name: 'CommonDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      validator: (value: number) => {
        return [1, 2].includes(value);
      },
      required: true
    }
  },
  emits: ['update:modelValue', 'dialog-result', 'close'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue);
    const types = ref(props.type);
    const timeRemaining = ref<number | null>(null);
    const timer = ref<NodeJS.Timeout | null>(null);
    const contentWrapper = ref<HTMLElement | null>(null);
    const canAgree = ref(false);
    const sanitizedContent = ref(''); // 净化后的HTML内容

    // 监听可见性变化
    watch(
      () => props.modelValue,
      (newValue) => {
        visible.value = newValue;
        if (newValue) {
          // 净化HTML内容
          sanitizedContent.value = DOMPurify.sanitize(props.content);
          console.log('types.value', types.value)
          if (types.value === 2) {
            initAnnouncementDialog();
          }
        }
      }
    );

    watch(
      () => props.type,
      (newValue) => {
        types.value = newValue;
      }
    );

    // 初始化公告对话框
    const initAnnouncementDialog = () => {
      // 设置初始倒计时时间（例如30秒）
      timeRemaining.value = 30;
      
      // 开始倒计时
      timer.value = setInterval(() => {
        timeRemaining.value--;
        if (timeRemaining.value <= 0) {
          clearInterval(timer.value!);
          canAgree.value = true;
        }
      }, 1000);

      // 监听内容滚动
      if (contentWrapper.value) {
        contentWrapper.value.addEventListener('scroll', handleScroll);
      }
    };

    // 处理滚动事件
    const handleScroll = () => {
      if (!contentWrapper.value) return;

      const { scrollTop, scrollHeight, clientHeight } = contentWrapper.value;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        canAgree.value = true;
      }
    };

    // 处理确认按钮点击
    const handleConfirm = () => {
      if (types.value === 1) {
        closeDialog();
      } else if (types.value === 2 && canAgree.value) {
        handleAgree();
      }
    };

    // 处理同意按钮点击
    const handleAgree = () => {
      emit('dialog-result', 'agree');
      closeDialog();
    };

    // 处理不同意按钮点击
    const handleDisagree = () => {
      emit('dialog-result', 'disagree');
      closeDialog();
    };

    // 关闭对话框
    const closeDialog = () => {
      visible.value = false;
      emit('update:modelValue', false);
      clearInterval(timer.value!);
    };

    // 组件卸载时清理定时器
    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    return {
      types,
      visible,
      timeRemaining,
      contentWrapper,
      canAgree,
      sanitizedContent,
      handleConfirm,
      handleAgree,
      handleDisagree
    };
  }
});
</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .dialog-container {
    background-color: #fff;
    border-radius: 28px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    border: 1px solid rgb(255, 255, 255, .38);
    box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
    background: rgba(100, 99, 98, .16);
    backdrop-filter: blur(36px);
    .dialog-header {
      width: 100%;
      height: auto;
      h3 {
        font-weight: 400;
        font-size: 18px;
        color: #FFFFFF;
        line-height: 1;
        text-align: center;
      }
    }
  }
}
.notice{
  width: 386px;
}
.notices{
  width: 680px;
}

.dialog-content {
  width: 100%;
  height: auto;
  margin-top: 15px;
}

.notification-content {
  text-align: center;
}

.rich-text-content {
  margin-bottom: 20px;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 1.5;
  text-align: left;
}

.action-button {
  margin-top: 20px;
}

.announcement-content {
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  padding: 10px;
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
}

.timer-info {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.timer-text {
  font-size: 14px;
  color: #666;
}

.agree-btn {
  margin-left: auto;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary {
  color: rgb(255, 255, 255, .7);
}
.btn-primary:last-child{
  margin-left: 20px;
}

.btn-primary:hover {
}

.btn-primary:disabled {
  cursor: not-allowed;
}

/* 添加富文本内容的样式重置 */
::v-deep(*) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

::v-deep(p) {
  margin-bottom: 1em;
  line-height: 1.5;
}

::v-deep(img) {
  max-width: 100%;
  height: auto;
}

::v-deep(a) {
  color: #42b983;
  text-decoration: none;
}

::v-deep(a:hover) {
  text-decoration: underline;
}

::v-deep(ul), ::v-deep(ol) {
  padding-left: 20px;
  margin-bottom: 1em;
}

::v-deep(li) {
  margin-bottom: 5px;
}
</style>