
import { useState } from 'react';
import { sendMessageToAI } from '@/services/chatService';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { useChatData } from './useChatData';
import { getContextBasedIntro, getSuggestedQuestions } from '@/utils/chatSuggestionUtils';

export const useChatMessages = (isOpen: boolean) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  
  const {
    messages,
    healthSummary,
    healthTopics,
    contextData,
    fetchMessages,
    location
  } = useChatData(isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    setLoading(true);
    
    try {
      // Send user message with context data
      const userMessage = inputValue;
      setInputValue('');
      
      // Fetch all messages again to update UI with user's message
      await fetchMessages();
      
      // Get AI response
      const aiResponse = await sendMessageToAI(userMessage, contextData);
      
      // Fetch all messages again to update UI with AI's response
      await fetchMessages();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Det oppsto en feil ved sending av meldingen');
    } finally {
      setLoading(false);
    }
  };

  // Context-based utility functions that use the current path and health data
  const getContextIntro = () => {
    return getContextBasedIntro(location.pathname, healthSummary);
  };

  const getQuestionSuggestions = () => {
    return getSuggestedQuestions(location.pathname, healthTopics);
  };

  return {
    messages,
    inputValue,
    loading,
    handleInputChange,
    handleSubmit,
    getContextBasedIntro: getContextIntro,
    getSuggestedQuestions: getQuestionSuggestions
  };
};
