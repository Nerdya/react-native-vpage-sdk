class WebSocketService {
    private socket: WebSocket | null = null;
  
    connect(url: string) {
      console.log('Connecting to WebSocket:', url);
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => console.log('WebSocket connected');
      this.socket.onmessage = (msg) => console.log('Received:', msg.data);
      this.socket.onerror = (err) => console.error('WebSocket error:', err);
      this.socket.onclose = () => console.log('WebSocket closed');
    }
  
    sendMessage(message: string) {
      console.log('Sending message:', message);
      this.socket?.send(message);
    }
  
    disconnect() {
      console.log('Disconnecting WebSocket');
      this.socket?.close();
    }
  }
  
  export default new WebSocketService();
  