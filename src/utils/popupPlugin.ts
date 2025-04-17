// src/plugins/popupPlugin.ts

import { App, createVNode, render } from 'vue';
import ErrorTipPopup from '@/components/ErrorTipPopup/index.vue';

let showPopupInstance: ((message: string, type?: string, duration?: number) => void) | null = null;

export default {
  install(app: App) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const vm = createVNode(ErrorTipPopup);
    render(vm, container);

    showPopupInstance = (message: string, type: string = 'error', duration: number = 3000) => {
      vm.component?.exposed?.showPopup(message, type, duration);
    };

    app.config.globalProperties.$showPopup = showPopupInstance;
  },
};

export function globalShowPopup(message: string, type?: string, duration?: number) {
  if (showPopupInstance) {
    showPopupInstance(message, type, duration);
  } else {
    console.warn('Popup instance is not initialized.');
  }
}
