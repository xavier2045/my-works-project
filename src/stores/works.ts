   // src/stores/works.ts
import { defineStore } from 'pinia';
import { reactive } from 'vue';

   export const aeWorksStore = defineStore('WorksStore', {
     state: () => reactive({
      worksInfo: {
          worksIdList: [], // 存取提案id列表
          isRouterType: 1, // 1:作品广场 2:我的作品 3：新增
          params: {}, // 存取作品列表参数，用于详情页查询使用
          currentId: '', // 当前作品id
          isCoCreator: false, // 查看共创者列表
        } as any, // 这里存放您的缓存数据
     }),
     getters: {
       getWorksInfo: (state) => state.worksInfo,
     },
     actions: {
       setUserInfo(info: any) {
         this.worksInfo = info;
       },
     },
     persist: {
        key: 'WorksStore',
        storage: sessionStorage, // 你可以选择 localStorage 或 sessionStorage
      },
   });