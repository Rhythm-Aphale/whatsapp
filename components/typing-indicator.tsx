'use client';

import { useChatStore } from '@/lib/store';

export function TypingIndicator() {
  const { typingUsers, selectedUser } = useChatStore();

  if (!selectedUser || !typingUsers.has(selectedUser.username)) return null;

  return (
    <div className="px-4 py-2 text-sm text-gray-500 italic">
      {selectedUser.username} is typing...
    </div>
  );
}