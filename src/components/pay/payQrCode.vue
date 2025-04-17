<template>
  <div style="width: 100%; height: 100%;">
    <canvas ref="qrCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import QRCode from 'qrcode';

export default defineComponent({
  name: 'QRCodeGenerator',
  props: {
    qrData: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 128,
    },
    foregroundColor: {
      type: String,
      default: 'rgba(255, 255, 255, .68)', // 默认全黑色不透明
    },
  },
  setup(props) {
    const qrCanvas = ref<HTMLCanvasElement | null>(null);

    onMounted(() => {
      if (qrCanvas.value) {
        const containerWidth = qrCanvas.value.parentElement.clientWidth;
        console.log('props.qrData', props.qrData);
        QRCode.toCanvas(qrCanvas.value, props.qrData, {
          version: 10,
          width: containerWidth,
          margin: 0, // 移除留白
          color: {
            dark: '#FFFFFF', // 初始设置为黑色
            light: '#00000000', // 透明背景色
          },
        }).then(() => {
          const canvas = qrCanvas.value;
          if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;

              const [r, g, b, a] = parseRGBA(props.foregroundColor);

              for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] > 0) { // 只更改非透明像素
                  data[i] = r;
                  data[i + 1] = g;
                  data[i + 2] = b;
                  data[i + 3] = a * 255; // 设置透明度
                }
              }

              context.putImageData(imageData, 0, 0);
            }
          }
        }).catch((error) => {
          console.error('Error generating QR code:', error);
        });
      }
    });

    const parseRGBA = (rgba: string) => {
      const matches = rgba.match(/rgba?\((\d+), (\d+), (\d+),? ?([\d\.]+)?\)/);
      if (matches) {
        const r = parseInt(matches[1], 10);
        const g = parseInt(matches[2], 10);
        const b = parseInt(matches[3], 10);
        const a = matches[4] ? parseFloat(matches[4]) : 1;
        return [r, g, b, a];
      }
      return [255, 255, 255, .8]; // 默认黑色
    };

    return {
      qrCanvas,
    };
  },
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: auto; /* 保持宽高比 */
  display: block;
  margin: 0 auto;
  background: transparent; /* 确保 canvas 背景透明 */
}
</style>
