
import { useState, useEffect } from 'react';
import { getHealthIssues } from '@/services/healthIssueService';
import { generateInsightSummary, getTopHealthTopics } from '@/utils/chatContextUtils';

export const useHealthContext = (isOpen: boolean) => {
  const [healthSummary, setHealthSummary] = useState<string>('');
  const [healthTopics, setHealthTopics] = useState<string[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      fetchHealthSummary();
    }
  }, [isOpen]);

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

  return {
    healthSummary,
    healthTopics,
    fetchHealthSummary
  };
};
