<template>
  <div class="generic-table-container">
    <div class="table-header">
      <div
        class="header-cell"
        v-for="(column, index) in columns"
        :key="index"
        :style="getHeaderStyle(column)"
        @click="handleHeaderClick(column)"
      >
        {{ column.label }}
        <span v-if="column.filterable" class="filter-indicator relievoShadow">
          <i 
            :class="['filter-icon icon font_family', column.filterable && filterOpenStates[column.prop] ? 'icon-a-jiantouxiangshangshousuo20' : 'icon-a-jiantouxiangxiazhankai20']"
          ></i>
        </span>

        <div v-if="column.filterable && filterOpenStates[column.prop]" class="filter-dropdown" @click.stop @mousedown.stop>
          <div class="filter-options">
            <div
              class="filter-option"
              v-for="(option, optIndex) in column.filterOptions"
              :key="optIndex"
              @click="applyFilter(column, option)"
            >
              {{ option.label }} <span class="option-count">({{ option.count }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="table-body overflowYAuto"
      ref="tableBody"
      @scroll="throttledScrollHandler"
    >
      <div
        class="table-row"
        v-for="(row, rowIndex) in visibleData"
        :key="rowIndex"
        :class="{ 'even-row': rowIndex % 2 === 0 }"
      >
        <div
          class="cell"
          v-for="(column, colIndex) in columns"
          :key="colIndex"
          :style="getCellStyle(column)"
        >
          <slot
            :name="`cell-${column.prop}`"
            :row="row"
            :column="column"
            :index="rowIndex"
          >
            <template v-if="column.multiFields">
              <div v-for="(field, idx) in column.multiFields" :key="idx">
                {{ row[field] }}
              </div>
            </template>
            <template v-else-if="column.customRender">
              <div v-html="column.customRender(row)"></div>
            </template>
            <template v-else>
              {{ row[column.prop] }}
            </template>
          </slot>
        </div>
      </div>

      <div v-if="loading" class="loading-more">
        <span>加载中...</span>
      </div>

      <div v-if="!loading && !hasMoreData" class="no-more-data">
        <span>没有更多数据了</span>
      </div>
    </div>

    <div class="total-amount">
      <span>作品售出总金额:</span>
      <span class="amount-value">{{ totalAmount }}元</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from 'vue';
import throttle from 'lodash/throttle';

export interface ColumnConfig {
  prop: string;
  label: string;
  width?: string;
  minWidth?: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ value: any; label: string; count: number }>;
  multiFields?: string[];
  customRender?: (row: any) => string;
}

export interface TableProps {
  columns: ColumnConfig[];
  initialPageSize: number;
  loadMoreData: (page: number, pageSize: number, filters: number) => Promise<{ data: Array<any>; total: number; pages: number }>;
  totalAmount: string;
}

export default defineComponent({
  name: 'GenericTable',
  props: {
    columns: {
      type: Array as () => ColumnConfig[],
      required: true
    },
    initialPageSize: {
      type: Number,
      default: 10
    },
    loadMoreData: {
      type: Function as () => (page: number, pageSize: number, filters: number) => Promise<{ data: Array<any>; total: number; pages: number }>,
      required: true
    },
    totalAmount: {
      type: String,
      default: '0'
    }
  },
  setup(props, { emit }) {
    const currentPage = ref(1);
    const totalPages = ref(0);
    const fullData = ref<Array<any>>([]);
    const loading = ref(false);
    const hasMoreData = ref(true);
    const tableBody = ref<HTMLElement | null>(null);
    const filterConfig = ref(0);
    const filterOpenStates = ref<Record<string, boolean>>({});
    const rowHeight = 60;
    const containerHeight = ref(400);

    // 初始化筛选状态
    props.columns.forEach(col => {
      if (col.filterable) filterOpenStates.value[col.prop] = false;
    });

    // 可视数据计算
    const visibleData = computed(() => fullData.value);

    // 滚动处理
    const handleScroll = () => {
      if (!tableBody.value) return;
      const { scrollTop, clientHeight, scrollHeight } = tableBody.value;
      
      if (scrollHeight - (scrollTop + clientHeight) < 50) {
        loadMore();
      }
    };
    const throttledScrollHandler = throttle(handleScroll, 200);

    // 数据加载逻辑
    const reloadSortedData = async () => {
      loading.value = true;
      currentPage.value = 1;
      try {
        const result = await props.loadMoreData(currentPage.value, props.initialPageSize, filterConfig.value);
        fullData.value = result.data;
        totalPages.value = result.pages;
        hasMoreData.value = currentPage.value < totalPages.value;
      } catch (error) {
        emit('error', '加载数据失败');
      } finally {
        loading.value = false;
      }
    };

    const loadMore = async () => {
      if (loading.value || !hasMoreData.value) return;
      loading.value = true;
      try {
        const result = await props.loadMoreData(++currentPage.value, props.initialPageSize, filterConfig.value);
        fullData.value = [...fullData.value, ...result.data];
        totalPages.value = result.pages;
        hasMoreData.value = currentPage.value < totalPages.value;
      } catch (error) {
        emit('error', '加载数据失败');
      } finally {
        loading.value = false;
      }
    };

    // 筛选处理
    const handleHeaderClick = (column: ColumnConfig) => {
      if (!column.filterable) return;
      Object.keys(filterOpenStates.value).forEach(key => {
        filterOpenStates.value[key] = key === column.prop ? !filterOpenStates.value[key] : false;
      });
    };

    const applyFilter = (column: ColumnConfig, option: { value: any }) => {
      filterConfig.value = option.value;
      reloadSortedData();
      filterOpenStates.value[column.prop] = false;
    };

    // 样式处理
    const getHeaderStyle = (column: ColumnConfig) => ({
      width: column.width || 'auto',
      minWidth: column.minWidth || '70px',
      cursor: column.filterable ? 'pointer' : 'default',
      position: 'relative'
    });

    const getCellStyle = (column: ColumnConfig) => ({
      width: column.width || 'auto',
      minWidth: column.minWidth || '70px',
      padding: '0 15px'
    });

    onMounted(() => {
      reloadSortedData();
      if (tableBody.value) containerHeight.value = tableBody.value.clientHeight;
    });

    return {
      visibleData,
      loading,
      hasMoreData,
      tableBody,
      filterOpenStates,
      handleHeaderClick,
      applyFilter,
      getHeaderStyle,
      getCellStyle,
      throttledScrollHandler
    };
  }
});
</script>
  
  <style scoped lang="scss">
  .generic-table-container {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .38);
    box-shadow: 8px 8px 18px 8px rgb(0, 0, 0, .18);
    background: rgba(229, 229, 229, 0.08);
  }
  
  .table-header {
    display: flex;
    height: 50px;
    line-height: 50px;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    color: rgba(255, 255, 255, 1);
    border-bottom: 1px solid rgb(255, 255, 255, .08);
    box-shadow: 4px 0px 18px 0px rgb(0, 0, 0, .28);
    border-radius: 27px 27px 0px 0px;
    .header-cell {
      padding: 0 15px;
      display: flex;
      align-items: center;
      position: relative;
      flex: 1; // Ensure even distribution
      justify-content: center; // Center align text
      .filter-indicator {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin: 15px 0 15px 8px;
        .filter-icon {
          display: block;
          font-size: 20px;
          line-height: 20px;
          text-align: center;
          color: rgba(255, 255, 255, 1);
        }
      }
  
      .filter-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        border-radius: 8px;
        margin-top: 4px;
        min-width: 150px;
        z-index: 10;
        font-size: 14px;
        line-height: 37px;
        border: 1px solid rgba(255, 255, 255, .38);
        box-shadow: 8px 8px 18px 8px rgb(0, 0, 0, .18);
        background: rgba(68, 68, 70, 1);
        .filter-options {
          .filter-option {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center; // Space between label and count
  
            &:hover {
              background-color: rgba(229, 229, 229, 0.18);
            }
  
            .option-count {
              color: #fff; // Lighter color for count
            }
          }
        }
      }
    }
  }
  
  .table-body {
    min-height: 200px;
    max-height: 400px; // Match UI image
    overflow-y: auto;
    background: rgba(229, 229, 229, 0.08);
    color: #fff;
    font-size: 14px;
    .table-row {
      display: flex;
      padding: 15px 0;
      border-bottom: 1px solid rgba(255, 255, 255, .08);
  
      &:last-child {
        border-bottom: none;
      }
  
      &.even-row {
        
      }
  
      .cell {
        padding: 0 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
        flex: 1; // Ensure even distribution
        justify-content: center; // Center align text
      }
    }
  
    .loading-more, .no-more-data {
      display: flex;
      justify-content: center;
      padding: 15px;
      color: #fff;
    }
  }
  
  .total-amount {
    display: flex;
    justify-content: space-between;
    padding: 15px 8px;
    color: #fff;
    font-size: 14px;
    border-top: 1px solid rgb(255, 255, 255, .08);
    background: rgba(229, 229, 229, 0.08);
    box-shadow: 4px 0px 18px 0px rgb(0, 0, 0, .18);
    border-radius: 0px 0px 28px 28px;
    .amount-value {
      font-weight: 400;
      font-size: 18px;
      color: #FFFFFF;
      text-align: right;
    }
  }
  .purchaser-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
    }
        
    .purchaser-details {
      line-height: 1.4;
        .purchaser-name {
          font-weight: 600;
          color: #e2e8f0;
          white-space: nowrap; // 防止文字换行
        }
        
        .purchaser-id {
          font-size: 14px;
          color: #fff;
          white-space: nowrap; // 防止文字换行
        }
    }
  }
</style>