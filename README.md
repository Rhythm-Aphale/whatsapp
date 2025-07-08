💬 WhatsApp Clone - P2P Chat Application
A modern, real-time, person-to-person chat application inspired by WhatsApp, built with Next.js, TypeScript, WebSocket, and WebRTC. This app enables private text and file-sharing conversations with a sleek, responsive interface powered by Tailwind CSS and Shadcn UI. Deployed at whatsapp-mu-seven.vercel.app.
 
🚀 Features

Private Messaging: Engage in one-on-one text conversations with other online users.
File Sharing: Securely send and receive files within chats.
Real-Time Typing Indicators: See when your chat partner is typing.
Online Status: View which users are currently online.
Emoji Support: Add emojis to messages using an integrated emoji picker.
Responsive Design: Optimized for desktop and mobile devices.
WebSocket Communication: Ensures low-latency, real-time messaging.
Duplicate Message Prevention: Unique message IDs prevent duplicate messages.
Robust Error Handling: Automatic reconnection and user-friendly error messages.

🛠️ Tech Stack

Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI
Backend: Node.js, WebSocket (ws), TypeScript
State Management: Zustand
Libraries: react-dropzone, emoji-picker-react, date-fns, uuid
Deployment: Vercel (frontend), Render (signaling server)

📋 Prerequisites

Node.js: v16 or higher
npm or Yarn
Modern Web Browser: Chrome, Firefox, Edge, etc.
Render Account: For deploying the signaling server (optional for local development)

🏗️ Installation
Clone the Repository
git clone https://github.com/Rhythm-Aphale/whatsapp.git
cd whatsapp

Frontend Setup

Navigate to the root directory (client):cd whatsapp


Install dependencies:npm install

Key dependencies: next, react, react-dom, zustand, react-dropzone, emoji-picker-react, date-fns, uuid, @radix-ui/* (Shadcn UI).

Signaling Server Setup

Navigate to the signaling server directory:cd signaling-server


Install dependencies:npm install

Key dependencies: ws, uuid.

Environment Configuration

Local Development: The app defaults to ws://localhost:8080 for the WebSocket server.
Production: Update the WebSocket URL in app/login/page.tsx to your deployed server (e.g., wss://your-signaling-server.onrender.com).

🚀 Running Locally
Start the Signaling Server

In the signaling-server directory:cd signaling-server
npm start


The server runs on port 8080 by default. Modify PORT in server.ts if needed.

Start the Next.js Frontend

In the root directory:cd whatsapp
npm run dev


Open http://localhost:3000 in your browser.

Access the App

Navigate to http://localhost:3000/login.
Enter a username to log in and start chatting.

🌐 Deployment
Signaling Server (Backend)

Deploy signaling-server/server.ts to Render:
Create a new Web Service on Render.
Set the build command: npm install
Set the start command: node server.js (compile server.ts to server.js using tsc if needed).
Note the deployed URL (e.g., wss://your-signaling-server.onrender.com).


Update app/login/page.tsx with the production WebSocket URL:return 'wss://your-signaling-server.onrender.com';



Frontend (Next.js)

Deploy to Vercel:
Push the repository to GitHub: https://github.com/Rhythm-Aphale/whatsapp.git.
Connect the repository to Vercel.
Deploy the app, ensuring the WebSocket URL points to the Render server.


Access the deployed app at whatsapp-mu-seven.vercel.app.

📖 Usage

Log In:

Visit /login and enter a unique username.
The app connects to the signaling server and displays online users.


Select a User:

Click a user in the sidebar to start a private chat.
The chat area shows your conversation with the selected user.


Send Messages:

Type a message or attach a file in the input area.
Use the emoji picker to add emojis.
Press Enter or click the send button to send.


File Sharing:

Drag and drop files or use the file picker.
Files are sent as Data URLs and downloadable by the recipient.


Log Out:

Click the logout button in the sidebar to disconnect.



🐛 Troubleshooting

Duplicate Messages: The app uses unique messageIds to prevent duplicates. If duplicates occur, verify messageId filtering in lib/store.ts and lib/webrtc.ts.
Connection Issues: Ensure the WebSocket server is running (npm start in signaling-server). For Render’s free tier, cold starts may cause delays; increase the connection timeout in app/login/page.tsx (e.g., 30000 ms).const connectionTimeout = setTimeout(() => { ... }, 30000);


Server Errors: Check server logs for errors like "Unknown message type". Ensure server.ts is correctly deployed.
Browser Console: Log messageId in lib/webrtc.ts to debug:case 'message':
  console.log('Received message:', { messageId: message.messageId, content: message.data.content });
  addMessage({ ... });
  break;



🤝 Contributing
Contributions are welcome! To contribute:

Fork the repository: https://github.com/Rhythm-Aphale/whatsapp.git.
Create a feature branch: git checkout -b feature/your-feature.
Commit changes: git commit -m "Add your feature".
Push to the branch: git push origin feature/your-feature.
Open a Pull Request.

📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
🙌 Acknowledgments

Next.js for the powerful React framework.
Shadcn UI for beautiful components.
Vercel for seamless frontend deployment.
Render for WebSocket server hosting.
WebSocket for real-time communication.


Happy Chatting! 💬
