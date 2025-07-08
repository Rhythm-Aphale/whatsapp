'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './message-bubble';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MessageList() {
  const { messages, currentUser } = useChatStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
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