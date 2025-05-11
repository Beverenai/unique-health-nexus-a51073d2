
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

// NEW: Get qualitative body state description
export const getBodyStateDescription = (score: number): string => {
  if (score < 40) return 'Nedsatt regulering';
  if (score < 60) return 'Jobber med belastninger';
  return 'I balanse';
};

// NEW: Get empowering health message
export const getHealthMessage = (score: number): string => {
  if (score < 40) {
    return 'Kroppen din trenger støtte for å gjenvinne balanse.';
  } else if (score < 60) {
    return 'Kroppen din er i balanse, men håndterer noen belastninger.';
  } else {
    return 'Kroppen din er i god balanse og fungerer optimalt.';
  }
};

// NEW: Generate summary insights based on health issues
export const generateInsightSummary = (issues: any[]): string[] => {
  if (!issues || issues.length === 0) {
    return ['Ingen spesifikke belastninger identifisert'];
  }
  
  // Sort by load (highest first) and take top 3
  return issues
    .sort((a, b) => b.load - a.load)
    .slice(0, 3)
    .map(issue => issue.name);
};
