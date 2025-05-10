
import React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ChatMessage } from '@/types/supabase';

interface ChatPanelProps {
  messages: ChatMessage[];
  inputValue: string;
  loading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  getContextBasedIntro: () => string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  inputValue,
  loading,
  handleInputChange,
  handleSubmit,
  getContextBasedIntro
}) => {
  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 p-4 animate-fade-in overflow-hidden">
      <div className="mb-3">
        <h3 className="text-lg font-medium">AI Assistent</h3>
        <p className="text-sm text-gray-500">Spør meg om dine helsedata</p>
      </div>
      
      <ChatMessages 
        messages={messages} 
        getContextBasedIntro={getContextBasedIntro}
      />
      
      <ChatInput 
        inputValue={inputValue}
        loading={loading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatPanel;
