'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './message-bubble';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MessageList() {
  const { messages, currentUser, selectedUser } = useChatStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 p-4 text-center text-gray-500">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  const filteredMessages = messages.filter(
    (message) =>
      (message.senderId === currentUser?.id && message.targetUserId === selectedUser.id) ||
      (message.senderId === selectedUser.id && message.targetUserId === currentUser?.id)
  );

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser?.id}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}