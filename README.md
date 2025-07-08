💬 WhatsApp Clone - P2P Chat Application
A modern, real-time, person-to-person chat application inspired by WhatsApp, built with Next.js, TypeScript, WebSocket, and WebRTC. This app enables private text and file-sharing conversations with a sleek, responsive interface powered by Tailwind CSS and Shadcn UI. Deployed at whatsapp-mu-seven.vercel.app.
 

## Features

- **Real-time messaging** with WebSocket signaling
- **File sharing** with drag-and-drop support
- **Emoji picker** for rich messaging
- **Typing indicators** and online status
- **User authentication** (username-only)
- **Responsive design** for all devices
- **WebRTC** for peer-to-peer communication
- **Modern UI** with shadcn/ui components

## Tech Stack

**Frontend:**
- Next.js 15+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zustand for state management
- WebRTC for peer-to-peer communication

**Backend:**
- Node.js WebSocket signaling server
- TypeScript
- ws library for WebSocket connections

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install signaling server dependencies:
   ```bash
   cd signaling-server
   npm install
   ```

### Development

1. Start the signaling server:
   ```bash
   cd signaling-server
   npm run dev
   ```

2. In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Production Deployment

#### Frontend (Netlify/Vercel)
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `out` folder to your hosting provider

#### Signaling Server (Render/Railway)
1. Build the signaling server:
   ```bash
   cd signaling-server
   npm run build
   ```

2. Deploy to Render or Railway with:
   - Start command: `npm start`
   - Environment: Node.js

## Architecture

### Frontend Components
- `LoginForm`: User authentication interface
- `ChatLayout`: Main chat application layout
- `ChatArea`: Message display and input area
- `UserList`: Online users sidebar
- `MessageList`: Message history display
- `MessageInput`: Message composition with file upload
- `TypingIndicator`: Real-time typing status

### Backend
- WebSocket signaling server for real-time communication
- User management and message broadcasting
- WebRTC signaling for peer-to-peer connections

### State Management
- Zustand store for global state
- WebRTC manager for peer connections
- Real-time user and message synchronization

## Configuration

Update the WebSocket server URL in `app/page.tsx`:

```typescript
const serverUrl = process.env.NODE_ENV === 'development' 
  ? 'ws://localhost:8080'
  : 'wss://your-signaling-server.render.com';
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
