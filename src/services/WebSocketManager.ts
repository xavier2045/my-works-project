/**
 * WebSocketManager provides a singleton instance for managing WebSocket connections
 * It handles reconnection, authentication, and connection state
 */

type ConnectionParams = {
  websocketUrl: string;
  inactivityTimeout: number;
  uuid: string;
  token: string;
};

export default class WebSocketManager {
  private static instance: WebSocketManager;
  private connectionParams: ConnectionParams | null = null;
  
  private constructor() {}
  
  /**
   * Get the singleton instance of WebSocketManager
   */
  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }
  
  /**
   * Set connection parameters
   */
  public setConnectionParams(params: ConnectionParams): void {
    this.connectionParams = params;
  }
  
  /**
   * Get current connection parameters
   */
  public getConnectionParams(): ConnectionParams | null {
    return this.connectionParams;
  }
  
  /**
   * Check if connection parameters are set
   */
  public hasConnectionParams(): boolean {
    return this.connectionParams !== null;
  }
  
  /**
   * Build the WebSocket URL with authentication tokens
   */
  public buildWebSocketUrl(): string {
    if (!this.connectionParams) {
      throw new Error('Connection parameters not set');
    }
    
    const { websocketUrl, token, uuid } = this.connectionParams;
    return `${websocketUrl}?token=${encodeURIComponent(token)}&uuid=${encodeURIComponent(uuid)}`;
  }
  
  /**
   * Get the inactivity timeout
   */
  public getInactivityTimeout(): number {
    if (!this.connectionParams) {
      throw new Error('Connection parameters not set');
    }
    
    return this.connectionParams.inactivityTimeout;
  }
  
  /**
   * Get the user UUID
   */
  public getUuid(): string {
    if (!this.connectionParams) {
      throw new Error('Connection parameters not set');
    }
    
    return this.connectionParams.uuid;
  }
  
  /**
   * Get the authentication token
   */
  public getToken(): string {
    if (!this.connectionParams) {
      throw new Error('Connection parameters not set');
    }
    
    return this.connectionParams.token;
  }
} 