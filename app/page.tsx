'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { ChatLayout } from '@/components/chat-layout';
import { WebRTCManager } from '@/lib/webrtc';
import { useChatStore } from '@/lib/store';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { currentUser, clearState } = useChatStore();

  const webrtcManager = WebRTCManager.getInstance();

  const handleLogin = async (username: string) => {
    setIsConnecting(true);
    try {
      const getServerUrl = () => {
        const isLocalDevelopment = window.location.hostname === 'localhost' ||
                                  window.location.hostname === '127.0.0.1' ||
                                  window.location.hostname.includes('localhost');
        if (isLocalDevelopment && process.env.NODE_ENV === 'development') {
          return 'ws://localhost:8080';
        }
        return 'wss://whatsapp-server-1-9j3e.onrender.com';
      };

      const serverUrl = getServerUrl();
      console.log('Connecting to server:', serverUrl);

      console.log('Testing WebSocket connection...');
      await webrtcManager.connectToSignalingServer(serverUrl, username);
      
      setIsLoggedIn(true);
      toast.success('Connected to chat!');
    } catch (error) {
      console.error('Failed to connect:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('timeout')) {
        toast.error('Connection timeout. Server might be starting up (Render free tier sleeps). Please wait and try again.');
      } else if (errorMessage.includes('failed')) {
        toast.error('Failed to connect to chat server. Please check if the server is running.');
      } else {
        toast.error(`Connection failed: ${errorMessage}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    webrtcManager.disconnect();
    clearState();
    setIsLoggedIn(false);
    toast.info('Disconnected from chat');
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const checkConnection = setInterval(() => {
      if (!webrtcManager.isConnected() && isLoggedIn) {
        console.log('Connection lost, logging out');
        handleLogout();
        toast.error('Connection lost. Please reconnect.');
      }
    }, 5000);

    return () => clearInterval(checkConnection);
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      if (isLoggedIn) {
        webrtcManager.disconnect();
      }
    };
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLogin={handleLogin} isConnecting={isConnecting} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <ChatLayout onLogout={handleLogout} />
      <Toaster />
    </>
  );
}