import { ref } from 'vue';

export function useCleanup() {
  const cleanupTasks = ref<Function[]>([]);

  const cleanup = () => {
    cleanupTasks.value.forEach(task => task());
    cleanupTasks.value = [];
  };

  const addCleanupTask = (task: Function) => {
    cleanupTasks.value.push(task);
  };

  return {
    cleanup,
    addCleanupTask
  };
} 