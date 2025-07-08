
# 💬 WhatsApp Clone - P2P Chat Application

A modern, real-time, person-to-person chat application inspired by WhatsApp. Built with **Next.js**, **TypeScript**, **WebSocket**, and **WebRTC**, this project allows users to engage in private text and file-sharing conversations. It features a sleek, responsive UI powered by **Tailwind CSS** and **Shadcn UI**.

🔗 **Live Demo:** [https://whatsapp-mu-seven.vercel.app](https://whatsapp-mu-seven.vercel.app)

---

## 🚀 Features

- ✅ Private one-on-one messaging  
- 📎 File sharing support  
- ⌨️ Real-time typing indicators  
- 🟢 Online status visibility  
- 😀 Emoji picker integration  
- 📱 Fully responsive design  
- ⚡ Real-time messaging via WebSocket  
- 🔁 Duplicate message prevention using `messageId`  
- 🧱 Error handling with auto reconnection  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI  
- **Backend:** Node.js, WebSocket (`ws`), TypeScript  
- **State Management:** Zustand  
- **Libraries:** react-dropzone, emoji-picker-react, date-fns, uuid  
- **Deployment:** Vercel (frontend), Render (signaling server)  

---

## 📋 Prerequisites

- Node.js v16 or higher  
- npm or Yarn  
- Modern web browser  
- [Render](https://render.com) account (for signaling server deployment)  

---

## 🏗️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Rhythm-Aphale/whatsapp.git
cd whatsapp
```

### 2. Frontend Setup

```bash
cd whatsapp
npm install
```

### 3. Signaling Server Setup

```bash
cd signaling-server
npm install
```

---

## ⚙️ Configuration

### WebSocket URL (Development)

By default, the frontend uses:

```
ws://localhost:8080
```

To switch to production, update the WebSocket URL in:

```
/app/login/page.tsx
```

```ts
return 'wss://your-signaling-server.onrender.com';
```

---

## 🚀 Running the App Locally

### 1. Start the Signaling Server

```bash
cd signaling-server
npm start
```

> The server runs on port 8080. You can change it in `server.ts`.

### 2. Start the Frontend

```bash
cd whatsapp
npm run dev
```

Visit: [http://localhost:3000/login](http://localhost:3000/login)

---

## 🌐 Deployment

### 📡 Deploy Backend (Signaling Server) to Render

1. Go to [https://render.com](https://render.com) → New → Web Service  
2. Use the `signaling-server` folder as the source  
3. Set:  
   - **Build Command:** `npm install`  
   - **Start Command:** `node server.js` (compile `server.ts` using `tsc`)  
4. Deploy and get your WebSocket URL (e.g., `wss://your-signaling-server.onrender.com`)  
5. Update the WebSocket URL in `page.tsx`

---

### 🌍 Deploy Frontend (Next.js) to Vercel

1. Push your project to GitHub  
2. Go to [https://vercel.com](https://vercel.com) → Import Project  
3. Connect your GitHub repository and deploy  
4. Make sure the WebSocket URL in `page.tsx` points to your Render server

---

## 📖 How to Use

1. Visit `/login` and enter a unique username  
2. Start chatting with any online user  
3. Type messages, use the emoji picker, or share files  
4. Click the logout icon to disconnect  

---

## 🐛 Troubleshooting

- **Duplicate Messages:**  
  Ensure `messageId` filtering is working in `lib/store.ts` and `lib/webrtc.ts`  

- **WebSocket Connection Fails:**  
  Make sure the signaling server is running  
  Increase timeout in `page.tsx`:  

  ```ts
  const connectionTimeout = setTimeout(() => { ... }, 30000);
  ```

- **Unknown Message Type Error:**  
  Confirm `server.ts` handles all message types correctly  

- **Debug Messages:**  
  Add this inside `lib/webrtc.ts`:  

  ```ts
  console.log('Received message:', { messageId: message.messageId });
  ```

---

## 🤝 Contributing

1. Fork this repository  
2. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes  
4. Commit your work:  
   ```bash
   git commit -m "Add your feature"
   ```
5. Push to GitHub:  
   ```bash
   git push origin feature/your-feature
   ```
6. Open a Pull Request  

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).  

---

## 🙌 Acknowledgments

- [Next.js](https://nextjs.org)  
- [Shadcn UI](https://ui.shadcn.com)  
- [Vercel](https://vercel.com)  
- [Render](https://render.com)  
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)  

---

**Happy Chatting! 💬**
