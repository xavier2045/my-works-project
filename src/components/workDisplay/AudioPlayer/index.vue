<template>
    <div class="audio-container">
        <div class="waveform-container">
            <!-- 波形显示区域 -->
            <div ref="waveformRef" class="waveform"></div>
        </div>
  
        <!-- 音频元素 -->
        <audio ref="audioRef" class="audio-element" controls>
            Your browser does not support the audio tag.
        </audio>
    </div>
  </template>
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import WaveSurfer from 'wavesurfer.js';
  
  const props = defineProps<{
    src: string[];  // 接收父组件传入的音频数据数组
  }>();
  
  const audioRef = ref<HTMLAudioElement | null>(null);  // 引用音频元素
  const waveformRef = ref<HTMLDivElement | null>(null);  // 引用波形显示区域
  const volumeRef = ref(1);  // 默认音量设为 1
  
  let waveSurfer: WaveSurfer | null = null;  // 用于保存 WaveSurfer 实例
  
  // 切换播放/暂停
  function togglePlay() {
    if (audioRef.value) {
      if (audioRef.value.paused) {
        audioRef.value.play();
        waveSurfer?.play();  // 同时播放波形
      } else {
        audioRef.value.pause();
        waveSurfer?.pause();  // 同时暂停波形
      }
    }
  }
  
  // 设置音量
  function setVolume() {
    if (audioRef.value) {
      audioRef.value.volume = volumeRef.value;  // 设置音频元素的音量
    }
    if (waveSurfer) {
      waveSurfer.setVolume(volumeRef.value);  // 设置 WaveSurfer 的音量
    }
  }
  
  // 组件挂载后初始化波形图，并设置延迟播放
  onMounted(() => {
    if (waveformRef.value) {
      // 创建 WaveSurfer 实例
      waveSurfer = WaveSurfer.create({
        container: waveformRef.value,  // 波形容器
        waveColor: '#ddd',  // 波形颜色
        progressColor: '#00bcd4',  // 播放进度颜色
        height: 100,  // 波形高度
        barWidth: 3,  // 波形条宽度
        barRadius: 3,  // 波形条圆角
        cursorWidth: 1,  // 游标宽度
        cursorColor: '#00bcd4',  // 游标颜色
        interact: true,  // 启用交互（点击跳转）
        normalize: true,  // 启用波形归一化
      });
  
      // 加载音频文件
      const audioUrl = props.src[0];  // 获取父组件传入的第一个音频文件
      waveSurfer.load(audioUrl);  // 加载音频文件到波形
  
      waveSurfer.on('ready', () => {
        if (audioRef.value) {
          audioRef.value.src = audioUrl;  // 当波形加载完成时设置音频源
          setVolume();  // 加载完成后同步设置音量
        }
      });
  
      // 同步音频的播放进度到波形
      waveSurfer.on('audioprocess', () => {
        if (audioRef.value) {
          audioRef.value.currentTime = waveSurfer.getCurrentTime();  // 同步音频的时间
        }
      });
  
      // 当音频播放时同步波形
      audioRef.value?.addEventListener('play', () => {
        waveSurfer?.play();  // 播放波形
      });
  
      // 当音频暂停时同步波形
      audioRef.value?.addEventListener('pause', () => {
        waveSurfer?.pause();  // 暂停波形
      });
  
      // 监听音量变化，实时同步
      audioRef.value?.addEventListener('volumechange', () => {
        volumeRef.value = audioRef.value?.volume || 0;  // 获取音频元素的音量并同步
        if (waveSurfer) {
          waveSurfer.setVolume(volumeRef.value);  // 同时更新 WaveSurfer 的音量
        }
      });
  
      // 监听音频的静音状态
      audioRef.value?.addEventListener('mute', () => {
        if (audioRef.value?.muted) {
          waveSurfer?.setVolume(0);  // 音频静音时，设置 WaveSurfer 音量为 0
        } else {
          waveSurfer?.setVolume(volumeRef.value);  // 恢复音量
        }
      });
    }
  });
  </script>
  
  
  <style lang="scss" scoped>
  .audio-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(229, 229, 229, 0.08);
    backdrop-filter: blur(9px);
    border-radius: 18px;
  
    .waveform-container {
      width: 100%;
      flex-grow: 1;
      position: relative;
      .waveform {
        width: 80%;
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  
    .audio-controls {
      padding: 10px;
      background-color: white;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  
      .volume-control {
        margin-bottom: 10px;
        .volume-slider {
          width: 100%;
        }
      }
  
      .progress-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
  
        .progress-slider {
          width: 80%;
          margin-right: 10px;
        }
  
        span {
          font-size: 14px;
          color: #555;
        }
      }
    }
    .audio-element {
      width: calc(100% - 20px);
      height: 50px;
      background-color: transparent; // 去除背景色
      border-radius: 8px; // 可选：添加圆角
      padding: 10px; // 可选：添加内边距
    }
  
    /* 针对 WebKit 内核的浏览器 */
    .audio-element::-webkit-media-controls-panel {
      background-color: transparent; // 设置控制面板的背景色
    }
  }
  </style>
  