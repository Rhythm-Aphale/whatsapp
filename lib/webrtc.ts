import { useChatStore } from './store';
import { v4 as uuidv4 } from 'uuid';

export class WebRTCManager {
  private static instance: WebRTCManager;
  private ws: WebSocket | null = null;
  private currentUserId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  static getInstance(): WebRTCManager {
    if (!WebRTCManager.instance) {
      WebRTCManager.instance = new WebRTCManager();
    }
    return WebRTCManager.instance;
  }

  private constructor() {}

  async connectToSignalingServer(serverUrl: string, username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }

        console.log('Attempting to connect to:', serverUrl);
        this.ws = new WebSocket(serverUrl);
        const { setWebSocket, setConnected, setCurrentUser } = useChatStore.getState();

        const connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            console.error('Connection timeout');
            this.ws?.close();
            reject(new Error('Connection timeout'));
          }
        }, 15000);

        this.ws.onopen = () => {
          console.log('Connected to signaling server');
          clearTimeout(connectionTimeout);
          this.reconnectAttempts = 0;
          
          setWebSocket(this.ws!);
          setConnected(true);
          
          setTimeout(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
              this.ws!.send(JSON.stringify({
                type: 'join',
                username
              }));
            }
          }, 100);
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleSignalingMessage(message);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('Disconnected from signaling server', event.code, event.reason);
          clearTimeout(connectionTimeout);
          setConnected(false);
          
          if (event.code !== 1000) {
            this.handleReconnect(serverUrl, username);
          }
          
          if (this.ws?.readyState !== WebSocket.OPEN) {
            reject(new Error(`Connection closed: ${event.code} ${event.reason}`));
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          clearTimeout(connectionTimeout);
          reject(new Error('WebSocket connection failed'));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private async handleReconnect(serverUrl: string, username: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
    
    setTimeout(async () => {
      try {
        await this.connectToSignalingServer(serverUrl, username);
      } catch (error) {
        console.error('Reconnection failed:', error);
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  private handleSignalingMessage(message: any) {
    const { setCurrentUser, setUsers, addMessage, setTypingUsers } = useChatStore.getState();

    switch (message.type) {
      case 'joined':
        this.currentUserId = message.userId;
        setCurrentUser({
          id: message.userId,
          username: message.username,
          isOnline: true
        });
        break;

      case 'user-list':
        setUsers(message.users);
        break;

      case 'message':
        addMessage({
          id: `${message.userId}-${message.timestamp}`,
          messageId: message.messageId,
          senderId: message.userId,
          senderName: message.username,
          content: message.data.content,
          timestamp: message.timestamp,
          type: message.data.type || 'text',
          fileData: message.data.fileData,
          targetUserId: message.targetUserId
        });
        break;

      case 'typing':
        const typingUsers = useChatStore.getState().typingUsers;
        typingUsers.add(message.username);
        setTypingUsers(new Set(typingUsers));
        break;

      case 'stop-typing':
        const stopTypingUsers = useChatStore.getState().typingUsers;
        stopTypingUsers.delete(message.username);
        setTypingUsers(new Set(stopTypingUsers));
        break;

      case 'offer':
      case 'answer':
      case 'ice-candidate':
        this.handleWebRTCSignaling(message);
        break;

      case 'error':
        console.error('Server error:', message.error);
        break;
    }
  }

  private async handleWebRTCSignaling(message: any) {
    console.log('WebRTC signaling:', message);
  }

  sendMessage(content: string, type: 'text' | 'file' = 'text', fileData?: any, targetUserId?: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return false;
    }

    const { currentUser, addMessage } = useChatStore.getState();
    if (!currentUser) {
      console.error('No current user');
      return false;
    }

    const messageId = uuidv4(); // Generate unique message ID
    const timestamp = Date.now();

    const message = {
      type: 'message',
      userId: this.currentUserId,
      username: currentUser.username,
      targetUserId,
      messageId, // Include messageId
      timestamp,
      data: {
        content,
        type,
        fileData
      }
    };

    try {
      this.ws.send(JSON.stringify(message));

      // Add message to local state
      addMessage({
        id: `${this.currentUserId}-${timestamp}`,
        messageId,
        senderId: this.currentUserId!,
        senderName: currentUser.username,
        content,
        timestamp,
        type,
        fileData,
        targetUserId
      });

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  sendTypingStatus(isTyping: boolean, targetUserId?: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const { currentUser } = useChatStore.getState();
    if (!currentUser) return;

    try {
      this.ws.send(JSON.stringify({
        type: isTyping ? 'typing' : 'stop-typing',
        userId: this.currentUserId,
        username: currentUser.username,
        targetUserId
      }));
    } catch (error) {
      console.error('Failed to send typing status:', error);
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts;
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.currentUserId = null;
    useChatStore.getState().clearState();
  }
}