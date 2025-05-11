
import { useRouteContext } from './chat/useRouteContext';
import { useChatHistory } from './chat/useChatHistory';
import { useHealthContext } from './chat/useHealthContext';

export const useChatData = (isOpen: boolean) => {
  const { messages, fetchMessages } = useChatHistory(isOpen);
  const { healthSummary, healthTopics } = useHealthContext(isOpen);
  const { contextData, location } = useRouteContext(isOpen);

  return {
    messages,
    healthSummary,
    healthTopics,
    contextData,
    fetchMessages,
    location
  };
};
