<template>
  <!-- 保持原有模板结构不变 -->
  <div class="cascader">
    <div class="cascader-input" @click="toggleDropdown">
      <div class="cascader-avatar">
        <el-image
          :src="selectedAvatar"
          fit="cover"
        >
          <template #error>
            <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
          </template>
        </el-image>
      </div>
      <div class="cascader-label">
        <span class="multi-line-1">{{ selectedLabel }}</span>
        <div class="arrow" :class="{ 'open': dropdownOpen }">
          <i :class="`icon font_family ${cascaderIcon}`"></i>
        </div>
      </div>
    </div>
    <div class="cascader-dropdown" v-if="dropdownOpen">
      <div class="cascader-menus">
        <ul class="cascader-menu" v-for="(options, level) in currentOptions" :key="level">
          <li
            v-for="option in options"
            :key="option.value"
            :class="{ 'selected': option.value === selectedIds[level] }"
            @click="handleSelect(option, level)"
          >
            {{ option.label }}
            <i v-if="option.children?.length" class="expand-icon" :class="`icon font_family ${cascaderIcon}`"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';

interface TreeNode {
  value: string;
  label: string;
  avatar?: string;
  children?: TreeNode[];
}

export default defineComponent({
  name: 'TaskSelect',
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
    // 响应式状态
    const dropdownOpen = ref(false);
    const selectedIds = ref<string[]>([]);
    const currentOptions = ref<TreeNode[][]>([props.options]);
    const selectedLabel = ref(props.modelValue);
    const cascaderIcon = ref('icon-a-jiantouxiangxiazhankai24');
    const selectedAvatar = ref('');

    // 根据 adminUserId 查找并设置选中的节点
    const findAndSetSelectedNodeByAdminUserId = (options: TreeNode[], adminUserId: string, level: number = 0): boolean => {
      for (const option of options) {
        if (option.adminUserId === Number(adminUserId)) {
          selectedIds.value[level] = option.adminUserId;
          selectedLabel.value = option.label;
          selectedAvatar.value = option.avatar || '';
          return true;
        }
        if (option.children && findAndSetSelectedNodeByAdminUserId(option.children, adminUserId, level + 1)) {
          selectedIds.value[level] = option.value;
          return true;
        }
      }
      return false;
    };
    // 初始化时根据 modelValue 进行回显
    if (props.modelValue) {
      findAndSetSelectedNodeByAdminUserId(props.options, props.modelValue);
    }

    // 监听 modelValue 变化，进行回显
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        findAndSetSelectedNodeByAdminUserId(props.options, newVal);
      }
    }, { immediate: true });

    // 方法定义
    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
      emit(dropdownOpen.value ? 'open' : 'close');
      cascaderIcon.value = dropdownOpen.value 
        ? 'icon-a-jiantouxiangshangshousuo24' 
        : 'icon-a-jiantouxiangxiazhankai24';
    };

    const handleSelect = (option: TreeNode, level: number) => {
      selectedIds.value = selectedIds.value.slice(0, level);
      selectedIds.value[level] = option.value;

      if (option.children?.length) {
        currentOptions.value = [...currentOptions.value.slice(0, level + 1), option.children];
      } else {
        currentOptions.value = currentOptions.value.slice(0, level + 1);
        dropdownOpen.value = false;
        selectedLabel.value = option.label;
        selectedAvatar.value = option.avatar || '';
        emit('update:modelValue', option.value);
      }
    };

    // 监听器
    watch(() => props.options, (newVal) => {
      currentOptions.value = [newVal];
      findAndSetSelectedNodeByAdminUserId(newVal, props.modelValue);
    }, { immediate: true });

    return {
      dropdownOpen,
      selectedIds,
      currentOptions,
      selectedLabel,
      selectedAvatar,
      cascaderIcon,
      toggleDropdown,
      handleSelect
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
    cursor: pointer;
    border: none;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 24px;
    text-align: right;
    font-style: normal;
    text-transform: none;
    display: flex;
    .cascader-avatar{
      width: 35px;
      height: 35px;
      flex-shrink: 0;
      border-radius: 50%;
      background: url(@/assets/images/task/avatar_bg.png) no-repeat center center;
      background-size: 100% 100%;
      :deep(.el-image, img) {
        width: 70%;
        height: 70%;
        border-radius: 50%;
        display: block;
        margin: 15% auto;
      }
    }
    .cascader-label{
      flex: 1;
      width: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .arrow {
        width: 35px;
        height: 35px;
        flex-shrink: 0;
        margin-left: 7px;
        display: inline-block;
        transition: transform 0.2s;
        background: url(@/assets/images/task/back_bg.png) no-repeat center center;
        background-size: 100% 100%;
        &:hover{
            background: url(@/assets/images/task/back_bg_hover.png) no-repeat center center;
            background-size: 100% 100%;
        }
        i {
          font-size: 20px;
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
  }

  .cascader-dropdown {
    width: 140px;
    position: absolute;
    top: 40px;
    left: -15px;
    border: 1px solid rgba(255, 255, 255, 0.38);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    display: flex;
    border-radius: 12px;
    background: rgba(36, 35, 35, 1);
    .cascader-menus {
      width: 100%;
      display: flex;
      border-radius: 12px;
      overflow: hidden;
      .cascader-menu {
        min-width: calc(140px - 40px);
        max-width: calc(140px - 40px);
        max-height: 497px;
        list-style: none;
        margin: 0;
        background: rgba(255, 255, 255, 0.36);
        backdrop-filter: blur(56px);
        
        padding: 18px 20px 15px 20px;
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
          line-height: 46px;
          text-align: center;
          font-style: normal;
          text-transform: none;
          color: rgba(255, 255, 255, 0.58);
          border-radius: 18px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.selected {
            color: rgba(255, 255, 255, 1);
          }
          &:hover {
            color: rgba(255, 255, 255, 1);
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
        }
      }
    }
  }
}
</style>
