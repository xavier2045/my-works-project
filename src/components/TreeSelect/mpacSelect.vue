<template>
  <div class="cascader" ref="cascaderRef">
    <div class="cascader-input" @click="toggleDropdown">
      <span>{{ selectedLabel }}</span>
      <div class="arrow" :class="{ 'open': dropdownOpen }">
        <i :class="`icon font_family ${cascaderIcon}`"></i>
      </div>
    </div>
    <div class="cascader-dropdown" v-if="dropdownOpen" ref="dropdownRef">
      <div class="cascader-menus">
        <ul class="cascader-menu" v-for="(options, level) in currentOptions" :key="level">
          <li
            v-for="option in options"
            :key="option.countryCode"
            :class="{ 'selected': option.countryCode === selectedIds[level] }"
            @click="handleSelect(option, level)"
          >
            <div class="selected-item">
              <div class="selected-item-countryName">{{ option.countryName }}</div>
              <div class="selected-item-countryCode">{{ option.countryCode }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType, onMounted, onUnmounted } from 'vue';

interface TreeNode {
  id: number;
  countryName: string;
  countryCode: string;
}

export default defineComponent({
  name: 'TreeSelect',
  props: {
    options: {
      type: Array as PropType<TreeNode[]>,
      required: true,
    },
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'open', 'close'],
  setup(props, { emit }) {
    const dropdownOpen = ref(false);
    const selectedIds = ref<string[]>([]);
    const currentOptions = ref<TreeNode[][]>([props.options]);

    const selectedLabel = ref(props.placeholder);
    const cascaderIcon = ref('icon-a-jiantouxiangxiazhankai24');
    const cascaderRef = ref<HTMLElement | null>(null);
    const dropdownRef = ref<HTMLElement | null>(null);
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
      selectedIds.value = selectedIds.value.slice(0, level);
      selectedIds.value[level] = option.countryCode;

      if (option.children && option.children.length > 0) {
        currentOptions.value = currentOptions.value.slice(0, level + 1);
        currentOptions.value[level + 1] = option.children;
      } else {
        currentOptions.value = currentOptions.value.slice(0, level + 1);
        dropdownOpen.value = false;
        selectedLabel.value = option.countryCode;
        emit('update:modelValue', option.countryCode);
        emit('close');
      }
    };

    const closeDropdownIfClickedOutside = (event: MouseEvent) => {
      if (dropdownOpen.value && cascaderRef.value && !cascaderRef.value.contains(event.target as Node)) {
        dropdownOpen.value = false;
        emit('close');
        cascaderIcon.value = 'icon-a-jiantouxiangxiazhankai24';
      }
    };

    onMounted(() => {
      document.addEventListener('click', closeDropdownIfClickedOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdownIfClickedOutside);
    });

    watch(
      () => props.options,
      (newOptions) => {
        currentOptions.value = [newOptions];
      },
      { immediate: true }
    );

    return {
      cascaderRef,
      dropdownRef,
      dropdownOpen,
      selectedIds,
      currentOptions,
      selectedLabel,
      toggleDropdown,
      handleSelect,
      cascaderIcon,
      closeDropdownIfClickedOutside,
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
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    border: none;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 40px;
    text-align: right;
    font-style: normal;
    text-transform: none;
    .arrow {
      width: 35px;
      height: 35px;
      margin: 0 2.5px;
      display: inline-block;
      transition: transform 0.2s;
      background: url(@/assets/images/task/back_bg.png) no-repeat center center;
      background-size: 100% 100%;
      &:hover{
          background: url(@/assets/images/task/back_bg_hover.png) no-repeat center center;
          background-size: 100% 100%;
      }
      i {
        font-size: 18px;
        color: #FFFFFF;
        line-height: 35px;
        display: block;
        text-align: center;
      }
    }
    .open {
      transition: transform 0.2s;
    }
  }

  .cascader-dropdown {
    width: 216px;
    max-width: 140px;
    position: absolute;
    top: 40px;
    left: 0px;
    border: 1px solid rgba(255, 255, 255, 0.38);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    z-index: 999;
    display: flex;
    border-radius: 12px;
    background: rgba(36, 35, 35, 1);
    .cascader-menus {
      width: 100%;
      display: flex;
      border-radius: 12px;
      overflow: hidden;
      .cascader-menu {
        min-width: calc(140px - 20px);
        max-width: calc(140px - 20px);
        max-height: 127px;
        list-style: none;
        margin: 0;
        background: rgba(255, 255, 255, 0.36);
        backdrop-filter: blur(56px);
        padding: 10px 10px 15px 10px;
        overflow-y: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
        li {
          cursor: pointer;
          align-items: center;
          font-weight: 400;
          font-size: 16px;
          line-height:32px;
          text-align: center;
          font-style: normal;
          text-transform: none;
          color: rgba(255, 255, 255, 0.58);
          border-radius: 6px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 10px;
          &.selected {
            color: rgba(255, 255, 255, 1);
          }
          &:hover {
            color: rgba(255, 255, 255, 1);
            background-color: rgba(121, 120, 120, 0.08);
          }
          .expand-icon {
            // border: solid #c0c4cc;
            // border-width: 0 2px 2px 0;
            display: inline-block;
            // transform: rotate(90deg);
            position: absolute;
            top: 8px;
            right: -20px;
          }
          .selected-item{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
