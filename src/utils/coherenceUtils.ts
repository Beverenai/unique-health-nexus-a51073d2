
/**
 * Utility functions for coherence score display and calculations
 */

// Get color based on score
export const getModernColor = (score: number): string => {
  if (score < 40) return '#EA384C'; // Red for high load/low score
  if (score < 60) return '#F7D154'; // Yellow for moderate load
  return '#77C17E'; // Green for low load/high score
};

// Get text color class based on score
export const getModernTextColor = (score: number): string => {
  if (score < 40) return 'text-[#EA384C]'; 
  if (score < 60) return 'text-[#F7D154]';
  return 'text-[#77C17E]';
};

// Get status label based on score
export const getStatusLabel = (score: number): string => {
  if (score < 40) return 'Krever oppmerksomhet';
  if (score < 60) return 'Moderat balanse';
  return 'God balanse';
};

// Get qualitative body state description
export const getBodyStateDescription = (score: number): string => {
  if (score < 40) return 'Nedsatt regulering';
  if (score < 60) return 'Jobber med belastninger';
  return 'I balanse';
};

// Get empowering health message
export const getHealthMessage = (score: number): string => {
  if (score < 40) {
    return 'Kroppen din trenger støtte for å gjenvinne balanse. Følg anbefalingene for å redusere belastningene.';
  } else if (score < 60) {
    return 'Kroppen din jobber med noen belastninger, men har god kapasitet. Følg anbefalingene for optimal balanse.';
  } else {
    return 'Kroppen din er i god balanse og fungerer optimalt. Fortsett med gode vaner for å opprettholde tilstanden.';
  }
};

// Generate summary insights based on health issues with improved formatting
export const generateInsightSummary = (issues: any[]): string[] => {
  if (!issues || issues.length === 0) {
    return ['Ingen spesifikke belastninger identifisert'];
  }
  
  // Sort by load (highest first) and take top 3
  const topIssues = issues
    .sort((a, b) => b.load - a.load)
    .slice(0, 3);
    
  // Format insight messages to be more conversational
  return topIssues.map(issue => {
    const name = issue.name;
    
    if (issue.load > 70) {
      return `${name} krever umiddelbar oppmerksomhet`;
    } else if (issue.load > 50) {
      return `Moderat belastning fra ${name.toLowerCase()}`;
    } else {
      return `Lett påvirkning fra ${name.toLowerCase()}`;
    }
  });
};

// Get comparative message if previous scan exists
export const getComparativeMessage = (currentScore: number, previousScore: number | null): string | null => {
  if (previousScore === null) return null;
  
  const difference = currentScore - previousScore;
  const absDiff = Math.abs(difference);
  
  if (absDiff < 5) return 'Kroppsbalansen er stabil siden forrige skanning.';
  
  if (difference > 0) {
    return `Kroppsbalansen har forbedret seg med ${absDiff} poeng siden forrige skanning.`;
  } else {
    return `Kroppsbalansen har redusert med ${absDiff} poeng siden forrige skanning.`;
  }
};
