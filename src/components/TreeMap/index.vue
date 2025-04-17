<template>
  <div ref="container" class="tree-map-container" :style="{ width: `${width}px`, height: `${height}px` }">
    <svg :width="width" :height="height">
      <g :transform="`translate(${width / 2},${height / 2})`">
        <template v-for="node in treeData" :key="node.id">
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
            <!-- 递归渲染子节点 -->
            <!-- <TreeMapNode 
              v-for="child in node.children" 
              :key="child.id" 
              :node="child" 
              :line-color="lineColor" 
              :line-width="lineWidth" 
              @node-click="handleNodeClick"
            /> -->
          <!--
          <circle 
            v-for="child in node.children" 
            :key="child.id" 
            :cx="child.x" 
            :cy="child.y" 
            :r="child.r" 
            :fill="nodeColor(child)" 
            @click="handleNodeClick(child)"
            :style="{ cursor: 'pointer' }"
          >
            <title>{{ child.label }}</title>
          </circle>
          <text 
            v-for="child in node.children" 
            :key="child.id" 
            :x="child.x" 
            :y="child.y - 5" 
            fill="black" 
            text-anchor="middle"
            font-size="12px"
          >
            {{ child.label }}
          </text> -->
        </template>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import TreeMapNode from '@/components/TreeMap/TreeMapNode.vue';
export default defineComponent({
  name: 'TreeMap',
  props: {
    data: {
      type: Array,
      required: true,
      validator: (value: any[]) => value.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('label'))
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
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 600
    },
    margin: {
      type: Object,
      default: () => ({ top: 20, right: 20, bottom: 20, left: 20 })
    }
  },
  emits: ['node-click'],
  setup(props, { emit }) {
    const container = ref<HTMLElement | null>(null);
    const treeData = ref([]);
    const minOffset = 10; // 定义最小偏移量


    const calculatePositions = (nodes, x = props.width / 2, y = props.height / 2, level = 0, radius = 100) => {
      nodes.forEach(node => {
        node.children = node.children || [];
        node.x = x;
        node.y = y;
        node.r = 10 + level * 5;

        console.log(`Node ID: ${node.id}, X: ${node.x}, Y: ${node.y}`);

        if (node.children.length > 0) {
          const angleStep = (Math.PI * 2) / node.children.length;
          node.children.forEach((child, index) => {
            const angle = angleStep * index;
            let childX = x + Math.cos(angle) * radius * (level + 1);
            let childY = y + Math.sin(angle) * radius * (level + 1);

            const distance = Math.sqrt(Math.pow(childX - x, 2) + Math.pow(childY - y, 2));
            if (distance < minOffset) {
              const scale = minOffset / distance;
              childX = x + (childX - x) * scale;
              childY = y + (childY - y) * scale;
            }

            child.x = childX;
            child.y = childY;
            child.r = 10 + (level + 1) * 5;

            console.log(`Child ID: ${child.id}, X: ${child.x}, Y: ${child.y}`);
            calculatePositions([child], childX, childY, level + 1, radius * 0.8);
          });
        }
      });
    };

    onMounted(() => {
      treeData.value = JSON.parse(JSON.stringify(props.data));
      calculatePositions(treeData.value);
    });

    watch(() => props.data, (newData) => {
      treeData.value = JSON.parse(JSON.stringify(newData));
      calculatePositions(treeData.value);
    }, { deep: true });

    const handleNodeClick = (node) => {
      emit('node-click', node);
    };

    const nodeColor = computed(() => {
      return typeof props.nodeColorFn === 'function' ? props.nodeColorFn : () => props.nodeColorFn;
    });

    return {
      container,
      treeData,
      handleNodeClick,
      nodeColor,
      TreeMapNode
    };
  }
});
</script>

<style scoped>
.tree-map-container {
  width: 100%;
  height: 100%;
}
</style>