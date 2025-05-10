
import { useState, useEffect } from 'react';
import { getChatMessages } from '@/services/chatService';
import { getHealthIssues } from '@/services/healthIssueService';
import { useLocation, useParams } from 'react-router-dom';
import { ChatMessage } from '@/types/supabase';
import { generateInsightSummary, getTopHealthTopics, fetchContextData } from '@/utils/chatContextUtils';

export const useChatData = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [healthSummary, setHealthSummary] = useState<string>('');
  const [healthTopics, setHealthTopics] = useState<string[]>([]);
  const [contextData, setContextData] = useState<any>(null);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      fetchHealthSummary();
      fetchContextForCurrentRoute();
    }
  }, [isOpen, location.pathname]);

  const fetchMessages = async () => {
    try {
      const data = await getChatMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const fetchHealthSummary = async () => {
    try {
      const issues = await getHealthIssues();
      if (issues.length > 0) {
        const sortedIssues = [...issues].sort((a, b) => b.load - a.load);
        setHealthSummary(generateInsightSummary(sortedIssues));
        
        // Get top health topics for suggesting questions
        setHealthTopics(getTopHealthTopics(sortedIssues));
      }
    } catch (error) {
      console.error('Error fetching health summary:', error);
    }
  };

  const fetchContextForCurrentRoute = async () => {
    const context = await fetchContextData(location.pathname, params);
    setContextData(context);
  };

  return {
    messages,
    healthSummary,
    healthTopics,
    contextData,
    fetchMessages,
    location
  };
};
