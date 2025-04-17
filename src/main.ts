// src/main.ts
import { createApp, watch } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate  from 'pinia-plugin-persistedstate';
import i18n from './locales';
import echarts from '@/utils/echarts';
import { initAOS } from './animations/aos';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'wc-waterfall'
import { aeUseStore } from '@/stores/user';
import popupPlugin from '@/utils/popupPlugin';
import WebSocketService from '@/services/publicWebSocket';
import { useNotificationStore } from '@/stores/notificationStore';
import 'amfe-flexible';
import './utils/flexible';

import 'animate.css';
import 'amfe-flexible';
import './assets/styles/fonts.css';
import './assets/font_icon/iconfont.css';
import './style.css';
import { registerApps } from './micro';


const app = createApp(App);

app.config.globalProperties.$echarts = echarts;

const pinia = createPinia();
// 使用插件
pinia.use(piniaPluginPersistedstate ); // 默认情况下，它会持久化所有 store

// 或者指定哪些 store 要持久化
// pinia.use(persist({
  // 你可以在这里指定哪些 store 需要持久化
  // 例如：
  // include: ['userStore', 'settingsStore']
// }));


function setRemUnit() {
  const designWidth = 1920;
  const scale = document.documentElement.clientWidth / designWidth;
  document.documentElement.style.fontSize = 100 * scale + 'px';

  // const baseWidth = 1920;
  // const docEl = document.documentElement;
  // const clientWidth = docEl.clientWidth || window.innerWidth;
  // const scalingFactor = clientWidth / baseWidth;
  // docEl.style.fontSize = `${scalingFactor * 192}px`;

  // // 获取当前屏幕宽度
  // const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
  // // 设计稿宽度
  // const designWidth = 1920;
  // // 基准屏幕宽度（以 2560px 作为基准）
  // const baseWidth = 2560;
  // // 基准 font-size（在 2560px 屏幕上，1rem = 16px，与 rootValue 一致）
  // const baseFontSize = 16;
  // // 动态计算 font-size
  // // 在 2560px 屏幕上，fontSize 应该为 16px
  // // 在其他屏幕上，按比例调整
  // const fontSize = (clientWidth / baseWidth) * baseFontSize;
  // // 设置上下限，避免过大或过小
  // const maxFontSize = 30; // 例如 3840px 屏幕时，fontSize ≈ 24px，限制为 20px
  // const minFontSize = 12; // 例如 1366px 屏幕时，fontSize ≈ 8.5px，限制为 12px
  // const adjustedFontSize = Math.min(Math.max(fontSize, minFontSize), maxFontSize);
  // // 设置 html 的 font-size
  // document.documentElement.style.fontSize = `${adjustedFontSize}px`;
  // document.documentElement.style.fontSize = `${fontSize}px`;
}

// setRemUnit();
// window.addEventListener('resize', setRemUnit);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(ArcoVue);
app.use(popupPlugin);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount('#app');
// 初始化 WebSocketService 单例
const wsService = WebSocketService.getInstance();

/** webSocket公共区域 **/
console.log('import.meta.env.VITE_WS_URL',import.meta);
console.log('import.meta.env.VITE_WS_URL',import.meta.env);
console.log('import.meta.env.VITE_WS_URL',import.meta.env.VITE_WS_URL);
const userStore = aeUseStore();
const userInfo = userStore.getUserInfo;
// 注册推送消息类型处理逻辑
  // 动态监听登录状态
  console.log('userInfo', userInfo.userName);
  console.log('userInfo', userInfo.uuid);
  console.log('userInfo', userInfo.token);
watch(
  () => userInfo.userName,
  (userName) => {
    if (userName) {
      // 用户登录后初始化 WebSocket 连接
      wsService.connect(
        import.meta.env.VITE_WS_URL, // WebSocket 地址
        300000,                     // 无操作超时时间，5 分钟
        userInfo.uuid,           // 用户 ID
        userInfo.token         // 登录 Token
      );

      // 注册系统消息处理器
      wsService.onMessage('system', (data) => {
        console.log('System notification:', data.payload.message);
      });

      // 注册私聊消息处理器
      wsService.onMessage('private', (data) => {
        console.log('Private message received:', data.payload.content);
      });

      // 注册群聊消息处理器
      wsService.onMessage('group', (data) => {
        console.log('Group message received:', data.payload.content);
      });
    } else {
      // 用户登出后断开 WebSocket 连接
      wsService.disconnect();
    }
  },
  { immediate: true } // 初始化时立即检查状态
);
initAOS();

// 注册微应用
registerApps();
