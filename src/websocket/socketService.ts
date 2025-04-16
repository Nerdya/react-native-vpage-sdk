import { ActivationState, Client, IFrame, IMessage, IPublishParams, StompHeaders } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../utils/helpers';

class SocketService {
  private socket?: any;
  private sessionKey: string = '';
  protected token: string = '';
  protected socketId: string = '';
  private client?: Client;
  public timerInterval: NodeJS.Timeout | null = null;

  /**
   * Initializes the STOMP client with the given WebSocket server URL and configuration.
   * @param {string} serverURL - The base URL of the WebSocket server.
   * @param {string} sessionKey - The session key for the user.
   * @param {string} token - The authentication token.
   * @param {(message: string) => void} [debugCallback] - Optional callback for debugging messages.
   */
  initialize(
    serverURL: string,
    sessionKey: string,
    token: string,
    debugCallback?: (message: string) => void
  ): void {
    if (this.client) {
      console.error('STOMP client is already initialized.');
      return;
    }

    this.socket = new SockJS(serverURL + environment.SOCKET_PATH, null, { timeout: 30000 });
    this.sessionKey = sessionKey;
    this.token = token;

    this.client = new Client({
      webSocketFactory: () => this.socket,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      reconnectDelay: 5000,
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      debug: debugCallback,
    });
  }

  /**
   * Sets the socket ID based on the WebSocket URL.
   */
  private setSocketId(): void {
    const url = this.socket?._transport?.url?.toString();

    if (url && url.includes(environment.SOCKET_PATH)) {
      const parts = url.split(environment.SOCKET_PATH);
      if (parts.length > 1) {
        const pathAfterSocketPath = parts[1];
        const segments = pathAfterSocketPath.split('/');
        this.socketId = segments[2] || '';
      } else {
        console.warn('Unexpected path after socket path:', parts);
      }
    } else {
      console.warn('Unexpected url:', url);
    }
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
      socketService.send(
        `/app/healthCheck`, 
        {
          'Access-Control-Allow-Origin': '*',
          timestamp: new Date().getTime().toString(),
          token: socketService.token,
          socketId: socketService.socketId,
        }
      );
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

    return this.subscribe(`/user/${this.sessionKey}/notify`, callback);
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

    return this.subscribe(`/user/${this.socketId}/notify`, callback);
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

    return this.subscribe(`/user/${this.socketId}/health`, callback);
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
   * Sends a message to a specific destination using the STOMP client.
   * @param {IPublishParams} params - The parameters for the message, including the destination, headers, and body.
   * @returns {void} Logs an error and exits if the STOMP client is not initialized.
   * 
   * Example usage:
   * ```typescript
   * socketService.send({
   *   destination: '/app/example',
   *   headers: { 'custom-header': 'value' },
   *   body: 'Message content',
   * });
   * ```
   */
  send(destination: string, headers?: Record<string, string>, body?: any, skipContentLengthHeader = true): void {
    if (!this.client) {
      console.error('STOMP client is not initialized.');
      return;
    }

    this.client.publish({ destination, headers, body, skipContentLengthHeader });
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
      this.setSocketId();
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
      token: this.token,
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

    this.unsubscribe(`/user/${this.sessionKey}/notify`);
    this.unsubscribe(`/user/${this.socketId}/notify`);
    this.unsubscribe(`/user/${this.socketId}/health`);
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
