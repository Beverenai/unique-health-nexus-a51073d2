
import { useChatData } from './useChatData';
import { useChatInput } from './chat/useChatInput';
import { useChatSuggestions } from './chat/useChatSuggestions';

export const useChatMessages = (isOpen: boolean) => {
  const {
    messages,
    healthSummary,
    healthTopics,
    contextData,
    fetchMessages,
    location
  } = useChatData(isOpen);

  const {
    inputValue,
    loading,
    handleInputChange,
    handleSubmit
  } = useChatInput(fetchMessages, contextData);

  const {
    getContextBasedIntro,
    getSuggestedQuestions
  } = useChatSuggestions(location.pathname, healthSummary, healthTopics);

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
