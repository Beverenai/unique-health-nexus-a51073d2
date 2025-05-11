
import { getContextBasedIntro, getSuggestedQuestions } from '@/utils/chatSuggestionUtils';

export const useChatSuggestions = (path: string, healthSummary: string, healthTopics: string[]) => {
  const getContextIntro = () => {
    return getContextBasedIntro(path, healthSummary);
  };

  const getQuestionSuggestions = () => {
    return getSuggestedQuestions(path, healthTopics);
  };

  return {
    getContextBasedIntro: getContextIntro,
    getSuggestedQuestions: getQuestionSuggestions
  };
};
