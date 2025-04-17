<template>
    <div class="menu-page" @mousedown="onMouseDown" @mouseup="onMouseUp">
        <!-- fade：渐显 -->
        <router-view :key="$route.fullPath" v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>
  
<script lang="ts" setup>
    import { ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    // 路由器和路由实例
    const router = useRouter();
    const route = useRoute();

    // Reactive data
    const startX = ref(0);
    const startY = ref(0);
    const isDragging = ref(false); // 用于跟踪用户是否在拖动的标志
    const swipeThreshold = 50; // 检测滑动的最小距离(以像素计)

    // 滑动导航逻辑
    const swipeLeft = () => {
        if (route.path === '/dao/pageOne') {
            router.push('/dao/pageTwo');
        } else if (route.path === '/dao/pageThree') {
            router.push('/dao/pageFour');
        }
    };

    const swipeRight = () => {
        if (route.path === '/dao/pageTwo') {
            router.push('/dao/pageOne');
        } else if (route.path === '/dao/pageFour') {
            router.push('/dao/pageThree');
        }
    };

    const swipeUp = () => {
        if (route.path === '/dao/pageOne') {
            router.push('/dao/pageThree');
        } else if (route.path === '/dao/pageTwo') {
            router.push('/dao/pageFour');
        }
    };

    const swipeDown = () => {
        if (route.path === '/dao/pageThree') {
            router.push('/dao/pageOne');
        } else if (route.path === '/dao/pageFour') {
            router.push('/dao/pageTwo');
        }
    };

    // 鼠标事件处理程序
    const onMouseDown = (event: MouseEvent) => {
        startX.value = event.clientX;
        startY.value = event.clientY;
        isDragging.value = true;
    };

    const onMouseUp = (event: MouseEvent) => {
        if (!isDragging.value) return;

        const endX = event.clientX;
        const endY = event.clientY;

        const deltaX = endX - startX.value;
        const deltaY = endY - startY.value;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // 确定移动是否大于划动的阈值
        if (absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) {
            if (absDeltaX > absDeltaY) {
            // 水平滑动
            if (deltaX > 0) {
                swipeRight();
            } else {
                swipeLeft();
            }
            } else {
            // 垂直滑动
            if (deltaY > 0) {
                swipeDown();
            } else {
                swipeUp();
            }
            }
        }

        // 重置拖动状态
        isDragging.value = false;
    };
</script>

<style scoped>
.menu-page {
  width: 100vw;
  height: 100vh;
  user-select: none;
}
/* 渐显加载效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

  