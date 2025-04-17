<template>
  <div class="avatar-editor">
    <!-- 裁剪器 -->
    <cropper
      ref="cropperRef"
      :src="image"
      :size="{ width: 360, height: 180 }" 
      :stencil-props="stencilProps"
      :stencil-size="{ width: 360, height: 180 }"
      @change="onCrop"
      class="cropper"
    />

    <!-- 上传按钮 -->
    <div class="upload-section">
      <input type="file" @change="onFileChange" />
    </div>

    <!-- 缩放控制 -->
    <div class="slider-section">
      <input type="range" min="1" max="3" step="0.1" v-model="scaling" @input="onScale" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';

export default defineComponent({
  components: { Cropper },
  setup() {
    const image = ref<string | ArrayBuffer | null>(null);
    const scaling = ref(1);
    const cropperRef = ref(null);
    const stencilProps = ref({
      aspectRatio: 360 / 180,  // 固定裁剪框比例为360x180
      movable: true,
      scalable: true,
      resizable: true,
      isCircle: false
    });

    const onFileChange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          image.value = event.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    };

    const onCrop = (data: any) => {
      console.log('Cropped data:', data);
      // 保存裁剪后的数据
    };

    const onScale = () => {
      if (cropperRef.value) {
        cropperRef.value.zoom(scaling.value);
      }
    };

    return { image, scaling, cropperRef, stencilProps, onFileChange, onCrop, onScale };
  }
});
</script>

<style scoped>
.avatar-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 15px;
  background-color: #f5f5f5;
  width: 400px;
  margin: 0 auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.cropper {
  width: 360px;
  height: 180px;
  overflow: hidden;  /* 确保超出部分被隐藏 */
}

.cropper img {
  object-fit: cover;  /* 确保图片覆盖裁剪框 */
  width: 100%;
  height: 100%;
}

.upload-section {
  margin: 10px 0;
}

.slider-section {
  margin: 10px 0;
  width: 100%;
}

.slider-section input {
  width: 100%;
}
</style>
