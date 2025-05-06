
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
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
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 p-4 animate-fade-in">
          <div className="mb-3">
            <h3 className="text-lg font-medium">AI Assistent</h3>
            <p className="text-sm text-gray-500">Spør meg om dine helsedata</p>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
            <div className="bg-gray-200 rounded-lg p-2 mb-2 text-sm inline-block">
              Hei! Jeg er din personlige helseassistent. Hvordan kan jeg hjelpe deg i dag?
            </div>
          </div>
          
          <div className="flex">
            <input 
              type="text" 
              placeholder="Skriv en melding..." 
              className="flex-grow border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <Button className="rounded-l-none">Send</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
