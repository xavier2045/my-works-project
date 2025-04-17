import mitt from 'mitt';
import { aeChatStore } from '@/stores/chat';
import WebSocketManager from './WebSocketManager';

/**
 * WebSocket message interface
 */
export interface WebSocketMessage {
  messageType?: string;  // Message type (e.g., 'private', 'group', 'system')
  operateType?: string;  // Operation type for system notifications
  targetId?: string;     // Target user or group ID
  payload?: any;         // Message content/payload
  content?: string;      // Message content (for convenience)
  sendId?: string;       // Sender ID
  receiveId?: string;    // Receiver ID
  type?: string | number; // Message content type
  messageId?: string;    // Message ID
  data?: any;           // Additional data payload
}

// Message event handler type
export type MessageHandler = (data: WebSocketMessage) => void;

/**
 * WebSocketService handles WebSocket connections and message passing
 */
export default class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private messageHandlers: Record<string, MessageHandler[]> = {};
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectInterval: number = 5000; // 5 seconds
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private emitter = mitt();
  private _isDisconnected = true;
  private wsManager = WebSocketManager.getInstance();

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Check if the connection is currently disconnected
   */
  public get isDisconnected(): boolean {
    return this.socket === null || this.socket.readyState !== WebSocket.OPEN;
  }

  /**
   * Initialize WebSocket connection
   */
  public connect(
    websocketUrl?: string,
    inactivityTimeout?: number,
    uuid?: string,
    token?: string
  ): void {
    // If parameters are provided, set them in the manager
    if (websocketUrl && inactivityTimeout && uuid && token) {
      this.wsManager.setConnectionParams({
        websocketUrl,
        inactivityTimeout,
        uuid,
        token
      });
  }

    // Verify we have connection parameters
    if (!this.wsManager.hasConnectionParams()) {
      console.error('Cannot connect: WebSocket connection parameters not set');
      return;
    }

    // Close existing socket if one exists
    if (this.socket) {
      this.socket.close();
    }

    // Create new WebSocket connection
    try {
      const url = this.wsManager.buildWebSocketUrl();
      this.socket = new WebSocket(url);
      this._isDisconnected = false;

      // Set up event handlers
      this.setupEventHandlers();
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this._isDisconnected = true;
    }
  }

  /**
   * Set up WebSocket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleIncomingMessage.bind(this);
    this.socket.onerror = this.handleError.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen(event: Event): void {
    console.log('WebSocket connection established');
    this._isDisconnected = false;
      this.reconnectAttempts = 0;
      this.startInactivityTimer();
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleIncomingMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Add message to chat store if it has required fields
      if (message.data && message.data.sendId && message.data.content) {
      const chatStore = aeChatStore();
          chatStore.addMessage(message.data);
      }
      
      this.processMessage(message);
      this.resetInactivityTimer();
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket error
   */
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.reconnect();
  }

  /**
   * Handle WebSocket close
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    this._isDisconnected = true;
    this.clearInactivityTimer();
    this.socket = null;
      this.reconnect();
  }

  /**
   * Send a message through the WebSocket
   */
  public send(message: WebSocketMessage): void {
    if (this.isDisconnected) {
      console.warn('WebSocket disconnected, attempting to reconnect...');
      this.reconnect();
      // Queue message or try again later
      return;
  }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      this.resetInactivityTimer();
    } else {
      console.error('WebSocket is not open, message not sent');
    }
  }

  /**
   * Process incoming messages
   */
  private processMessage(message: WebSocketMessage): void {
    if (!message) {
      console.warn('Received empty or invalid WebSocket message.');
      return;
    }

    // Emit the message event for all listeners
    this.emitter.emit('message', message);

    // Handle by operateType (higher priority)
    if (message.operateType) {
      const handlers = this.messageHandlers[message.operateType] || [];
      if (handlers.length > 0) {
        handlers.forEach(handler => handler(message));
      } else {
        console.warn(`No handlers for operateType: ${message.operateType}`);
      }
    }
    
    // Handle by messageType
    else if (message.messageType) {
      const handlers = this.messageHandlers[message.messageType] || [];
      if (handlers.length > 0) {
        handlers.forEach(handler => handler(message));
      } else {
        console.warn(`No handlers for messageType: ${message.messageType}`);
      }
    }
    
    // Unknown message format
    else {
      console.warn('Unknown message format:', message);
    }
  }

  /**
   * Register message handler
   */
  public onMessage(type: string, handler: MessageHandler): void {
    if (!this.messageHandlers[type]) {
      this.messageHandlers[type] = [];
    }
    this.messageHandlers[type].push(handler);
  }

  /**
   * Unregister message handler
   */
  public offMessage(type: string, handler: MessageHandler): void {
    if (!this.messageHandlers[type]) return;
    this.messageHandlers[type] = this.messageHandlers[type].filter(h => h !== handler);
  }

  /**
   * Add event listener
   */
  public on(event: string, callback: (message: any) => void): void {
      this.emitter.on(event, callback);
  }

  /**
   * Remove event listener
   */
  public off(event: string, callback: (message: any) => void): void {
      this.emitter.off(event, callback);
  }

  /**
   * Attempt to reconnect
   */
  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error('Max reconnect attempts reached. Please check the server or network.');
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.clearInactivityTimer();
      this.socket = null;
    }
    this._isDisconnected = true;
  }

  /**
   * Start inactivity timer
   */
  private startInactivityTimer(): void {
    this.clearInactivityTimer();
    if (!this.wsManager.hasConnectionParams()) return;
    
    const timeout = this.wsManager.getInactivityTimeout();
    this.inactivityTimer = setTimeout(() => {
      console.log('Inactivity timeout, closing WebSocket connection');
      this.disconnect();
    }, timeout);
  }

  /**
   * Reset inactivity timer
   */
  private resetInactivityTimer(): void {
    this.startInactivityTimer();
  }

  /**
   * Clear inactivity timer
   */
  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // Convenience methods for sending common message types
  
  /**
   * Send a private message
   */
  public sendPrivateMessage(targetId: string, content: string): void {
    this.send({
      messageType: 'private',
      operateType: '4', // chat operation
      targetId,
      content,
      payload: { content }
    });
  }

  /**
   * Send a group message
   */
  public sendGroupMessage(groupId: string, content: string): void {
    this.send({
      messageType: 'group',
      operateType: '4', // chat operation
      targetId: groupId,
      content,
      payload: { content }
    });
  }
}
