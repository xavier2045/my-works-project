import { onMounted, onUnmounted } from 'vue';

export function useResizeHandler(cleanup: () => void, createAbilityCircles: () => void) {
  let resizeTimeout: number;

  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      cleanup();
      createAbilityCircles();
    }, 150);
  };

  const initResizeHandler = () => {
    window.addEventListener('resize', handleResize, { passive: true });
  };

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimeout);
  });
  onMounted(() => {
    initResizeHandler();
  });
  return {
    initResizeHandler
  };
} 