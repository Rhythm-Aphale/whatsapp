'use client';

import { UserList } from './user-list';
import { ChatArea } from './chat-area';
import { useChatStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface ChatLayoutProps {
  onLogout: () => void;
}

export function ChatLayout({ onLogout }: ChatLayoutProps) {
  const { currentUser, isConnected } = useChatStore();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {currentUser?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">
                  {currentUser?.username}
                </h2>
                <p className="text-sm text-gray-500">
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-500 hover:text-red-500"
            >
              <LogOut className ="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User List */}
        <UserList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea />
      </div>
    </div>
  );
}