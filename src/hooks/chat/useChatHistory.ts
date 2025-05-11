
import { useState, useEffect } from 'react';
import { getChatMessages } from '@/services/chatService';
import { ChatMessage } from '@/types/supabase';

export const useChatHistory = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getChatMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    fetchMessages
  };
};
