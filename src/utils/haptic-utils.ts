
import { useEffect } from 'react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

/**
 * Hook to add haptic feedback to components with open/close states
 * @param isOpen Current open state
 * @param prevOpenRef A ref to the previous open state
 * @param openPattern Haptic pattern for opening
 * @param closePattern Haptic pattern for closing
 */
export function useHapticOpenState(
  isOpen: boolean, 
  openPattern: "light" | "medium" | "heavy" | "success" | "error" | "warning" | "selection" | "impact" = "medium", 
  closePattern: "light" | "medium" | "heavy" | "success" | "error" | "warning" | "selection" | "impact" = "light"
) {
  const { trigger } = useHapticFeedback();
  
  useEffect(() => {
    // This will trigger on change of isOpen
    if (isOpen) {
      trigger(openPattern);
    } else {
      trigger(closePattern);
    }
  }, [isOpen, openPattern, closePattern, trigger]);
}
