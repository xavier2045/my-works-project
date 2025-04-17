import { aeUseStore } from '@/stores/user';
interface WebSocketMessage {
    messageType?: string; // 消息类型 (e.g., 'private', 'group', 'system')
    operateType?: string; // 推送操作类型，用于区分不同的系统通知
    targetId?: string;    // 目标用户或群组 ID
    payload: any;         // 消息内容
  }
  
  type MessageHandler = (data: any) => void;
  
  export default class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private messageHandlers: Record<string, MessageHandler[]> = {};
    private inactivityTimer: NodeJS.Timeout | null = null;
    private _isDisconnected = true; // 是否断开连接
    private reconnectParams: {
      websocketUrl: string;
      inactivityTimeout: number;
      uuid: string;
      token: string;
    } | null = null;

    private constructor() {}
  
    // 单例模式
    public static getInstance(): WebSocketService {
      if (!WebSocketService.instance) {
        WebSocketService.instance = new WebSocketService();
      }
      return WebSocketService.instance;
    }

    // 增加一个公开的 isDisconnected 方法，检查当前连接状态
    public get isDisconnected(): boolean {
      return this.socket === null || this.socket.readyState !== WebSocket.OPEN;
    }
  
    // 初始化 WebSocket 连接
    public connect(
      websocketUrl: string,
      inactivityTimeout: number,
      uuid: string,
      token: string
    ): void {
      if (this.socket) {
        console.warn('WebSocket is already connected.');
        return;
      }

      // 保存重连参数
      this.reconnectParams = { websocketUrl, inactivityTimeout, uuid, token };
      this._isDisconnected = false; // 连接初始化时标记为已连接

      const url = `${websocketUrl}?token=${encodeURIComponent(token)}&uuid=${encodeURIComponent(uuid)}&uuid=${encodeURIComponent(uuid)}`;
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this._isDisconnected = false; // 更新状态为已连接
        this.startInactivityTimer(inactivityTimeout);
      };
  
      this.socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(data);
          this.resetInactivityTimer(inactivityTimeout); // 重置无操作计时
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
  
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this._isDisconnected = true; // 更新状态为断开
        this.clearInactivityTimer();
        this.socket = null;
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }

    // 自动重连逻辑
    private reconnect(): void {
      if (this._isDisconnected && this.reconnectParams) {
        const { websocketUrl, inactivityTimeout, uuid, token } = this.reconnectParams;
        console.log('Attempting to reconnect WebSocket...');
        this.connect(websocketUrl, inactivityTimeout, uuid, token);
      }
    }

    // 发送消息前检查连接
    public sendMessage(message: WebSocketMessage): void {
      if (this._isDisconnected) {
        console.warn('WebSocket disconnected, attempting to reconnect...');
        this.reconnect();
      }
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected.');
        return;
      }
      this.socket.send(JSON.stringify(message));
    }
  
    // 处理收到的消息
    private handleMessage(message: WebSocketMessage): void {
      if (!message) {
        console.warn('Received an empty or invalid WebSocket message.');
        return;
      }
      const userStore = aeUseStore();
      const userInfo = userStore.getUserInfo;
      userInfo.operateType = message.operateType;
      if(message.operateType == '11') {
        userInfo.notifications = true;
        userInfo.operateData = message.data;
      }
      
      // 优先处理 operateType
      if (message.operateType) {
        console.log('Processing operateType', message);
        console.log(`Processing operateType: ${message.operateType}`);
        const handlers = this.messageHandlers[message.operateType] || [];
        if (handlers.length === 0) {
          console.warn(`No handlers found for operateType: ${message.operateType}`);
        }
        handlers.forEach((handler) => handler(message));
        return;
      }
  
      // 其次处理 messageType
      if (message.messageType) {
        console.log(`Processing messageType: ${message.messageType}`);
        const handlers = this.messageHandlers[message.messageType] || [];
        if (handlers.length === 0) {
          console.warn(`No handlers found for messageType: ${message.messageType}`);
        }
        handlers.forEach((handler) => handler(message));
        return;
      }
  
      // 如果两者都不存在，记录未知消息
      console.warn('Unknown message received:', message);
    }
  
    // 注册消息处理器
    public onMessage(type: string, handler: MessageHandler): void {
      if (!this.messageHandlers[type]) {
        this.messageHandlers[type] = [];
      }
      this.messageHandlers[type].push(handler);
    }
  
    // 注销消息处理器
    public offMessage(type: string, handler: MessageHandler): void {
      if (!this.messageHandlers[type]) return;
      this.messageHandlers[type] = this.messageHandlers[type].filter((h) => h !== handler);
    }
  
    // 开始无操作计时
    private startInactivityTimer(timeout: number): void {
      this.clearInactivityTimer();
      this.inactivityTimer = setTimeout(() => {
        console.warn('WebSocket disconnected due to inactivity');
        this.disconnect();
      }, timeout);
    }
  
    // 重置无操作计时
    private resetInactivityTimer(timeout: number): void {
      this.startInactivityTimer(timeout);
    }
  
    // 清除计时器
    private clearInactivityTimer(): void {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
        this.inactivityTimer = null;
      }
    }
  
    // 断开连接
    public disconnect(): void {
      if (this.socket) {
        this.socket.close();
        this.clearInactivityTimer();
        this.socket = null;
      }
      this._isDisconnected = true;
    }
  
    // 即时聊天扩展功能
    public sendPrivateMessage(targetId: string, content: string): void {
      this.sendMessage({
        messageType: 'private',
        operateType: 'chat',
        targetId,
        payload: { content },
      });
    }
  
    public sendGroupMessage(groupId: string, content: string): void {
      this.sendMessage({
        messageType: 'group',
        operateType: 'chat',
        targetId: groupId,
        payload: { content },
      });
    }
  
    public sendVoiceCall(targetId: string): void {
      this.sendMessage({
        messageType: 'voice',
        operateType: 'call',
        targetId,
        payload: { action: 'start' },
      });
    }
  
    public sendVideoCall(targetId: string): void {
      this.sendMessage({
        messageType: 'video',
        operateType: 'call',
        targetId,
        payload: { action: 'start' },
      });
    }
  }
  