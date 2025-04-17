<template>
  <div class="cascader">
    <div class="cascader-input" @click="toggleDropdown">
      <span>{{ selectedLabel }}</span>
      <div class="arrow" :class="{ 'open': dropdownOpen }">
        <i :class="`icon font_family ${cascaderIcon}`"></i>
      </div>
    </div>
    <div class="cascader-dropdown" v-if="dropdownOpen" @click.stop>
      <div class="cascader-menus">
        <ul class="cascader-menu" v-for="(options, level) in currentOptions" :key="level">
          <li
            v-for="option in options"
            :key="option.value"
            :class="{ 'selected': option.value === selectedIds[level] }"
            @click="handleSelect(option, level)"
          >
            <span v-if="option && option.color" :style="{backgroundColor: option.color}"></span>
            {{ option ? option.label : '' }}
            <i v-if="option && option.children && option.children.length > 0" class="expand-icon" :class="`icon font_family ${cascaderIcon}`"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType, onMounted, onBeforeUnmount } from 'vue';

interface TreeNode {
  value: string;
  label: string;
  color: string;
  children?: TreeNode[];
}

export default defineComponent({
  name: 'TreeSelect',
  props: {
    options: {
      type: Array as PropType<TreeNode[]>,
      required: true,
    },
    modelValue: {
      type: Number,
      default: undefined
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'open', 'close', 'selected'],
  setup(props, { emit }) {
    const dropdownOpen = ref(false);
    const selectedIds = ref<string[]>([]);
    const currentOptions = ref<TreeNode[][]>([props.options]);

    const selectedLabel = ref(props.placeholder);
    const cascaderIcon = ref('icon-a-jiantouxiangxiazhankai24');

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
      if (dropdownOpen.value) {
        emit('open');
        cascaderIcon.value = 'icon-a-jiantouxiangshangshousuo24';
      } else {
        emit('close');
        cascaderIcon.value = 'icon-a-jiantouxiangxiazhankai24';
      }
    };

    const handleSelect = (option: TreeNode, level: number) => {
      if (!option) return;
      
      selectedIds.value = selectedIds.value.slice(0, level);
      selectedIds.value[level] = option.value;

      if (option.children && option.children.length > 0) {
        currentOptions.value = currentOptions.value.slice(0, level + 1);
        currentOptions.value[level + 1] = option.children;
      } else {
        currentOptions.value = currentOptions.value.slice(0, level + 1);
        dropdownOpen.value = false;
        selectedLabel.value = option.label;
        emit('update:modelValue', option.value);
        emit('close');
        emit('selected', option); // 发送选中的选项
      }
    };

    const closeDropdown = (event: MouseEvent) => {
      const cascaderEl = document.querySelector('.cascader');
      if (!event || !event.target || !(event.target instanceof Node) || !cascaderEl || !cascaderEl.contains(event.target as Node)) {
        dropdownOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', closeDropdown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });

    watch(
      () => props.options,
      (newOptions) => {
        currentOptions.value = [newOptions];
      },
      { immediate: true }
    );

    return {
      dropdownOpen,
      selectedIds,
      currentOptions,
      selectedLabel,
      toggleDropdown,
      handleSelect,
      cascaderIcon,
    };
  },
});
</script>

<style lang="scss" scoped>
.cascader {
  position: relative;
  display: inline-block;
  width: 100%;
  .cascader-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border: none;
    background-color: #161b30;
    border-radius: 30px;
    padding: 8px 15px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #1e2543;
      transform: translateY(-2px);
      box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
    }
    
    span {
      min-width: 45px;
      text-align: center;
      font-weight: 500;
      font-size: 15px;
      color: white;
    }
    
    .arrow {
      width: 24px;
      height: auto;
      margin-left: 7px;
      display: inline-block;
      transition: transform 0.2s;
      i {
        font-size: 24px;
        color: white;
        line-height: 24px;
        display: block;
      }
    }
    
    .open {
      transition: transform 0.2s;
    }
  }

  .cascader-dropdown {
    width: 180px;
    position: absolute;
    top: 38px;
    left: -120px;
    border: none;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
    z-index: 10;
    display: flex;
    border-radius: 16px;
    overflow: hidden;
    
    .cascader-menus {
      width: 100%;
      height: auto;
      display: flex;
      .cascader-menu {
        width: 100%;
        max-height: 497px;
        list-style: none;
        margin: 0;
        padding: 8px 0;
        background: rgba(22, 27, 48, 0.95);
        backdrop-filter: blur(60px);
        border-radius: 16px;
        overflow-y: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
        li {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 16px;
          font-weight: 500;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 40px;
          border-radius: 30px;
          margin: 2px 8px;
          position: relative;
          transition: all 0.2s ease;
          
          &.selected {
            color: white;
            background-color: #2b3354;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          }
          
          &:hover {
            background-color: #1e2543;
            color: #FFFFFF;
            transform: translateX(2px);
          }
          
          span {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            display: inline-block;
            margin-right: 8px;
          }
          
          .expand-icon {
            display: inline-block;
            position: absolute;
            top: 8px;
            right: 16px;
          }
        }
      }
    }
  }
}
</style>
