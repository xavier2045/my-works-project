<template>
    <div class="textarea-with-counter">
      <textarea
        ref="textareaRef"
        v-model="inputValue"
        :maxlength="maxLength"
        @input="handleInput"
        class="textarea"
        :placeholder="placeholder"
        @paste="handlePaste"
      />
      <div class="counter">{{ inputLength }}/{{ maxLength }}</div>
    </div>
  </template>
  
  <script lang="ts">
  import { showPopup } from '@/utils/usePopup';
  import { defineComponent, ref, computed, watch, nextTick } from 'vue';
  
  export default defineComponent({
    name: 'TextareaWithCounter',
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      maxLength: {
        type: Number,
        default: 100
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    setup(props, { emit }) {
      const inputValue = ref(props.modelValue);
      console.log('props.modelValue', props);
      console.log('props.modelValue', props.modelValue);
      const inputLength = computed(() => inputValue.value.length);
      const textareaRef = ref<HTMLTextAreaElement | null>(null);
  
      const handleInput = (event: Event) => {
        const target = event.target as HTMLTextAreaElement;
        // inputValue.value = target.value;
        // emit('update:modelValue', target.value);
        if (target.value.length <= props.maxLength) {
          inputValue.value = target.value;
          emit('update:modelValue', target.value);
        } else {
          showPopup('字数超出上限！', 'error', 3000);
        }
      };

      const handlePaste = async (e: ClipboardEvent) => {
        e.preventDefault(); // 阻止默认的粘贴行为

        // 获取剪贴板中的纯文本内容
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        console.log('Clipboard text:', text);

        // 确保 textareaRef 已经被正确赋值
        await nextTick();
        console.log('textareaRef after nextTick:', textareaRef.value);

        if (!textareaRef.value) {
          console.error('textareaRef is still null after nextTick');
          return;
        }

        // 计算剩余可输入的字符数
        const remainingLength = props.maxLength - inputValue.value.length;

        // 如果粘贴的文本长度超过剩余可输入的字符数，则截取
        const pastedText = text.substring(0, remainingLength);

        // 将纯文本内容插入到 textarea 中
        const start = textareaRef.value.selectionStart;
        const end = textareaRef.value.selectionEnd;
        const before = textareaRef.value.value.substring(0, start);
        const after = textareaRef.value.value.substring(end);
        textareaRef.value.value = before + pastedText + after;

        // 更新光标位置
        textareaRef.value.selectionStart = textareaRef.value.selectionEnd = start + pastedText.length;

        // 更新输入值
        inputValue.value = textareaRef.value.value;

        // 触发输入事件以更新父组件
        emit('update:modelValue', textareaRef.value.value);

        // 手动触发 input 事件
        const inputEvent = new Event('input', { bubbles: true });
        textareaRef.value.dispatchEvent(inputEvent);

          // 如果粘贴的内容被截取，显示提示信息
        if (text.length > remainingLength) {
          showPopup('粘贴内容超出字数限制，已自动截取！', 'error', 3000);
        }
      };

      watch(() => props.modelValue, (newValue) => {
        inputValue.value = newValue;
      });
  
      return {
        inputLength,
        inputValue,
        textareaRef,
        maxLength: props.maxLength,
        placeholder: props.placeholder,
        handleInput,
        handlePaste
      };
    }
  });
  </script>
  
  <style lang='scss' scoped>
  .textarea-with-counter {
    width: calc(100% - 60px);
    height: calc(100% - 40px);
    padding-right: 8px;
    position: relative;
    background-color: initial;
    padding: 20px 30px;
    .textarea {
        width: 100%;
        height: 100%;
        background: transparent;
        font-weight: 400;
        font-size: 16px;
        color: #FFFFFF;
        line-height: 1.6;
        text-align: left;
        font-style: normal;
        text-transform: none;
        border: none;
        resize: none;
        letter-spacing: 1px;
        &::placeholder {
        color: rgb(255, 255, 255, 0.68);
        font-size: 16px;
        }
        &:focus-visible{
        outline: none;
        }
        /* 火狐浏览器滚动条样式 */
        @supports (-moz-appearance: none) {
            scrollbar-width: thin;

            ::-moz-scrollbar-track {
                background-color: rgba(225,225,225,0);  /* 轨道颜色 */
                border-radius: 2px;
            }

            ::-moz-scrollbar-thumb {
                background-color: rgba(225,225,225,0.2);  /* 滑块颜色 */
                border-radius: 2px;
                width: 4px;
            }

            ::-moz-scrollbar-thumb:hover {
            background-color: rgba(225,225,225,0.2);  /* 悬停时滑块颜色 */
            }
        }
        /* 通用滚动条样式 */
        &::-webkit-scrollbar { /* 整个滚动条 */
        width: 4px; /* 滚动条宽度 */
        }
        &::-webkit-scrollbar-track { /* 滚动条轨道 */
        background: rgba(225,225,225,0); 
        }
        &::-webkit-scrollbar-thumb { /* 滚动条滑块 */
        background: rgba(225,225,225,0.2); 
        border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb:hover { /* 鼠标悬停时滚动条滑块样式 */
        background: rgba(225,225,225,0.2); 
        }
    }
    .counter {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-weight: 400;
        font-size: 16px;
        color: #FFFFFF;
    }
  }
  </style>