
import { useState } from 'react';
import { sendMessageToAI } from '@/services/chatService';
import { toast } from 'sonner';

export const useChatInput = (fetchMessages: () => Promise<void>, contextData: any) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    setLoading(true);
    
    try {
      console.log('Sending message with context:', inputValue, contextData);
      // Send user message with context data
      const userMessage = inputValue;
      setInputValue('');
      
      // Fetch all messages again to update UI with user's message
      await fetchMessages();
      
      // Get AI response
      const aiResponse = await sendMessageToAI(userMessage, contextData);
      console.log('Received AI response:', aiResponse);
      
      // Fetch all messages again to update UI with AI's response
      await fetchMessages();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Det oppsto en feil ved sending av meldingen. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
  };

  return {
    inputValue,
    loading,
    handleInputChange,
    handleSubmit
  };
};
