'use client';

import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { TypingIndicator } from './typing-indicator';
import { useChatStore } from '@/lib/store';
import { MessageCircle } from 'lucide-react';

export function ChatArea() {
  const { users, currentUser } = useChatStore();
  const otherUsers = users.filter(user => user.id !== currentUser?.id);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-full">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">Group Chat</h1>
            <p className="text-sm text-gray-500">
              {otherUsers.length} other user{otherUsers.length !== 1 ? 's' : ''} online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList />
        <TypingIndicator />
        <MessageInput />
      </div>
    </div>
  );
}