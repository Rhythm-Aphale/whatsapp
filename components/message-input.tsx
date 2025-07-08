'use client';

import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Paperclip, 
  Smile, 
  X 
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { WebRTCManager } from '@/lib/webrtc';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const webrtcManager = WebRTCManager.getInstance();

  const handleSendMessage = () => {
    if (selectedFile) {
      handleFileSend();
    } else if (message.trim()) {
      webrtcManager.sendMessage(message.trim());
      setMessage('');
      handleStopTyping();
    }
  };

  const handleFileSend = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: e.target?.result as string
      };

      webrtcManager.sendMessage(selectedFile.name, 'file', fileData);
      setSelectedFile(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      webrtcManager.sendTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      webrtcManager.sendTypingStatus(false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true
  });

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.emoji);
    inputRef.current?.focus();
  };

  return (
    <div {...getRootProps()} className="border-t border-gray-200 bg-white">
      <input {...getInputProps()} />
      
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-blue-300 border-dashed flex items-center justify-center z-10">
          <div className="text-blue-600 text-center">
            <Paperclip className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Drop files here to send</p>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  width={320}
                  height={400}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={selectedFile ? "Send file..." : "Type a message..."}
              className="pr-12"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() && !selectedFile}
            className="bg-green-500 hover:bg-green-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}