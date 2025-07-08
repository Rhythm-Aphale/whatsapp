import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  messageId: string; // New field for unique message ID
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
  targetUserId?: string;
}

interface ChatState {
  currentUser: User | null;
  users: User[];
  isConnected: boolean;
  selectedUser: User | null;
  messages: Message[];
  typingUsers: Set<string>;
  ws: WebSocket | null;
  peerConnections: Map<string, RTCPeerConnection>;
  dataChannels: Map<string, RTCDataChannel>;
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  setConnected: (connected: boolean) => void;
  setSelectedUser: (user: User | null) => void;
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
  selectedUser: null,
  messages: [],
  typingUsers: new Set(),
  ws: null,
  peerConnections: new Map(),
  dataChannels: new Map(),
  setCurrentUser: (user) => set({ currentUser: user }),
  setUsers: (users) => set({ users }),
  setConnected: (connected) => set({ isConnected: connected }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  addMessage: (message) => set(state => ({
    messages: [...state.messages.filter(m => m.messageId !== message.messageId), message].sort((a, b) => a.timestamp - b.timestamp)
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
    selectedUser: null,
    messages: [],
    typingUsers: new Set(),
    ws: null,
    peerConnections: new Map(),
    dataChannels: new Map()
  })
}));