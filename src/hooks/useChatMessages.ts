
import { useState, useEffect } from 'react';
import { getChatMessages, sendChatMessage, getHealthIssues } from '@/services/supabaseService';
import { toast } from 'sonner';
import { ChatMessage, HealthIssue } from '@/types/supabase';
import { useLocation } from 'react-router-dom';

export const useChatMessages = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthSummary, setHealthSummary] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      fetchHealthSummary();
    }
  }, [isOpen]);

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
      }
    } catch (error) {
      console.error('Error fetching health summary:', error);
    }
  };
  
  // Helper function to generate a summary based on health issues
  const generateInsightSummary = (issues: HealthIssue[]): string => {
    if (!issues.length) {
      return "Vi har ingen helseproblemer å rapportere";
    }

    // Get the top issues (max 3)
    const topIssues = issues.slice(0, 3);
    const issueNames = topIssues.map(issue => issue.name.toLowerCase());
    
    if (issueNames.some(name => name.includes('tungmetall')) && 
        issueNames.some(name => name.includes('tarm'))) {
      return "tungmetaller og tarmflora";
    }
    
    if (issueNames.some(name => name.includes('tungmetall'))) {
      if (issueNames.some(name => name.includes('stress'))) {
        return "miljøgifter og stress";
      }
      return "miljøgiftbelastning";
    } 
    
    if (issueNames.some(name => name.includes('tarm')) || 
        issueNames.some(name => name.includes('parasitt'))) {
      return "tarmhelse og parasittbelastning";
    }
    
    if (issueNames.some(name => name.includes('stress')) || 
        issueNames.some(name => name.includes('søvn'))) {
      return "stress og søvnproblemer";
    }
    
    // Generic fallback
    return "ubalanse i kroppssystemene";
  };

  const getContextBasedIntro = () => {
    // Get context-aware greeting based on current route
    const path = location.pathname;
    
    if (path === '/history') {
      return 'Dette er din historikk-side. Jeg kan hjelpe deg å forstå utviklingen i dine helsedata over tid.';
    } else if (path === '/profile') {
      return 'Dette er din profilside. Jeg kan hjelpe deg med innstillinger eller svare på spørsmål om ditt medlemskap.';
    } else if (path.includes('/issue/')) {
      return 'Jeg ser at du utforsker en helseinsikt. Jeg kan hjelpe deg med å forstå hva dette betyr for deg.';
    } else {
      // Home page with health summary
      if (healthSummary) {
        return `Hei! Jeg ser at kroppen din jobber med å balansere ${healthSummary}. Skal vi se nærmere på tiltak du kan gjøre i dag?`;
      } else {
        return 'Hei! Jeg er din personlige helseassistent. Hvordan kan jeg hjelpe deg i dag?';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    setLoading(true);
    
    try {
      // Send user message
      await sendChatMessage(inputValue, true);
      setInputValue('');
      
      // Fetch all messages again to update UI
      await fetchMessages();
      
      // In a real app, you'd have an AI response here
      // For demo purposes, we'll just add a simple response after a delay
      setTimeout(async () => {
        await sendChatMessage('Takk for din melding. Dette er en automatisk respons siden dette er en demo.', false);
        await fetchMessages();
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Det oppsto en feil ved sending av meldingen');
      setLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    loading,
    handleInputChange,
    handleSubmit,
    getContextBasedIntro
  };
};
