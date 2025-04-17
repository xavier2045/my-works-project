// stores/menu.ts
// 用于存储DAO列表的页面状态
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    currentPage: 'pageOne',
  }),
  actions: {
    setPage(page: string) {
      this.currentPage = page;
    }
  }
});
