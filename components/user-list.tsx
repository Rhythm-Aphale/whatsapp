'use client';

import { useChatStore } from '@/lib/store';
import { Users, Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function UserList() {
  const { users, currentUser, selectedUser, setSelectedUser } = useChatStore();

  const otherUsers = users.filter(user => user.id !== currentUser?.id);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="h-4 w-4" />
          <span className="font-medium">Online Users ({otherUsers.length})</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {otherUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser?.id === user.id
                  ? 'bg-green-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Circle 
                  className={`absolute -bottom-1 -right-1 h-4 w-4 ${
                    user.isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-500">
                  {user.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          ))}

          {otherUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No other users online</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}