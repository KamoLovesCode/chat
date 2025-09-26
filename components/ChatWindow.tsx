import React, { useEffect, useRef } from 'react';
import { ChatMessage, MessageRole, AppMode } from '../types';
import Message from './Message';
import FollowUpPrompts from './FollowUpPrompts';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onPromptClick: (prompt: string) => void;
  onAddToPage: (content: string, type: 'text' | 'image') => void;
  currentMode: AppMode;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onPromptClick, onAddToPage, currentMode }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((msg, index) => (
          <div key={index}>
            <Message 
              message={msg} 
              onAddToPage={onAddToPage}
              currentMode={currentMode}
            />
            {index === messages.length - 1 && msg.role === MessageRole.MODEL && msg.followUpPrompts && msg.followUpPrompts.length > 0 && !isLoading && (
              <FollowUpPrompts prompts={msg.followUpPrompts} onPromptClick={onPromptClick} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;