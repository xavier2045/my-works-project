<template>
  <div class="audio-uploader">
    <input type="file" accept="audio/*" @change="updateContent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FILENAMELENGTH } from '@/utils/common';
import { showPopup } from '@/utils/usePopup';
export default defineComponent({
  name: 'AudioUploader',
  props: {
    modelValue: {
      type: Object as PropType<File | null>,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const updateContent = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0] || null;
      const nameSize = file.name.length;
      if(nameSize > FILENAMELENGTH) {
        showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
        return false;
      }
      emit('update:modelValue', file);
    };

    return {
      updateContent,
    };
  },
});
</script>

<style scoped>
.audio-uploader input {
  display: block;
}
</style>
