<template>
    <div class="container" :style="{ width: width + 'px', height: height + 'px' }">
      <div class="circle large-circle">Hello Sun</div>
      <div
        v-for="(circle, index) in smallCircles"
        :key="index"
        class="circle small-circle"
        :style="{
          top: circle.y + 'px',
          left: circle.x + 'px',
          animationDuration: circle.animationDuration + 's',
        }"
      >
        {{ circle.label }}
      </div>
      <canvas ref="canvas" :width="width" :height="height" class="canvas"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import axios from 'axios';
  
  interface SmallCircle {
    x: number;
    y: number;
    radius: number;
    angle: number;
    speed: number;
    label: string;
    animationDuration: number;
  }
  
  export default defineComponent({
    name: 'FloatingCircles',
    props: {
      width: {
        type: Number,
        default: 800,
      },
      height: {
        type: Number,
        default: 600,
      },
      maxCircles: {
        type: Number,
        default: 6,
      },
      apiUrl: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const canvas = ref<HTMLCanvasElement | null>(null);
      let ctx: CanvasRenderingContext2D | null = null;
      const largeCircle = { x: props.width / 2, y: props.height / 2, radius: 50 };
      const smallCircles: SmallCircle[] = ref([]).value;
  
      const fetchCircleData = async () => {
        try {
          const response = await axios.get<string[]>(props.apiUrl); // 使用父组件传递的API URL
          const data = response.data;
          createSmallCircles(data);
        } catch (error) {
          console.error('Error fetching circle data:', error);
        }
      };
  
      const createSmallCircles = (labels: string[]) => {
        smallCircles.length = 0; // 清空小球数组
        const numCircles = Math.min(labels.length, props.maxCircles);
        const angleStep = (2 * Math.PI) / numCircles;
        for (let i = 0; i < numCircles; i++) {
          const angle = i * angleStep;
          const radius = 20;
          const distance = largeCircle.radius + 50 + Math.random() * 50;
          const x = largeCircle.x + distance * Math.cos(angle) - radius;
          const y = largeCircle.y + distance * Math.sin(angle) - radius;
          const speed = 0.02 + Math.random() * 0.02;
          const animationDuration = 3 + Math.random() * 2;
          smallCircles.push({ x, y, radius, angle, speed, label: labels[i], animationDuration });
        }
      };
  
      const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
        if (!ctx) return;
  
        // 画发光效果
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 10;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
        ctx.closePath();
  
        // 画连接线
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      };
  
      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, props.width, props.height);
  
        smallCircles.forEach((circle) => {
          const largeCircleEdgeX =
            largeCircle.x +
            largeCircle.radius * Math.cos(Math.atan2(circle.y - largeCircle.y, circle.x - largeCircle.x));
          const largeCircleEdgeY =
            largeCircle.y +
            largeCircle.radius * Math.sin(Math.atan2(circle.y - largeCircle.y, circle.x - largeCircle.x));
          drawLine(largeCircleEdgeX, largeCircleEdgeY, circle.x + circle.radius, circle.y + circle.radius, 'rgba(255, 255, 255, 0.7)');
        });
  
        requestAnimationFrame(animate);
      };
  
      onMounted(() => {
        if (canvas.value) {
          ctx = canvas.value.getContext('2d');
          fetchCircleData().then(() => {
            animate();
          });
        }
      });
  
      watch(() => props.maxCircles, () => {
        fetchCircleData(); // 当 maxCircles 变化时重新获取数据并重新绘制
      });
  
      return {
        canvas,
        smallCircles,
      };
    },
  });
  </script>
  
  <style scoped>
  .container {
    position: relative;
    margin: 0 auto;
    background: #333;
  }
  
  .circle {
    position: absolute;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    font-weight: bold;
  }
  
  .large-circle {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.7);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .small-circle {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.7);
    animation: float 5s infinite ease-in-out alternate, morph 2s infinite ease-in-out alternate;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-40px);
    }
  }
  
  @keyframes morph {
    0% {
      border-radius: 50%;
    }
    50% {
      border-radius: 50% 70% 50% 70%;
    }
    100% {
      border-radius: 70% 50% 70% 50%;
    }
  }
  
  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  </style>
  