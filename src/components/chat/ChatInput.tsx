
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  inputValue, 
  loading, 
  onInputChange, 
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="flex">
      <Input 
        type="text" 
        placeholder="Skriv en melding..." 
        className="flex-grow rounded-full border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        value={inputValue}
        onChange={onInputChange}
        disabled={loading}
      />
      <Button 
        type="submit" 
        className="ml-2 rounded-full w-10 h-10 p-0 flex items-center justify-center"
        disabled={loading || !inputValue.trim()}
      >
        {loading ? (
          <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin" />
        ) : (
          <Send size={18} />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;
