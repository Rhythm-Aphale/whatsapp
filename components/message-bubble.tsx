'use client';
import { format } from 'date-fns';
import { Download, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'file';
  fileData?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (fileData: any) => {
    const link = document.createElement('a');
    link.href = fileData.url;
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <p className="text-sm text-gray-500 mb-1 px-1">{message.senderName}</p>
        )}
        <div
          className={`rounded-lg px-4 py-2 ${
            isOwn
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          {message.type === 'text' ? (
            <p className="break-words">{message.content}</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4" />
                <span className="font-medium">{message.fileData?.name}</span>
              </div>
              <p className="text-sm opacity-75">
                {formatFileSize(message.fileData?.size || 0)}
              </p>
              <Button
                variant={isOwn ? 'secondary' : 'default'}
                size="sm"
                onClick={() => handleDownload(message.fileData)}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </p>
      </div>
    </div>
  );
}