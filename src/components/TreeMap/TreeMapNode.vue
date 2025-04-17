<!-- TreeMapNode.vue -->
<template>
    <g>
      <circle 
        :cx="node.x" 
        :cy="node.y" 
        :r="node.r" 
        :fill="nodeColor(node)" 
        @click="handleNodeClick(node)"
        :style="{ cursor: 'pointer' }"
      >
        <title>{{ node.label }}</title>
      </circle>
      <text 
        :x="node.x" 
        :y="node.y - 5" 
        fill="black" 
        text-anchor="middle"
        font-size="12px"
      >
        {{ node.label }}
      </text>
      <line 
        v-for="child in node.children" 
        :key="child.id" 
        :x1="node.x" 
        :y1="node.y" 
        :x2="child.x" 
        :y2="child.y" 
        :stroke="lineColor" 
        :stroke-width="lineWidth"
      />
      <TreeMapNode 
        v-for="child in node.children" 
        :key="child.id" 
        :node="child" 
        :line-color="lineColor" 
        :line-width="lineWidth" 
        @node-click="handleNodeClick"
      />
    </g>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'TreeMapNode',
    props: {
      node: {
        type: Object,
        required: true
      },
      nodeColorFn: {
        type: Function,
        default: () => '#42b983'
      },
      lineColor: {
        type: String,
        default: '#ccc'
      },
      lineWidth: {
        type: Number,
        default: 1
      }
    },
    emits: ['node-click'],
    setup(props, { emit }) {
      const nodeColor = computed(() => {
        return typeof props.nodeColorFn === 'function' ? props.nodeColorFn(props.node) : props.nodeColorFn;
      });
  
      const handleNodeClick = (node) => {
        emit('node-click', node);
      };
  
      return {
        nodeColor,
        handleNodeClick
      };
    }
  });
  </script>