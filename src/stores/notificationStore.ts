// stores/notificationStore.ts
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as { type: string; message: string; position: string }[],
  }),
  actions: {
    addNotification(notification: { type: string; message: string; position: string }) {
      this.notifications.push(notification);
    },
    removeNotification(index: number) {
      this.notifications.splice(index, 1);
    },
  },
});
