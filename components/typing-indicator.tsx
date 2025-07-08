'use client';

import { useChatStore } from '@/lib/store';

export function TypingIndicator() {
  const { typingUsers } = useChatStore();

  if (typingUsers.size === 0) return null;

  const typingArray = Array.from(typingUsers);
  const typingText = typingArray.length === 1 
    ? `${typingArray[0]} is typing...`
    : `${typingArray.slice(0, -1).join(', ')} and ${typingArray[typingArray.length - 1]} are typing...`;

  return (
    <div className="px-4 py-2 text-sm text-gray-500 italic">
      {typingText}
    </div>
  );
}