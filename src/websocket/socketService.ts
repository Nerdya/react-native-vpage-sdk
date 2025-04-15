import { ActivationState, Client, IFrame, IMessage, StompHeaders } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class SocketService {
  private socket?: any;
  private socketPath: string = '';
  private sessionKey: string = '';
  private token: string = '';
  private socketId: string = '';
  private client?: Client;
  public timerInterval: NodeJS.Timeout | null = null;

  /**
   * Initializes the STOMP client with the given WebSocket server URL and configuration.
   * @param {string} serverUrl - The base URL of the WebSocket server.
   * @param {string} socketPath - The path for the WebSocket connection.
   * @param {string} sessionKey - The session key for the user.
   * @param {string} token - The authentication token.
   * @param {(message: string) => void} [debugCallback] - Optional callback for debugging messages.
   */
  initialize(
    serverUrl: string,
    socketPath: string,
    sessionKey: string,
    token: string,
    debugCallback?: (message: string) => void
  ): void {
    if (this.client) {
      console.error('STOMP client is already initialized.');
      return;
    }

    this.socket = new SockJS(serverUrl + socketPath, null, { timeout: 30000 });
    this.setSocketPath(socketPath);
    this.setSessionKey(sessionKey);
    this.setToken(token);

    this.client = new Client({
      webSocketFactory: () => this.socket,
      brokerURL: undefined,
      reconnectDelay: 5000,
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      debug: debugCallback,
    });
  }

  /**
   * Sets the WebSocket path.
   * @param {string} socketPath - The WebSocket path.
   */
  private setSocketPath(socketPath: string): void {
    this.socketPath = socketPath;
  }

  /**
   * Retrieves the WebSocket path.
   * @returns {string} The WebSocket path.
   */
  private getSocketPath(): string {
    return this.socketPath;
  }

  /**
   * Sets the session key.
   * @param {string} sessionKey - The session key.
   */
  private setSessionKey(sessionKey: string): void {
    this.sessionKey = sessionKey;
  }

  /**
   * Retrieves the session key.
   * @returns {string} The session key.
   */
  private getSessionKey(): string {
    return this.sessionKey;
  }

  /**
   * Sets the authentication token.
   * @param {string} token - The authentication token.
   */
  private setToken(token: string): void {
    this.token = token;
  }

  /**
   * Retrieves the authentication token.
   * @returns {string} The authentication token.
   */
  private getToken(): string {
    return this.token;
  }

  /**
   * Sets the socket ID based on the WebSocket URL.
   * @param {string} socketPath - The WebSocket path.
   */
  private setSocketId(socketPath: string): void {
    const url = this.socket?._transport?.url?.toString();

    if (url && url.includes(socketPath)) {
      const parts = url.split(socketPath);
      if (parts.length > 1) {
        const pathAfterSocketPath = parts[1];
        const segments = pathAfterSocketPath.split('/');
        this.socketId = segments[2] || '';
      } else {
        console.warn('Unexpected path after socket path:', parts);
      }
    } else {
      console.warn('Unexpected socket path:', socketPath);
    }
  }

  /**
   * Retrieves the socket ID.
   * @returns {string} The socket ID.
   */
  private getSocketId(): string {
    return this.socketId;
  }

  /**
   * Clears the health check interval.
   */
  clearHealthCheck(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      console.log('Health check cleared.');
    }
  }

  /**
   * Starts the interval to send health checks.
   * @param {SocketService} socketService - The instance of the SocketService.
   */
  startHealthCheck(socketService: SocketService): void {
    const timeSleep = 3000;

    this.clearHealthCheck();

    if (!socketService) {
      console.warn('Socket service instance is null.');
      return;
    }

    this.timerInterval = setInterval(() => this.validateToken(socketService), timeSleep);

    console.log('Health check started.');
  }

  /**
   * Validates the token by sending a health check message.
   * @param {SocketService} socketService - The instance of the SocketService.
   */
  private validateToken(socketService: SocketService): void {
    try {
      socketService.send(`/app/healthCheck`, {
        'Access-Control-Allow-Origin': '*',
        timestamp: new Date().getTime().toString(),
        token: socketService.getToken(),
        socketId: socketService.getSocketId(),
      });
    } catch (error) {
      console.warn('Socket service instance is null. Stopping health check...');
      this.clearHealthCheck();
    }
  }

  /**
   * Subscribes to a specific topic.
   * @param {string} topic - The topic to subscribe to.
   * @param {(message: IMessage) => void} callback - The callback function to handle incoming messages.
   */
  subscribe(topic: string, callback: (message: IMessage) => void) {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    return this.client.subscribe(topic, callback);
  }

  /**
   * Subscribes to the session notification topic.
   * @param {(msg: IMessage) => void} callback - The callback function to handle incoming messages.
   */
  subscribeSessionNotifyTopic(callback: (msg: IMessage) => void) {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    return this.subscribe(`/user/${this.getSessionKey()}/notify`, callback);
  }

  /**
   * Subscribes to the socket notification topic.
   * @param {(msg: IMessage) => void} callback - The callback function to handle incoming messages.
   */
  subscribeSocketNotifyTopic(callback: (msg: IMessage) => void) {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    return this.subscribe(`/user/${this.getSocketId()}/notify`, callback);
  }

  /**
   * Subscribes to the socket health topic.
   * @param {(msg: IMessage) => void} callback - The callback function to handle incoming messages.
   */
  subscribeSocketHealthTopic(callback: (msg: IMessage) => void) {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    return this.subscribe(`/user/${this.getSocketId()}/health`, callback);
  }

  /**
   * Subscribes to the application live topic.
   * @param {(msg: IMessage) => void} callback - The callback function to handle incoming messages.
   */
  subscribeAppLiveTopic(callback: (msg: IMessage) => void) {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }
    return this.subscribe(`/app/live`, callback);
  }

  /**
   * Sends a message to a specific destination.
   * @param {string} destination - The destination to send the message to.
   * @param {Record<string, string>} [headers={}] - Optional headers for the message.
   * @param {string} [body=''] - The message body.
   */
  send(destination: string, headers: Record<string, string> = {}, body: string = ''): void {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    this.client.publish({ destination, headers, body });
  }

  /**
   * Registers event handlers for the STOMP client.
   * @param {Object} handlers - The event handlers to register.
   */
  registerEventHandler({
    onUnhandledMessage = (message: IMessage) => {},
    onUnhandledReceipt = (frame: IFrame) => {},
    onUnhandledFrame = (frame: IFrame) => {},
    beforeConnect = async (client: Client) => {},
    onConnect = (frame: IFrame) => {},
    onDisconnect = (frame: IFrame) => {},
    onStompError = (frame: IFrame) => {},
    onWebSocketClose = (event: any) => {},
    onWebSocketError = (event: any) => {},
    onChangeState = (state: ActivationState) => {},
  } = {}): void {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    this.client.onUnhandledMessage = onUnhandledMessage;
    this.client.onUnhandledReceipt = onUnhandledReceipt;
    this.client.onUnhandledFrame = onUnhandledFrame;
    this.client.beforeConnect = beforeConnect;
    this.client.onConnect = (frame) => {
      this.setSocketId(this.getSocketPath());
      onConnect(frame);
    };
    this.client.onDisconnect = onDisconnect;
    this.client.onStompError = onStompError;
    this.client.onWebSocketClose = onWebSocketClose;
    this.client.onWebSocketError = onWebSocketError;
    this.client.onChangeState = onChangeState;
  }

  /**
   * Connects to the STOMP WebSocket server.
   */
  connect(): void {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    if (this.client.connected) {
      console.error('STOMP client is already connected.');
      return;
    }

    const deviceInfo: Record<string, any> = {};

    const socketHeaders: StompHeaders = {
      'Access-Control-Allow-Origin': '*',
      token: this.getToken(),
      deviceInfo: JSON.stringify(deviceInfo),
    };

    this.client.connectHeaders = socketHeaders;

    this.client.activate();
  }

  /**
   * Disconnects from the STOMP WebSocket server.
   * @returns {Promise<void>} A promise that resolves when the client is disconnected.
   */
  async disconnect() {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    await this.client.deactivate();
  }

  /**
   * Unregisters all event handlers for the STOMP client.
   */
  unregisterEventHandler(): void {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    this.client.onUnhandledMessage = () => {};
    this.client.onUnhandledReceipt = () => {};
    this.client.onUnhandledFrame = () => {};
    this.client.beforeConnect = () => {};
    this.client.onConnect = () => {};
    this.client.onDisconnect = () => {};
    this.client.onStompError = () => {};
    this.client.onWebSocketClose = () => {};
    this.client.onWebSocketError = () => {};
    this.client.onChangeState = () => {};
  }

  /**
   * Unsubscribes from a specific topic.
   * @param {string} topic - The topic to unsubscribe from.
   */
  unsubscribe(topic: string): void {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    this.client.unsubscribe(topic);
  }

  /**
   * Unsubscribes from all predefined topics.
   */
  unsubscribeTopics(): void {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    this.unsubscribe(`/user/${this.getSessionKey()}/notify`);
    this.unsubscribe(`/user/${this.getSocketId()}/notify`);
    this.unsubscribe(`/user/${this.getSocketId()}/health`);
    this.unsubscribe(`/app/live`);
  }

  /**
   * Cleans up the STOMP client instance by clearing health checks, disconnecting, and unregistering handlers.
   * @returns {Promise<void>} A promise that resolves when cleanup is complete.
   */
  async cleanup() {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }
    this.clearHealthCheck();
    await this.disconnect();
    this.unregisterEventHandler();
    this.unsubscribeTopics();
    this.client = undefined;
    this.socket = undefined;
  }
}

/**
 * Factory function to create an instance of SocketService.
 * @returns {SocketService} A new instance of SocketService.
 */
export function createSocketService() {
  return new SocketService();
}
