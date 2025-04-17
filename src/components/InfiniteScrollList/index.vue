<template>
  <el-scrollbar
    :ref="setScrollbarRef"
    class="infinite-scroll-container"
  >
    <slot name="item" :items="items"></slot>
    <div ref="bottomElement" v-if="loading" class="loading">加载中...</div>
    <div v-if="!hasMore" class="no-more-data">
      暂时没有更多数据了
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, onBeforeUnmount, nextTick } from "vue";
import { ElScrollbar } from 'element-plus';

export default defineComponent({
  name: "InfiniteScrollList",
  props: {
    fetchFunction: {
      type: Function,
      required: true,
    },
    hasMore: {
      type: Boolean,
      default: true,
    },
    filterCriteria: {
      type: Object,  // 假设你的筛选条件是字符串类型，可以根据实际情况调整
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const items = ref<any[]>([]);
    const loading = ref(false);
    const page = ref(1);
    const hasMore = ref(true);
    
    const scrollbar = ref<InstanceType<typeof ElScrollbar>>(null);
      const bottomElement = ref<HTMLElement | null>(null);
      const setScrollbarRef = (el: InstanceType<typeof ElScrollbar> | null) => {
        scrollbar.value = el;
    };
    const fetchItems = async (reset = false) => {
      if (loading.value) return;
      loading.value = true;
      if (reset) {
        items.value = [];
        page.value = 1;
      }

      try {
        const newItems = await props.fetchFunction(page.value); // 假设 fetchFunction 接受筛选条件作为参数
        console.log('newItems', newItems);
        if (newItems.length > 0) {
          items.value.push(...newItems);
          page.value++;
        } else {
          emit("update:hasMore", false);
          hasMore.value = false; // 直接设置 hasMore 为 false
          return; // 防止继续执行后续代码
        }
        console.log('items', items);
      } catch (error) {
        console.error("加载数据失败", error);
      } finally {
        loading.value = false;
      }
    };

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && !loading.value && hasMore.value) {
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight + 30;
        if (scrollTop + clientHeight >= scrollHeight) {
          fetchItems();
        }
      }
    };

    onMounted(() => {
      nextTick(() => {
        if (scrollbar.value) {
          const wrap = scrollbar.value.wrapRef;
          if (wrap) {
            wrap.addEventListener('scroll', handleScroll);
          } else {
            console.error('wrapRef is undefined');
          }
        } else {
          console.error('scrollbar ref is undefined');
        }
        fetchItems();
      });
      
    });
    onBeforeUnmount(() => {
      if (scrollbar.value) {
        const wrap = scrollbar.value.wrapRef;
        if (wrap) {
          wrap.removeEventListener('scroll', handleScroll);
        }
      }
    });

    watch(() => props.hasMore, (newValue) => {
      hasMore.value = newValue;
    });

    // 监听筛选条件对象的变化
    watch(() => props.filterCriteria, async () => {
      // 清空已有数据并重置页码
      items.value = [];
      page.value = 1;
      // 重新加载基于新筛选条件的数据
      await nextTick();  // 确保数据更新完成后再触发加载
      fetchItems();
    }, { deep: true });  // 深度监听对象中的每个属性

    return {
      items,
      loading,
      handleScroll,
      fetchItems,
      setScrollbarRef,
    };
  },
});
</script>

<style scoped lang="scss"">
  .infinite-scroll-container {
    width: 100% !important;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .el-scrollbar__wrap{
      width: 100% !important;
    }
  }

  .loading {
    text-align: center;
    padding: 10px;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 46px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
  .no-more-data {
    display: block;
    text-align: center;
    margin: 20px 0;
    padding-top: 20px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 24px;
  }
</style>
