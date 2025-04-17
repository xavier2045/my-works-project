<template>
  <div class="search-combo-box">
    <div class="search-box">
      <div class="search-main">
        <div class="search-icon">
            <i class="icon font_family icon-fangdajing24"></i>
        </div>
        <div class="search-input">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search..."
              @input="debouncedSearch"
              @keyup.enter="debouncedSearch"
            />
        </div>
        <div class="search-clear">
            <img :src="spaceLine" alt="" />
        </div>
      </div>
    </div>
    <div class="search-select">
      <!-- <select v-model="selectedOption" @change="emitOptionChange">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select> -->
      <TreeSelect
        :options="options"
        v-model="selectedOption"
        placeholder="所有的"
        @selected="emitOptionChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import TreeSelect from '@/components/TreeSelect/index.vue';
import spaceLine from '@/assets/images/common/spaceLine.png';

export default defineComponent({
  name: 'SearchComboBox',
  props: {
    options: {
      type: Array as PropType<Array<{ label: string; value: string }>>,
      required: true,
    },
  },
  emits: ['update:searchQuery', 'update:selectedOption'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const selectedOption = ref<number | undefined>(undefined);

    const debouncedSearch = debounce(() => {
      emit('update:searchQuery', searchQuery.value);
    }, 300); // 300毫秒的防抖时间

    const emitOptionChange = () => {
      emit('update:selectedOption', selectedOption.value);
    };

    watch(selectedOption, (newValue) => {
      // 如果需要，可以在这里实现节流逻辑
      emitOptionChange();
    });

    return {
      TreeSelect,
      spaceLine,
      searchQuery,
      selectedOption,
      debouncedSearch,
      emitOptionChange
    };
  },
});
</script>

<style lang='scss' scoped>
.search-combo-box {
  display: flex;
  justify-content: center;
  padding: 11px 19px 11px 19px;
  .search-box{
    width: 230px;
    .search-main{
      width: 100%;
      height: 52px;
      display: flex;
      cursor: pointer;
      .search-icon{
          width: 24px;
          i{
              font-size: 24px;
              color: rgba(255, 255, 255, .8);
              display: block;
              margin-right: 6px;
              line-height: 52px;
          }
      }
      .search-input{
          flex-grow: 1;
          width: 0;
          height: 52px;
          input{
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
              font-size: 16px;
              color: rgba(255, 255, 255, .9);
              line-height: 52px;
              display: block;
              background-color: inherit;
          }
          input[type="text"]::placeholder {
              color: rgb(255, 255, 255, 0.68);
              font-size: 16px;
          }
      }
      .search-clear{
          width: 4px;
          margin: 0 3px;
          img{
              width: 4px;
              height: 52px;
              display: block;
          }
      }
    }
  }
  .search-select{
    width: 100px;
    height: 32px;
    border-radius: 12px;
    padding: 0 10px;
    margin: 10px 0;
    // background-color: rgba(255, 255, 255, .16);
    display: inline-block;
    font-weight: 500;
    font-size: 14px;
    color: rgb(255, 255, 255, .7);
    line-height: 32px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    :deep(.cascader-input){
      color: #FFFFFF;
      font-size: 14px;
      .arrow{
        i{
          color: #FFFFFF
        }
      }
    }
    :deep(.cascader-dropdown) {
      width: calc(100% + 40px);
      box-shadow: 4px 0px 6px 0px rgba(0, 0, 0, 0.16);
      border-radius: 12px;
      top: 38px;
      left: -20px;
      .cascader-menu{
        padding: 0;
        border-radius: 12px;
        li{
          color: rgb(255, 255, 255, .7);
          font-size: 14px;
          line-height: 38px;
          &:hover{
            color: #FFFFFF;
          }
        }
        .selected{
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>