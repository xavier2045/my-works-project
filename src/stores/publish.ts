   // src/stores/publish.ts
   // Events: 活动  Quest: 任务  works: 作品
  //  import { info } from 'console';
  import { defineStore } from 'pinia';

  export const aePublishStore = defineStore('publish', {
    state: () => ({
      eventsInfo: {
         data: {}
      } as any, // 这里存放您的缓存数据
      questInfo: {
        data: {}
      },
      worksInfo: {
        data: {}
      }
    }),
    getters: {
      getUserInfo: (state) => state.eventsInfo,
      getWorksInfo: (state) => state.worksInfo,
      getQuestInfo: (state) => state.questInfo,
    },
    actions: {
      setEventsInfo(info: any) {
        this.eventsInfo = info;
      },
      setWorksInfo(info: any) {
        this.worksInfo = info;
      },
      setQuestInfo(info: any) {
        this.questInfo = info;
      }
    },
    persist: {
      key: 'publish',
      storage: sessionStorage, // 你可以选择 localStorage 或 sessionStorage
    },
  });