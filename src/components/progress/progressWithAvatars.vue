<template>
    <div class="progress-bar-wrapper">
        <div class="wrapper-taskName" :style="{ left: progress + '%' }">{{ taskName }}</div>
        <div class="progress-bar-container" :style="{ backgroundColor: baseColor, height: barHeight + 'px' }">
        <div class="progress-bar" :style="getGradientStyle(progress)">
            <img v-if="avatars" :src="avatars" class="avatar" />
        </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    props: {
        name: {
            type: String,
            required: true
        },
        progress: {
            type: Number,
            required: true,
            validator: (value: number) => value >= 0 && value <= 100
        },
        avatars: {
            type: String,
            required: true
        },
        gradientColors: {
            type: Array as PropType<string[]>,
            required: true
        },
        barHeight: {
            type: Number,
            default: 20
        },
        baseColor: {
            type: String,
            default: 'rgb(69, 65, 58, 1)' // 默认底色
        }
    },
    setup(props) {
        const taskName = props.name;
        const getGradientStyle = (progress: number) => {
            // 生成渐变背景样式
            const gradientBackground = props.gradientColors.map((color, index) => {
                // 计算每个颜色的停止点，最后一个颜色使用进度值
                const stop = index === props.gradientColors.length - 1 ? progress + '%' : (index / (props.gradientColors.length - 1) * 100) + '%';
                return `${color} ${stop}`;
            }).join(', ');
    
            return {
                background: `linear-gradient(to right, ${gradientBackground})`,
                width: progress + '%',
                height: props.barHeight + 'px'
            };
        };
    
        return { 
            taskName,
            getGradientStyle
        };
    }
  });
  </script>
  
  <style scoped>
    .progress-bar-wrapper{
        width: 100%;
        height: auto;
    }
    .wrapper-taskName{
        margin: 0;
        padding: 0;
        font-size: 14px;
        color: rgba(255, 255, 255, .68);
        text-align: left;
        line-height: 1;
        margin-bottom: 5px;
        display: inline-block;
    }
    .progress-bar-container {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .progress-bar {
        position: relative;
        border-radius: 10px;
        transition: width 0.5s ease;
    }
  
    .avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        right: 5px;
        transform: translateY(-50%);
    }
  </style>