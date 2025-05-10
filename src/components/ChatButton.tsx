
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
            "w-14 h-14 rounded-full shadow-lg flex items-center justify-center",
            isOpen ? "bg-gray-700" : "bg-primary"
          )}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <MessageSquare size={24} />
          )}
        </Button>
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
