
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatMessages } from '@/hooks/useChatMessages';
import ChatPanel from '@/components/chat/ChatPanel';

interface ChatButtonProps {
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    messages, 
    inputValue, 
    loading, 
    handleInputChange, 
    handleSubmit, 
    getContextBasedIntro 
  } = useChatMessages(isOpen);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={cn(
        "fixed bottom-20 right-6 z-50 transition-all duration-300",
        className
      )}>
        <Button 
          onClick={toggleChat} 
          className={cn(
            "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all",
            isOpen ? "bg-gray-700 hover:bg-gray-800" : "bg-primary hover:bg-primary/90 animate-pulse"
          )}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <MessageSquare size={24} />
          )}
        </Button>
        {!isOpen && (
          <div className="absolute -top-12 right-0 bg-primary text-white text-xs py-1 px-3 rounded-full whitespace-nowrap shadow-md">
            Spør om helsedata
          </div>
        )}
      </div>

      {isOpen && (
        <ChatPanel
          messages={messages}
          inputValue={inputValue}
          loading={loading}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          getContextBasedIntro={getContextBasedIntro}
        />
      )}
    </>
  );
};

export default ChatButton;
