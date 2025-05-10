
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types/supabase';

interface ChatMessagesProps {
  messages: ChatMessage[];
  getContextBasedIntro: () => string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, getContextBasedIntro }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="h-64 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="bg-gray-200 rounded-lg p-3 mb-2 text-sm max-w-[85%]">
          {getContextBasedIntro()}
        </div>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "p-3 mb-2 text-sm max-w-[85%] rounded-xl animate-fade-in",
              msg.is_user 
                ? "bg-primary text-white ml-auto rounded-tr-none" 
                : "bg-gray-200 text-gray-800 rounded-tl-none"
            )}
          >
            {msg.message}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
