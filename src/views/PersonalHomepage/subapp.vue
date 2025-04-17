<template>
  <div class="subapp-wrapper">
    <div id="subapp-container" class="subapp-container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, nextTick, watch, onActivated, onDeactivated } from 'vue'
import { start, loadMicroApp, MicroApp } from 'qiankun';
import { useRoute, useRouter } from 'vue-router';
import { aeUseStore } from '@/stores/user'; // 导入用户状态管理

export default defineComponent({
  name: 'SubApp',
  setup() {
    const containerRef = ref<HTMLElement | null>(null);
    const route = useRoute();
    const router = useRouter();
    const microApp = ref<MicroApp | null>(null);
    const loadAttempts = ref(0);
    const maxRetries = 3;
    const userStore = aeUseStore(); // 获取用户状态
    
    // 初始化子应用
    const initMicroApp = async () => {
      console.log('初始化子应用...');
      
      const container = document.querySelector('#subapp-container');
      if (!container) {
        console.error('容器不存在，无法加载子应用');
        return;
      }
      
      // 清空容器内容，确保干净的环境
      container.innerHTML = '';
      
      // 卸载旧实例
      if (microApp.value) {
        try {
          await microApp.value.unmount();
          console.log('旧实例已卸载');
        } catch (error) {
          console.error('卸载旧实例出错:', error);
        }
        microApp.value = null;
      }
      
      // 使用 loadMicroApp 手动加载微应用
      try {
        // 传递用户信息和其他必要参数
        const userInfo = userStore.getUserInfo;
        
        microApp.value = loadMicroApp({
          name: 'buz-main',
          entry: 'http://localhost:5174', // 使用检测到的端口
          container: '#subapp-container',
          props: {
            routerBase: '/personalHomepage/buz-main',
            timestamp: new Date().getTime(),
            userInfo: userInfo, // 传递用户信息
            mainRouter: router, // 传递主应用路由器
            navigateToMain: (path: string) => {
              router.push(path);
            }
          }
        });
        
        console.log('子应用已加载');
        loadAttempts.value = 0; // 重置尝试计数
        
        // 监听子应用加载状态
        microApp.value.mountPromise.catch(error => {
          console.error('子应用挂载失败:', error);
          if (loadAttempts.value < maxRetries) {
            loadAttempts.value++;
            console.log(`自动重试 (${loadAttempts.value}/${maxRetries})`);
            setTimeout(() => initMicroApp(), 1000);
          }
        });
      } catch (error) {
        console.error('加载子应用出错:', error);
        if (loadAttempts.value < maxRetries) {
          loadAttempts.value++;
          console.log(`自动重试 (${loadAttempts.value}/${maxRetries})`);
          setTimeout(() => initMicroApp(), 1000);
        }
      }
    };
    
    // 当组件激活时
    onActivated(() => {
      console.log('SubApp 组件已激活', route.path);
      if (route.path.includes('/personalHomepage/buz-main')) {
        initMicroApp();
      }
    });
    
    // 当组件停用时
    onDeactivated(() => {
      console.log('SubApp 组件已停用');
    });
    
    // 监听路由变化
    watch(() => route.path, (newPath, oldPath) => {
      console.log('路由变化:', newPath, '从', oldPath);
      
      if (newPath.includes('/personalHomepage/buz-main')) {
        // 使用延迟以确保DOM已完全更新
        setTimeout(() => {
          console.log('加载子应用');
          initMicroApp();
        }, 100);
      } else if (microApp.value) {
        // 如果离开子应用路由，卸载子应用
        console.log('离开子应用路由，执行卸载');
        microApp.value.unmount().then(() => {
          console.log('子应用已卸载');
          microApp.value = null;
        });
      }
    });

    onMounted(async () => {
      console.log('SubApp 容器挂载中...', route.path);
      
      // 等待DOM更新
      await nextTick();
      
      // 只有当路径匹配时才加载子应用
      if (route.path.includes('/personalHomepage/buz-main')) {
        // 延迟初始化，确保DOM已经完全准备好
        setTimeout(() => {
          initMicroApp();
        }, 100);
      }
      
      // 启动 qiankun
      start({
        sandbox: {
          experimentalStyleIsolation: true,
          strictStyleIsolation: false
        },
        singular: false
      });
    });
    
    onBeforeUnmount(async () => {
      console.log('SubApp 容器即将卸载...');
      if (microApp.value) {
        try {
          await microApp.value.unmount();
          console.log('子应用已卸载');
          microApp.value = null;
        } catch (error) {
          console.error('卸载子应用出错:', error);
        }
      }
    });

    return {
      containerRef
    }
  }
})
</script>

<style scoped>
.subapp-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.subapp-container {
  width: calc(100% - 30px);
  height: 100%;
  flex: 1;
  margin-left: 30px;
  position: relative;
  overflow: hidden;
  background: transparent;
}
</style> 