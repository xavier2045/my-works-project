import { registerMicroApps, start } from 'qiankun';
import { aeUseStore } from '@/stores/user';

// 添加类型声明
declare module 'qiankun' {
  interface App {
    name: string;
    entry: string;
    container: string;
    activeRule: string;
    props?: any;
  }
}

// 微应用列表
const apps = [
  {
    name: 'buz-main',
    entry: `//localhost:5174?timestamp=${new Date().getTime()}`,
    container: '#subapp-container',
    activeRule: '/personalHomepage/buz-main',
    props: {
      routerBase: '/personalHomepage/buz-main',
      timestamp: new Date().getTime(),
      getGlobalState: () => {
        return {
          user: {}
        };
      }
    }
  }
];

// 注册微应用
export const registerApps = () => {
  registerMicroApps(apps, {
    beforeLoad: [
      app => {
        console.log('[主应用] before load', app);
        return Promise.resolve();
      }
    ],
    beforeMount: [
      app => {
        console.log('[主应用] before mount', app);
        return Promise.resolve();
      }
    ],
    afterMount: [
      app => {
        console.log('[主应用] after mount', app);
        return Promise.resolve();
      }
    ],
    afterUnmount: [
      app => {
        console.log('[主应用] after unmount', app);
        return Promise.resolve();
      }
    ]
  });

  // 启动 qiankun
  start({
    sandbox: {
      strictStyleIsolation: false,
      experimentalStyleIsolation: true
    },
    prefetch: 'all'
  });
};