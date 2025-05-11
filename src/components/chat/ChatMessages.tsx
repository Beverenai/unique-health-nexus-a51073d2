import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/supabase';
import { Avatar } from '@/components/ui/avatar';
import { BrainCircuit, User } from 'lucide-react';
import { format } from 'date-fns';
import { useChatSuggestions } from '@/hooks/chat/useChatSuggestions';

interface ChatMessagesProps {
  messages: ChatMessage[];
  getContextBasedIntro: () => string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, getContextBasedIntro }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use the location path directly since we're just getting suggestions
  const { getSuggestedQuestions } = useChatSuggestions('/', '', []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderGreeting = () => {
    const contextIntro = getContextBasedIntro();
    
    return (
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-8 w-8 bg-primary/20 flex items-center justify-center">
          <BrainCircuit size={16} className="text-primary" />
        </Avatar>
        <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
          <p className="text-sm">{contextIntro}</p>
        </div>
      </div>
    );
  };

  const renderSuggestedQuestions = () => {
    const questions = getSuggestedQuestions();
    
    return (
      <div className="px-4 my-3">
        <p className="text-xs text-gray-500 mb-2">Forslag til spørsmål:</p>
        <div className="flex flex-wrap gap-1">
          {questions.map((question, index) => (
            <button 
              key={index}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
              onClick={() => {
                // Implement in a future update to pre-populate the input
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  // Helper to highlight any references to health data in the AI response
  const renderMessageWithHighlights = (message: string) => {
    // This is a simple version - in a real app, you might want to use regex or a more sophisticated approach
    const scorePattern = /(\d{1,3})%/g;
    const healthTerms = ['koherens', 'tarm', 'fordøyelse', 'stress', 'avgiftning', 'immunforsvar'];
    
    let highlightedMessage = message;
    
    // Highlight percentage scores
    highlightedMessage = highlightedMessage.replace(
      scorePattern, 
      '<span class="font-medium text-primary">$1%</span>'
    );
    
    // Highlight health terms
    healthTerms.forEach(term => {
      const termPattern = new RegExp(`(${term})`, 'gi');
      highlightedMessage = highlightedMessage.replace(
        termPattern,
        '<span class="font-medium text-primary">$1</span>'
      );
    });
    
    return <p className="text-sm" dangerouslySetInnerHTML={{ __html: highlightedMessage }} />;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white/50">
      {messages.length === 0 ? (
        <>
          {renderGreeting()}
          {renderSuggestedQuestions()}
        </>
      ) : (
        <>
          {renderGreeting()}
          {renderSuggestedQuestions()}
          
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 mb-4 ${message.is_user ? 'justify-end' : ''}`}
            >
              {!message.is_user && (
                <Avatar className="h-8 w-8 bg-primary/20 flex items-center justify-center">
                  <BrainCircuit size={16} className="text-primary" />
                </Avatar>
              )}
              
              <div 
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.is_user 
                    ? 'bg-primary/10 text-gray-800 rounded-tr-none' 
                    : 'bg-gray-100 rounded-tl-none'
                }`}
              >
                {message.is_user ? (
                  <p className="text-sm">{message.message}</p>
                ) : (
                  renderMessageWithHighlights(message.message)
                )}
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formatTimestamp(message.created_at)}
                </p>
              </div>
              
              {message.is_user && (
                <Avatar className="h-8 w-8 bg-gray-200 flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatMessages;
