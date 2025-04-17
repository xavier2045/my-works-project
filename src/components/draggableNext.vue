<template>
  <!-- <draggable v-model="props.data" class="drag-container">
    <div v-for="item in props.data" :key="item.id" class="drag-item" data-aos="fade-up">
      <div>
        <div>
          {{ item.name }}
        </div>
        <div>
          {{ item.info }}
        </div>
      </div>
    </div>
  </draggable> -->
  <draggable @end="dragEnd" data-aos="fade-up">
        <transition-group>
          <div class="drag-item" v-for="item in props.data" :key="item.id">
            <div>
              <div>
                {{ item.name }}
              </div>
              <div>
                {{ item.info }}
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
</template>
 
<script lang="ts" setup>
import { PropType, onMounted, defineProps } from 'vue';
import  { VueDraggableNext as Draggable }  from 'vue-draggable-next';
import { initAOS } from '../animations/aos';
 
const props = defineProps({
     data: {
       type: Array as PropType<{ id: string | number; name: string; info: string }[]>,
       default: () => [],
     },
   });
onMounted(() => {
  initAOS();
        
});
// 拖拽结束
function dragEnd(e: any) {
  console.log('e', e)
}
</script>
 
<style>
.drag-container {
  display: flex;
}
.drag-item {
  margin: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>