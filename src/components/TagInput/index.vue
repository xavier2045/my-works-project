<template>
  <div class="tag-input-container">
    <div class="tag-input-wrapper">
      <div class="tags-container">
        <div 
          v-for="(tag, index) in selectedTags"
          :key="index"
          class="tag-item"
          @click.stop="removeTag(index)"
        >
          {{ tag }}
        </div>
      </div>
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        class="inline-input"
        :placeholder="selectedTags.length === 0 ? '请输入#作为开始，如：#标签名' : ''"
        @input="handleInput"
        @keydown.delete="handleDelete"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
      />
    </div>
    
    <ul class="suggestion-list" v-if="showSuggestions">
      <li
        v-for="(tag, index) in suggestionTags"
        :key="index"
        class="suggestion-item"
        @mousedown.prevent="addTag(tag.name)"
      >
        <span>#{{ tag.name }}</span>
        <span>{{ tag.citeId }}</span>
      </li>
    </ul>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, watch, toRefs } from "vue";
  import { worksTagsPrefix } from "@/api/work";
  import { showPopup } from "@/utils/usePopup";
  
  export default defineComponent({
    name: "TagInput",
    props: {
      value: {
        type: Array as () => string[], // 明确指定 string[]
        default: () => [],
      },
    },
    emits: ["update:value"],
    setup(props, { emit }) {
      const inputValue = ref("");
      const selectedTags = ref<string[]>([]);
      const suggestionTags = ref<{citeId: 0, citeType:string, name:string, imgUrl:string, desc:string}[]>([]);
      const showSuggestions = ref(false);
      const inputRef = ref<HTMLInputElement | null>(null);
      // 模拟异步获取标签数据 
      const fetchTags = async (query: string) => {
        console.log(query, '输入的标签');
        const resData = { name: query };
        try {
          const response = await worksTagsPrefix(resData);
          const { code, data, message } = response;
          if (code !== 200) {
            showPopup(message, 'error', 3000);
            return;
          }
          suggestionTags.value = data.filter((tag: any) =>
            tag.name.toLowerCase().includes(query.toLowerCase())
          );
        } catch (error) {
          console.error(error);
        }
      };
      // 新增删除键处理
      const handleDelete = () => {
        if (!inputValue.value && selectedTags.value.length > 0) {
          selectedTags.value.pop();
          emit("update:value", [...selectedTags.value]);
        }
      };
    
      // 处理输入事件
      const handleInput = (event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        inputValue.value = value;
  
        const hashIndex = value.lastIndexOf('#');
        if (hashIndex === -1) {
          showSuggestions.value = false;
          return;
        }
        // 处理多#号自动分割
        const segments = value.split('#').slice(1);
        if (segments.length > 1) {
          const lastSegment = segments.pop();
          segments.forEach(segment => {
            if (segment.trim()) addTag(segment.trim());
          });
          inputValue.value = lastSegment ? `#${lastSegment}` : '#';
        }
  
        const query = value.slice(hashIndex + 1);
        showSuggestions.value = true;

        if (query !== '') {
          fetchTags(query);
        }
        
      };
  
      // 添加标签逻辑
      const addTag = (tagName: string) => {
        tagName = '#'+tagName.trim();
        if (!tagName || selectedTags.value.includes(tagName)) return;
  
        selectedTags.value.push(tagName);
        inputValue.value = '';
        showSuggestions.value = false;
        emitUpdate();
      };
  
      // 处理失焦事件
      const handleBlur = () => {
        const value = inputValue.value;
        if (!value) return;
  
        // 分割所有#号内容
        value.split('#').slice(1)
          .filter(segment => segment.trim())
          .forEach(segment => addTag(segment));
  
        inputValue.value = '';
        showSuggestions.value = false;
      };
  
      // 处理回车键
      const handleEnter = () => {
        const query = inputValue.value.slice(
          inputValue.value.lastIndexOf('#') + 1
        );
        if (query.trim()) addTag(query);
      };
  
      // 移除标签
      const removeTag = (index: number) => {
        selectedTags.value.splice(index, 1);
        emitUpdate();
      };
  
      // 更新值
      const emitUpdate = () => {
        console.log('emitUpdate', selectedTags.value);
        emit("update:value", [...selectedTags.value]);
      };
  
      // 监听外部值变化
      watch(
        () => props.value,
        (newVal) => {
          if (newVal && Array.isArray(newVal) && newVal.length > 0) {
            selectedTags.value = [...newVal];
          } else {
            selectedTags.value = [];
          }
        },
        { immediate: true, deep: true }
      );

      onMounted(() => {
        // 确保在组件挂载时，如果props.value有值，也同步到selectedTags
        if (props.value && Array.isArray(props.value) && props.value.length > 0) {
          selectedTags.value = [...props.value];
        }
      });
  
      return {
        inputValue,
        selectedTags,
        suggestionTags,
        showSuggestions,
        handleInput,
        handleBlur,
        handleEnter,
        addTag,
        removeTag,
        handleDelete,
        inputRef
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .tag-input-container {
    width: 100%;
    max-width: 100%;
    position: relative;
  }
  
  .tag-input-wrapper {
  display: flex;
  align-items: center;
  min-height: 40px;
  border-radius: 8px;
  cursor: text;
  overflow: hidden;
}

.tags-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
  gap: 8px;
}

/* 隐藏滚动条（Chrome/Safari） */
.tags-container::-webkit-scrollbar {
  display: none;
}

.tag-item {
  flex-shrink: 0;
  padding: 2px 0;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  color: rgb(255, 255, 255, 1);
}

.tag-item:hover {
  text-decoration: line-through;
}

.tag-item:hover::after {
  content: "×";
  margin-left: 4px;
  color: #ff4444;
}

.inline-input {
  flex: 1;
  min-width: 80px;
  padding: 4px 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: rgb(255, 255, 255, 0.7);
  
}
.inline-input::placeholder {
  color: rgb(255, 255, 255, 0.38);
  font-size: 14px;
}
  
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .tag {
    display: inline-flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 2px 10px;
    border-radius: 3px;
    font-size: 14px;
    color: #333;
  }
  
  .close {
    cursor: pointer;
    color: #666;
    font-size: 12px;
    margin-left: 5px;
  }
  
  input {
    min-width: 100px;
    flex: 1;
    padding: 2px;
    font-size: 14px;
    border: none;
    outline: none;
  }
  
  .suggestion-list {
    position: absolute;
    width: calc(100% + 130px);
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid rgb(255, 255, 255, 0.38);
    border-radius: 12px;
    left: -130px;
    z-index: 1000;
    margin-top: 2px;
    list-style: none;
    padding: 0;
    background: rgb(58, 58, 58, 1);
    // backdrop-filter: blur(9px);
  }
  
  .suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    span{
      color: rgb(255, 255, 255, 1);
      &:last-child{
        color: rgb(255, 255, 255, 0.7);
      }
    }
  }
  
  .suggestion-item:hover {
    background-color: rgb(255, 255, 255, 0.18);
  }
  </style>