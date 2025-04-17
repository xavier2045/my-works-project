import { defineStore } from 'pinia';
import DOMPurify from 'dompurify';
import { setItem, getItem, removeItem, findBigIntFigure } from '@/utils/index';

export const aeChatStore = defineStore('chat', {
  state: () => ({
    friends: [],
    activeChat: '',
    messages: [] as any[]
  }),
  actions: {
    /** 渲染消息内容，转译换行符为<br> */
    formatMessage(message: string) {
      return message.replace(/\n/g, '<br>');
    },
    // 设置当前聊天好友
    setActiveChat(friendId: string) {
      this.activeChat = friendId;
      console.log('chat.ts-friendId', friendId);
      console.log('chat.ts-activeChat', this.activeChat);
    },
    // 添加消息
    addMessage(message: any) {
      message.content = this.formatMessage(DOMPurify.sanitize(message.content));  // 处理XSS攻击
      this.messages.push(message);
      this.cacheMessages();
      console.log('记录的消息', this.messages);
    },
    // 获取与当前聊天好友的消息
    getMessagesByUser(userId: string, friendId: string) {
      console.log('回显展示数据', this.messages);
      if(this.messages.length > 0) {
        return this.messages.filter(
          (message) => 
              (message.sendId === userId && message.receiveId === friendId) ||
            (message.sendId === friendId && message.receiveId ==userId)
        );
      }
    },
    // 标记消息为已读
    markMessagesAsRead(friendId: string) {
      if(this.messages.length > 0) {
        this.messages.forEach((message) => {
          if (findBigIntFigure(message.sendId) === findBigIntFigure(friendId) && findBigIntFigure(message.receiveId || 0) === findBigIntFigure(this.activeChat)) {
            message.isRead = true;
          }
        });
      }
    },
    // 获取未读消息数量
    getUnreadMessagesCount(friendId: string) {
      if(this.messages.length > 0) {
        return this.messages.filter((message) => findBigIntFigure(message.sendId || 0) === findBigIntFigure(friendId) && findBigIntFigure(message.receiveId || 0) !== findBigIntFigure(this.activeChat) && !message.isRead).length;
      }
    },
    // 设置消息列表
    setMessages(messages: {message: any}[]) {
      messages.forEach(message => {
        message.text = this.formatMessage(DOMPurify.sanitize(message.text));
      });
      this.messages = messages;
      this.cacheMessages();
    },
    // 缓存消息列表
    cacheMessages() {
      // localStorage.setItem('chatMessages', JSON.stringify(this.messages));
      setItem('chatMessages', JSON.stringify(this.messages));
    },
    // 清空消息列表
    clearMessages() {
      this.messages = [];
      // localStorage.removeItem('chatMessages');
      removeItem('chatMessages');
    },
    // 加载缓存的消息列表
    loadCachedMessages() {
      // const cachedMessages = localStorage.getItem('chatMessages');
      const cachedMessages = getItem('chatMessages');
      if (cachedMessages) {
        this.messages = JSON.parse(cachedMessages);
      }
    },
  },
  persist: {
    key: 'chat',
    storage: sessionStorage, // 你可以选择 localStorage 或 sessionStorage
  },
});
