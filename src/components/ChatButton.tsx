import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { sendChatMessage, getChatMessages, getHealthIssues } from '@/services/supabaseService';
import { toast } from 'sonner';
import { ChatMessage, HealthIssue } from '@/types/supabase';
import { useLocation } from 'react-router-dom';

interface ChatButtonProps {
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthSummary, setHealthSummary] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      fetchHealthSummary();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 p-4 animate-fade-in overflow-hidden">
          <div className="mb-3">
            <h3 className="text-lg font-medium">AI Assistent</h3>
            <p className="text-sm text-gray-500">Spør meg om dine helsedata</p>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="bg-gray-200 rounded-lg p-3 mb-2 text-sm max-w-[85%]">
                {getContextBasedIntro()}
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "p-3 mb-2 text-sm max-w-[85%] rounded-xl animate-fade-in",
                    msg.is_user 
                      ? "bg-primary text-white ml-auto rounded-tr-none" 
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  )}
                >
                  {msg.message}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="flex">
            <Input 
              type="text" 
              placeholder="Skriv en melding..." 
              className="flex-grow rounded-full border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={inputValue}
              onChange={handleInputChange}
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
        </div>
      )}
    </>
  );
};

export default ChatButton;
