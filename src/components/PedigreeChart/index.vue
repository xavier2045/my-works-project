<template>
  <div class="family-tree-container">
    <!-- 动态背景容器 -->
    <div ref="vantaContainer" class="vanta-background"></div>
    
    <!-- 主内容区 -->
    <div class="content-wrapper">
      <h1 class="title">{{ title }}</h1>
      
      <!-- 状态提示 -->
      <Transition name="fade">
        <div v-if="loading" class="status-message loading">
          <div class="spinner"></div>
          <span>数据加载中...</span>
        </div>
        <div v-else-if="error" class="status-message error">
          <span class="icon">⚠️</span>
          <span>{{ error }}</span>
        </div>
      </Transition>

      <!-- 谱系图容器 -->
      <div v-show="!loading && !error" ref="chartContainer" class="pedigree-chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
  import * as THREE from 'three'
  import Treant from 'treant-js/modern' // 现代版路径
  import 'treant-js/modern/vendor/raphael' // 更新后的raphael路径
  import VANTA from 'vanta/dist/vanta.fog.min'
  import type { TreeNode, FamilyTreeProps } from '@/utils/types'
  // import Treant from 'treant-js'
  import 'treant-js/vendor/raphael'
  // 组件属性与事件
  const props = withDefaults(defineProps<FamilyTreeProps>(), {
    title: '家族谱系',
    initialScale: 0.9,
    backgroundBlur: 0.6,
    apiUrl: '/api/family-tree'
  })
  const emit = defineEmits(['node-click', 'node-dblclick', 'loaded', 'error'])
  // 响应式状态
  const chartContainer = ref<HTMLElement | null>(null)
  const vantaContainer = ref<HTMLElement | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentScale = ref(props.initialScale)
  const treeData = ref<TreeNode[]>(demoData) // 使用演示数据
  let vantaEffect: VantaEffect | null = null
  let treantInstance: Treant | null = null
  // 数据初始化
  onMounted(async () => {
    try {
      loading.value = true
      await initVanta()
      await initTreant()
      emit('loaded', treeData.value)
    } catch (err) {
      handleError(err)
    } finally {
      loading.value = false
    }
  })
  // 背景特效管理
  const initVanta = async () => {
    await nextTick()
    if (!vantaContainer.value) return
  vantaEffect = VANTA({
    el: vantaContainer.value,
    THREE: THREE,
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    highlightColor: 0x0066cc,
    midtoneColor: 0x333333,
    lowlightColor: 0x000000,
    baseColor: 0x0a0a0a,
    blurFactor: props.backgroundBlur,
    speed: 1.0
  }) as VantaEffect
  }
  // 谱系图初始化
  // const initTreant = async () => {
  //   await nextTick()
  //   if (!chartContainer.value) return
  //   treantInstance = new Treant({
  //     chart: {
  //       container: chartContainer.value,
  //       rootOrientation: 'NORTH',
  //       nodeAlign: 'CENTER',
  //       connectors: {
  //         type: 'step',
  //         style: {
  //           stroke: '#555',
  //           'stroke-width': 2
  //         }
  //       },
  //       node: {
  //         HTMLclass: 'family-node',
  //         drawLineThrough: false
  //       }
  //     },
  //     nodeStructure: buildNodeStructure(treeData.value)
  //   })
  //   setupNodeInteractions()
  // }
  const initTreant = async () => {
    await nextTick()
    if (!chartContainer.value) return
  // 清除旧实例
    if (treantInstance) {
      treantInstance.destroy()
      treantInstance = null
    }
  // 创建新实例
    treantInstance = new Treant({
      chart: {
        container: chartContainer.value,
        // ...其他配置保持不变
      },
      nodeStructure: buildNodeStructure(treeData.value)
    })
  }
  // 节点结构生成器
  const buildNodeStructure = (nodes: TreeNode[]): any[] => {
    return nodes.map(node => ({
      HTMLclass: node.children?.length ? 'root-node' : 'child-node',
      text: generateNodeContent(node),
      children: node.children ? buildNodeStructure(node.children) : [],
      meta: node.meta
    }))
  }
  // 节点内容生成
  const generateNodeContent = (node: TreeNode) => `
    <div class="node-card">
      <div class="card-front">
        <img class="avatar" src="${node.image}" alt="${node.name}" />
        <div class="info">
          <h3 class="name">${node.name}</h3>
          <span class="node-id">#${node.id}</span>
        </div>
      </div>
      <div class="card-back">
        ${node.meta ? Object.entries(node.meta).map(([key, value]) => `
          <div class="meta-item">
            <label>${key}:</label>
            <span>${value}</span>
          </div>
        `).join('') : ''}
      </div>
    </div>
  `
  // 节点交互处理
  const setupNodeInteractions = () => {
    const nodes = chartContainer.value?.querySelectorAll('.family-node') || []
    nodes.forEach(node => {
      node.addEventListener('click', handleNodeClick)
      node.addEventListener('dblclick', handleNodeDblClick)
    })
  }
  // 清理资源
  onBeforeUnmount(() => {
    vantaEffect?.destroy()
    treantInstance?.destroy()
  })
</script>

// 样式部分
<style scoped>
.family-tree-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
}

.vanta-background {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 20px;
  height: calc(100vh - 40px);
}

.pedigree-chart {
  transform: scale(v-bind(currentScale));
  transform-origin: top center;
  transition: transform 0.3s ease;
}

/* 节点卡片样式 */
:deep(.family-node) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.node-card {
  position: relative;
  width: 200px;
  height: 240px;
  perspective: 1000px;
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.6s;
  border-radius: 8px;
  overflow: hidden;
}

.card-back {
  transform: rotateY(180deg);
  background: #f8f9fa;
  padding: 15px;
}

.family-node.active .card-front {
  transform: rotateY(180deg);
}

.family-node.active .card-back {
  transform: rotateY(0deg);
}


h1 {
    height: 60px;           /* 设置 h1 标签高度为 60px */
    line-height: 60px;       /* 使文字垂直居中 */
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.tree-container {
    width: 100%;
    height: calc(100% - 120px);
    overflow-y: auto;
    position: relative;
}
/* .tree-container::-webkit-scrollbar {
    display: none;
} */

.tree {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0;
    list-style: none;
    position: relative;
}
.tree, .tree ul {
    text-align: center;
}

.tree ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    position: relative;
}

.tree li {
    display: inline-block;
    vertical-align: top;
    margin: 20px 5px 0 5px;
    position: relative;
    padding: 20px 5px 0 5px;
}

.tree li:only-child::before,
.tree li:only-child::after {
    display: none;
}

.tree li:first-child::before {
    border: none;
}
.tree li:last-child::after {
    border: none;
}

.tree li::before,
.tree li::after,
.tree ul::before,
.node::before {
    display: none;
}

.chart {
    position: relative;
    height: auto; /* 高度自适应内容 */
    left: 0;
    right: 0;
    bottom: 0;
    transform: scale(var(--scale, 0.8)); /* 使用 CSS 变量控制缩放比例 */
    transform-origin: top center; /* 缩放中心点为顶部居中 */
    transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1); /* 更柔和的缓动过渡效果 */
}

/* From Uiverse.io by ElSombrero2 */ 
.card {
overflow: visible;
width: 190px;
height: 254px;
}

.content {
width: 100%;
height: 100%;
transform-style: preserve-3d;
transition: transform 300ms;
box-shadow: 0px 0px 10px 1px #000000ee;
border-radius: 5px;
}

.front, .back {
background-color: #151515;
position: absolute;
width: 100%;
height: 100%;
backface-visibility: hidden;
-webkit-backface-visibility: hidden;
border-radius: 5px;
overflow: hidden;
}

.back {
width: 100%;
height: 100%;
justify-content: center;
display: flex;
align-items: center;
overflow: hidden;
}

.back::before {
position: absolute;
content: ' ';
display: block;
width: 160px;
height: 160%;
background: linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, #ff9966, transparent);
animation: rotation_481 5000ms infinite linear;
}

.back-content {
position: absolute;
width: 99%;
height: 99%;
background-color: #151515;
border-radius: 5px;
color: white;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 30px;
}

/* .card:hover .content {
    transform: rotateY(180deg);
} */

@keyframes rotation_481 {
0% {
    transform: rotateZ(0deg);
}

0% {
    transform: rotateZ(360deg);
}
}

.front {
transform: rotateY(180deg);
color: white;
}

.front .front-content {
position: absolute;
width: calc(100% - 20px);
height: calc(100% - 20px);
padding: 10px;
display: flex;
flex-direction: column;
justify-content: space-between;
}

.front-content .badge {
background-color: #00000055;
padding: 2px 10px;
border-radius: 10px;
backdrop-filter: blur(2px);
width: fit-content;
}

.description {
box-shadow: 0px 0px 10px 5px #00000088;
width: calc(100% - 20px);
padding: 10px;
background-color: #00000099;
backdrop-filter: blur(5px);
border-radius: 5px;
}

.title {
font-size: 11px;
max-width: 100%;
display: flex;
justify-content: space-between;
}

.title p {
width: 50%;
}

.card-footer {
color: #ffffff88;
margin-top: 5px;
font-size: 8px;
}

.front .img {
position: absolute;
width: 100%;
height: 100%;
object-fit: cover;
object-position: center;
}

.circle {
width: 90px;
height: 90px;
border-radius: 50%;
background-color: #ffbb66;
position: relative;
filter: blur(15px);
animation: floating 2600ms infinite linear;
}

#bottom {
background-color: #ff8866;
left: 50px;
top: 0px;
width: 150px;
height: 150px;
animation-delay: -800ms;
}

#right {
background-color: #ff2233;
left: 160px;
top: -80px;
width: 30px;
height: 30px;
animation-delay: -1800ms;
}

@keyframes floating {
0% {
    transform: translateY(0px);
}

50% {
    transform: translateY(10px);
}

100% {
    transform: translateY(0px);
}
}

/* 根级矩形发光效果 */
.root-node {
    transition: filter 1s ease; /* 增加颜色变化的过渡效果 */
}

.node:hover {
    border-color: #bbb;
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    transform: translateY(-5px);
}

/* 动态箭头效果：为流程图中生成的 SVG 路径添加动画 */
@keyframes arrowDash {
    0% { stroke-dashoffset: 0; opacity: 1; }
    25% { stroke-dashoffset: 10; opacity: 0.8; }
    50% { stroke-dashoffset: 20; opacity: 0.6; }
    75% { stroke-dashoffset: 30; opacity: 0.8; }
    100% { stroke-dashoffset: 40; opacity: 1; }
}

/* 针对 Treant.js 渲染的流程线添加 dash 数组和动画效果 */
/* .chart svg path {
    stroke-dasharray: 5, 10;
    animation: arrowDash 0.6s linear infinite; 
    stroke-width: 3; 
} */

/* 新增：双击后悬浮放大节点的样式 */
.enlarged-node {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(3);
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 3000;
    background: #fff;
    border-radius: 5px;
    /* 已删除悬浮矩形边框 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    pointer-events: none; /* 禁止鼠标事件 */
}

/* 新增：双击放大缓动微动效果 */
@keyframes microMotion {
    0% { transform: translate(-50%, -50%) scale(2.8); }
    50% { transform: translate(-50%, -50%) scale(3.2); }
    100% { transform: translate(-50%, -50%) scale(3); }
}

/* 添加 #family-tree 样式，实现高度自适应并增加滚动条 */
#family-tree {
    height: auto;
    overflow: auto;
}

.card.flipped .content {
    transform: rotateY(180deg);
}
</style>