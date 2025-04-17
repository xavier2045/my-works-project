<template>
  <div class="errorTips" v-if="isVisible">
    <div :class="['errorTips-main', type]">
      <div class="mask"></div>
      <div class="errorTips-main-content">
        <div class="errorTips-main-icon">
          <!-- Display a different icon based on success or error -->
          <i class="icon font_family" :class="iconClass"></i>
        </div>
        <div class="errorTips-main-text">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue';

export default defineComponent({
  name: 'ErrorTipPopup',
  props: {
    message: {
      type: String,
      default: 'An error has occurred',
    },
    type: {
      type: String,
      default: 'error', // Default to 'error'
    },
    duration: {
      type: Number,
      default: 3000, // Display time in milliseconds
    },
  },
  setup(props, { expose }) {
    const isVisible = ref(false);
    const message = ref(props.message);
    const iconClass = ref('');

    let timeout: ReturnType<typeof setTimeout>;

    const showPopup = (msg: string, type: string = 'error', duration: number = props.duration) => {
      message.value = msg;
      iconClass.value = type === 'success' ? 'icon-gouxuanyuanxingbiankuang68' : 'icon-dachayuanxingbiankuang68';
      isVisible.value = true;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        isVisible.value = false;
      }, duration);
    };

    onUnmounted(() => {
      clearTimeout(timeout);
    });

    expose({ showPopup });

    return { isVisible, message, iconClass, showPopup };
  },
});
</script>

<style scoped lang="scss">
.errorTips{
    width: auto;
    height: 48px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, .38);
    position: fixed;
    top: calc(50% - 70px);
    left: calc(50% + 80px);
    z-index: 999999;
    overflow: hidden;
    transform: translate(-50%, -50%);
    .errorTips-main{
      padding: 0 28px;
      position: relative;
      .mask{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        background-color: rgba(0, 0, 0, .35);
        backdrop-filter: blur(9px);
      }
      .errorTips-main-content{
        width: 100%;
        height: 100%;
        display: flex;
        .errorTips-main-icon{
          width: 24px;
          height: auto;
          flex-shrink: 0;
          margin-right: 12px;
          cursor: pointer;
          i{
            font-size: 24px;
            color: #FFFFFF;
            line-height: 48px;
            display: block;
          }
        }
        .errorTips-main-text{
          font-size: 16px;
          color: #FFFFFF;
          line-height: 48px;
          text-align: left;
        }
      }
    }
  }
</style>
