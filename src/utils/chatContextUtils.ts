
import { supabase } from '@/integrations/supabase/client';
import { HealthIssue } from '@/types/supabase';
import { getHistoricalCoherenceData } from '@/services/cohereceService';

/**
 * Generates a summary of health issues for the chat assistant
 */
export const generateInsightSummary = (issues: HealthIssue[]): string => {
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

/**
 * Extract main topics from health issues for suggested questions
 */
export const getTopHealthTopics = (issues: HealthIssue[]): string[] => {
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

/**
 * Fetches context data based on the current route
 */
export const fetchContextData = async (path: string, params: any) => {
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

    return context;
  } catch (error) {
    console.error('Error fetching context data:', error);
    return context;
  }
};
