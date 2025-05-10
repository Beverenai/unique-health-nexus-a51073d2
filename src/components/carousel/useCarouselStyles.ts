
import { HealthIssue } from '@/types/supabase';

/**
 * Custom hook that provides styling utilities for health issue cards
 */
export const useCarouselStyles = () => {
  /**
   * Returns the appropriate color for progress bars based on load value
   */
  const getProgressColor = (load: number): string => {
    if (load < 40) return 'bg-[#77C17E]';
    if (load < 60) return 'bg-[#F7D154]';
    return 'bg-[#EA384C]';
  };

  /**
   * Returns the appropriate text color based on load value
   */
  const getTextColor = (load: number): string => {
    if (load < 40) return 'text-[#77C17E]';
    if (load < 60) return 'text-[#F7D154]';
    return 'text-[#EA384C]';
  };

  return {
    getProgressColor,
    getTextColor
  };
};
