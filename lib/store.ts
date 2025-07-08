import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'file';
  fileData?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

interface ChatState {
  // User state
  currentUser: User | null;
  users: User[];
  isConnected: boolean;
  
  // Chat state
  messages: Message[];
  typingUsers: Set<string>;
  
  // WebSocket and WebRTC
  ws: WebSocket | null;
  peerConnections: Map<string, RTCPeerConnection>;
  dataChannels: Map<string, RTCDataChannel>;
  
  // Actions
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  setConnected: (connected: boolean) => void;
  addMessage: (message: Message) => void;
  setTypingUsers: (users: Set<string>) => void;
  setWebSocket: (ws: WebSocket) => void;
  addPeerConnection: (userId: string, pc: RTCPeerConnection) => void;
  addDataChannel: (userId: string, channel: RTCDataChannel) => void;
  removePeerConnection: (userId: string) => void;
  clearState: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentUser: null,
  users: [],
  isConnected: false,
  messages: [],
  typingUsers: new Set(),
  ws: null,
  peerConnections: new Map(),
  dataChannels: new Map(),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  setUsers: (users) => set({ users }),
  setConnected: (connected) => set({ isConnected: connected }),
  addMessage: (message) => set(state => ({ 
    messages: [...state.messages, message].sort((a, b) => a.timestamp - b.timestamp)
  })),
  setTypingUsers: (users) => set({ typingUsers: users }),
  setWebSocket: (ws) => set({ ws }),
  addPeerConnection: (userId, pc) => {
    const connections = get().peerConnections;
    connections.set(userId, pc);
    set({ peerConnections: new Map(connections) });
  },
  addDataChannel: (userId, channel) => {
    const channels = get().dataChannels;
    channels.set(userId, channel);
    set({ dataChannels: new Map(channels) });
  },
  removePeerConnection: (userId) => {
    const connections = get().peerConnections;
    const channels = get().dataChannels;
    
    connections.get(userId)?.close();
    channels.get(userId)?.close();
    
    connections.delete(userId);
    channels.delete(userId);
    
    set({ 
      peerConnections: new Map(connections),
      dataChannels: new Map(channels)
    });
  },
  clearState: () => set({
    currentUser: null,
    users: [],
    isConnected: false,
    messages: [],
    typingUsers: new Set(),
    ws: null,
    peerConnections: new Map(),
    dataChannels: new Map()
  })
}));