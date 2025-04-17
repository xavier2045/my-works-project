<template>
  <div class="rich-text-editor">
    <textarea v-model="content" @input="updateContent" maxlength="200" placeholder="Enter text here..."></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
  name: 'RichTextEditor',
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const content = ref(props.modelValue);

    const updateContent = (event: Event) => {
      const value = (event.target as HTMLTextAreaElement).value;
      emit('update:modelValue', value);
    };

    watch(() => props.modelValue, (newValue) => {
      content.value = newValue;
    });

    return {
      content,
      updateContent,
    };
  },
});
</script>

<style scoped>
.rich-text-editor textarea {
  width: 100%;
  height: 100px;
}
</style>
