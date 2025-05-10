
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
  if (score < 60) return 'Moderat';
  return 'Balansert';
};
