import { useState, useEffect } from 'react';
import { getChatMessages, sendChatMessage, sendMessageToAI } from '@/services/chatService';
import { getHealthIssues } from '@/services/healthIssueService';
import { getHistoricalCoherenceData } from '@/services/cohereceService';
import { toast } from 'sonner';
import { ChatMessage, HealthIssue } from '@/types/supabase';
import { useLocation, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useChatMessages = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthSummary, setHealthSummary] = useState<string>('');
  const [healthTopics, setHealthTopics] = useState<string[]>([]);
  const [contextData, setContextData] = useState<any>(null);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      fetchHealthSummary();
      fetchContextData();
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

  const fetchContextData = async () => {
    const path = location.pathname;
    let context: any = {
      route: path
    };
    
    try {
      // Get route-specific data for context
      if (path === '/history') {
        const coherenceData = await getHistoricalCoherenceData();
        context.coherenceData = coherenceData;
      } else if (path.includes('/issue/')) {
        const issueId = params.issueId;
        if (issueId) {
          const { data } = await supabase
            .from('health_issues')
            .select('*')
            .eq('id', issueId)
            .single();
          
          context.issueDetails = data;
        }
      } else if (path.includes('/health-system/')) {
        const systemId = params.systemId;
        // For demo, we're using the mock data from HealthSystemGrid
        // In a real app, this would fetch from the database
        context.systemDetails = {
          area: "Health System " + systemId,
          symptoms: "Various symptoms related to this system"
        };
      }

      setContextData(context);
    } catch (error) {
      console.error('Error fetching context data:', error);
    }
  };
  
  // Helper function to generate a summary based on health issues
  const generateInsightSummary = (issues: HealthIssue[]): string => {
    if (!issues.length) {
      return "din generelle helse";
    }

    // Get the top issues (max 3)
    const topIssues = issues.slice(0, 3);
    const issueNames = topIssues.map(issue => issue.name.toLowerCase());
    
    if (issueNames.some(name => name.includes('tarm')) && 
        issueNames.some(name => name.includes('avgiftning'))) {
      return "tarmhelse og avgiftningssystem";
    }
    
    if (issueNames.some(name => name.includes('tarm'))) {
      return "tarmhelse og fordøyelse";
    } 
    
    if (issueNames.some(name => name.includes('avgiftning')) || 
        issueNames.some(name => name.includes('kjemikalie'))) {
      return "avgiftning og miljøbelastning";
    }
    
    if (issueNames.some(name => name.includes('stress'))) {
      return "stresshåndtering og mental balanse";
    }

    if (issueNames.some(name => name.includes('nakke')) || 
        issueNames.some(name => name.includes('rygg'))) {
      return "muskel- og skjelettsystemet";
    }
    
    // Generic fallback
    return "kroppslige utfordringer";
  };

  const getTopHealthTopics = (issues: HealthIssue[]): string[] => {
    // Extract main topics from health issues
    const topics = issues.slice(0, 5).map(issue => {
      const name = issue.name.toLowerCase();
      
      if (name.includes('tarm') || name.includes('fordøyelse')) {
        return 'fordøyelse';
      } else if (name.includes('avgiftning') || name.includes('kjemikalie')) {
        return 'avgiftning';
      } else if (name.includes('stress') || name.includes('nervesystem')) {
        return 'stress';
      } else if (name.includes('nakke') || name.includes('rygg') || name.includes('kjeve')) {
        return 'muskel-skjelett';
      } else if (name.includes('sopp') || name.includes('mugg') || name.includes('parasitt')) {
        return 'mikrobiell balanse';
      } else {
        return name.split(' ')[0];
      }
    });
    
    // Remove duplicates
    return [...new Set(topics)];
  };

  const getContextBasedIntro = () => {
    // Get context-aware greeting based on current route
    const path = location.pathname;
    
    if (path === '/history') {
      return 'Dette er din historikk-side. Jeg kan hjelpe deg å forstå utviklingen i dine helsedata over tid.';
    } else if (path === '/profile') {
      return 'Dette er din profilside. Jeg kan hjelpe deg med innstillinger eller svare på spørsmål om ditt medlemskap.';
    } else if (path.includes('/issue/')) {
      return 'Jeg ser at du utforsker en helseinsikt. Jeg kan hjelpe deg med å forstå hva dette betyr for deg og hvilke tiltak som kan være nyttige.';
    } else if (path.includes('/priority/')) {
      return 'Jeg kan hjelpe deg med å forstå disse helseprioriteringene og gi råd om hvordan du kan håndtere dem.';
    } else {
      // Home page with health summary
      if (healthSummary) {
        return `Hei! Jeg ser at kroppen din jobber med å balansere ${healthSummary}. Skal vi se nærmere på tiltak du kan gjøre i dag?`;
      } else {
        return 'Hei! Jeg er din personlige helseassistent. Hvordan kan jeg hjelpe deg i dag?';
      }
    }
  };

  const getSuggestedQuestions = (): string[] => {
    const path = location.pathname;
    
    // Default questions
    const defaultQuestions = [
      "Hvordan kan jeg forbedre min generelle helse?",
      "Hva betyr koherens-score?",
      "Hvordan bruker jeg denne appen?"
    ];
    
    // If we have health topics, suggest relevant questions
    if (healthTopics.length > 0) {
      const topicQuestions = healthTopics.map(topic => {
        switch (topic) {
          case 'fordøyelse':
            return "Hvilke matvarer kan støtte tarmhelsen min?";
          case 'avgiftning':
            return "Hvordan kan jeg redusere kjemikaliebelastningen min?";
          case 'stress':
            return "Hvilke øvelser kan hjelpe med stresshåndtering?";
          case 'muskel-skjelett':
            return "Hvilke øvelser kan hjelpe med nakke- og ryggspenninger?";
          case 'mikrobiell balanse':
            return "Hvordan kan jeg støtte kroppens naturlige forsvar mot parasitter og sopp?";
          default:
            return `Hva kan jeg gjøre for å bedre ${topic}?`;
        }
      });
      
      return topicQuestions.slice(0, 3);
    }
    
    if (path === '/history') {
      return [
        "Hva betyr trenden i min koherens-score?",
        "Er forbedringene mine på rett spor?",
        "Hvordan kan jeg forstå dataene mine over tid?"
      ];
    } else if (path.includes('/issue/') || path.includes('/priority/')) {
      return [
        "Hva er de beste tiltakene for denne tilstanden?",
        "Hvordan lang tid tar det å se forbedringer?",
        "Hvilke kosttilskudd kan hjelpe med dette?"
      ];
    }
    
    return defaultQuestions;
  };

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

  return {
    messages,
    inputValue,
    loading,
    handleInputChange,
    handleSubmit,
    getContextBasedIntro,
    getSuggestedQuestions
  };
};
