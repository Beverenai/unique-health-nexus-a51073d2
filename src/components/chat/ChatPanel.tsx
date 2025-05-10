
import React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ChatMessage } from '@/types/supabase';
import { Button } from '@/components/ui/button';

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
    <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 animate-fade-in overflow-hidden">
      <div className="flex flex-col h-[500px] max-h-[80vh]">
        <div className="bg-gradient-to-r from-primary/90 to-primary p-4 text-white">
          <h3 className="text-lg font-medium">Helseassistenten</h3>
          <p className="text-sm text-white/80">Spør meg om dine helsedata</p>
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
    </div>
  );
};

export default ChatPanel;
