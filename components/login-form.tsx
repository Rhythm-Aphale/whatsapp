'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, User } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string) => void;
  isConnecting: boolean;
}

export function LoginForm({ onLogin, isConnecting }: LoginFormProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Join Chat
          </CardTitle>
          <CardDescription>
            Enter your username to start chatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter your username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  disabled={isConnecting}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600" 
              disabled={isConnecting || !username.trim()}
            >
              {isConnecting ? 'Connecting...' : 'Join Chat'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}