
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <form 
      onSubmit={onSubmit} 
      className="p-3 border-t bg-white"
    >
      <div className="relative">
        <Input
          placeholder="Skriv din melding..."
          value={inputValue}
          onChange={onInputChange}
          disabled={loading}
          className="pr-10 bg-gray-50 border-gray-200 focus-visible:ring-primary"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={loading || !inputValue.trim()}
          className="absolute right-0 top-0 h-full rounded-l-none text-primary hover:text-primary hover:bg-transparent"
        >
          <Send size={18} className={loading ? 'opacity-50' : 'opacity-100'} />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
