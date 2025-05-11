
import React from 'react';
import { HapticPattern } from '@/hooks/use-haptic-feedback';

// Progressive haptic patterns for multi-step processes
export const PROGRESSIVE_HAPTICS = {
  start: [10, 0, 10],
  progress: [10, 30, 10], 
  complete: [10, 20, 40, 60],
  error: [60, 50, 60, 50]
};

type ProgressStage = 'start' | 'progress' | 'complete' | 'error';

/**
 * Hook to handle progressive haptic feedback for multi-step processes
 * @param trigger The haptic trigger function
 * @returns Functions to trigger different stages of progressive feedback
 */
export function useProgressiveHaptics(trigger: (pattern: HapticPattern) => void) {
  const triggerProgressiveHaptic = (stage: ProgressStage) => {
    switch(stage) {
      case 'start':
        trigger('light');
        break;
      case 'progress':
        trigger('medium');
        break;
      case 'complete':
        trigger('success');
        break;
      case 'error':
        trigger('error');
        break;
    }
  };

  return {
    start: () => triggerProgressiveHaptic('start'),
    progress: () => triggerProgressiveHaptic('progress'),
    complete: () => triggerProgressiveHaptic('complete'),
    error: () => triggerProgressiveHaptic('error')
  };
}

/**
 * Hook for gesture recognition haptic feedback
 * @param element The element to attach gesture detection to
 * @param trigger The haptic trigger function
 */
export function useGestureHaptics(
  elementRef: React.RefObject<HTMLElement>,
  trigger: (pattern: HapticPattern) => void
) {
  React.useEffect(() => {
    if (!elementRef.current) return;
    
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    const element = elementRef.current;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches[0]) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / duration;
      
      // Swipe detection
      if (distance > 50 && duration < 300) {
        // Fast swipe
        if (velocity > 0.5) {
          trigger('medium');
        } else {
          trigger('light');
        }
      }
      
      // Long press detection
      if (distance < 10 && duration > 500) {
        trigger('heavy');
      }
    };
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, trigger]);
}
