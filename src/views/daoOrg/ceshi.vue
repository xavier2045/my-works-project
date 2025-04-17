<template>
  <div class="viewport" @mousedown="onDragStart">
    <div class="container" :style="{ transform: `translate(${translateX}px, ${translateY}px)` }">
      <div class="section" v-for="(section, index) in sections" :key="index">
        <div class="item" v-for="item in section.items" :key="item.id"
          :class="{ highlight: item.isHighlighted }"
          draggable="true"
          @dragstart="onDragStartItem(item)"
          @dragover.prevent="onDragOverItem(item)"
          @drop="onDropItem(item)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';

interface Item {
  id: number;
  name: string;
  keywords: string[];
  isHighlighted: boolean;
}

export default {
  setup() {
    // 定义各个区域和项
    const sections = reactive([
      { id: 1, items: generateItems(1) },
      { id: 2, items: generateItems(2) },
      { id: 3, items: generateItems(3) },
      { id: 4, items: generateItems(4) },
    ]);

    // 状态管理
    const translateX = ref(-window.innerWidth); // 初始显示区域2
    const translateY = ref(0);
    const startX = ref(0);
    const startY = ref(0);
    const currentSection = ref(2);
    const draggedItem = ref<Item | null>(null);

    // 生成包含关键字的示例项
    function generateItems(sectionId: number): Item[] {
      return Array.from({ length: 18 }, (_, index) => ({
        id: sectionId * 100 + index,
        name: `页面${sectionId} ${index + 1}`,
        keywords: [`keyword${index % 3}`, `common`],
        isHighlighted: false,
      }));
    }

    // 开始拖动事件
    const onDragStart = (e: MouseEvent) => {
      startX.value = e.clientX;
      startY.value = e.clientY;
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onDragEnd);
    };

    // 拖动事件逻辑
    const onDrag = (e: MouseEvent) => {
      const deltaX = e.clientX - startX.value;
      const deltaY = e.clientY - startY.value;

      // 检查拖动方向并切换区域
      if (currentSection.value === 2) {
        if (deltaX > 100) { // 右拖到区域1
          navigateTo(1, 0, 0);
        } else if (deltaY < -100) { // 上拖到区域4
          navigateTo(4, -window.innerWidth, -window.innerHeight);
        }
      } else if (currentSection.value === 1) {
        if (deltaX < -100) { // 左拖到区域2
          navigateTo(2, -window.innerWidth, 0);
        } else if (deltaY < -100) { // 上拖到区域3
          navigateTo(3, 0, -window.innerHeight);
        }
      } else if (currentSection.value === 3) {
        if (deltaX < -100) { // 左拖到区域4
          navigateTo(4, -window.innerWidth, -window.innerHeight);
        } else if (deltaY > 100) { // 下拖到区域1
          navigateTo(1, 0, 0);
        }
      } else if (currentSection.value === 4) {
        if (deltaX > 100) { // 右拖到区域3
          navigateTo(3, 0, -window.innerHeight);
        } else if (deltaY > 100) { // 下拖到区域2
          navigateTo(2, -window.innerWidth, 0);
        }
      }
    };

    // 拖动结束事件
    const onDragEnd = () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onDragEnd);
    };

    // 切换到指定区域
    const navigateTo = (section: number, x: number, y: number) => {
      currentSection.value = section;
      translateX.value = x;
      translateY.value = y;
    };

    // 拖放项的相关事件
    const onDragStartItem = (item: Item) => {
      draggedItem.value = item;
    };

    const onDragOverItem = (item: Item) => {
      if (draggedItem.value && draggedItem.value.keywords.some(keyword => item.keywords.includes(keyword))) {
        item.isHighlighted = true;
      } else {
        item.isHighlighted = false;
      }
    };

    const onDropItem = (item: Item) => {
      if (draggedItem.value) {
        const fromIndex = sections[currentSection.value - 1].items.findIndex(i => i.id === draggedItem.value!.id);
        const toIndex = sections[currentSection.value - 1].items.findIndex(i => i.id === item.id);
        if (fromIndex > -1 && toIndex > -1) {
          sections[currentSection.value - 1].items.splice(toIndex, 0, sections[currentSection.value - 1].items.splice(fromIndex, 1)[0]);
        }
      }
      item.isHighlighted = false;
    };

    return {
      translateX,
      translateY,
      sections,
      onDragStart,
      onDragStartItem,
      onDragOverItem,
      onDropItem,
    };
  },
};
</script>

<style scoped>
.viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.container {
  display: grid;
  grid-template-columns: repeat(2, 100vw);
  grid-template-rows: repeat(2, 100vh);
  transition: transform 0.3s ease;
}

.section {
  display: grid;
  gap: 10px;
  padding: 10px;
  grid-template-columns: repeat(auto-fit, minmax(232px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(270px, 1fr));
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 232px;
  height: 270px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.item.highlight {
  background-color: #f0f8ff;
}
</style>
