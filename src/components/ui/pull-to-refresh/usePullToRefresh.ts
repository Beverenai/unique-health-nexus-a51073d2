
import { useState, useRef, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useProgressiveHaptics } from '@/utils/advanced-haptic-utils';

export const usePullToRefresh = (
  onRefresh: () => Promise<void>,
  pullDistance: number = 80,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useMotionValue(0);
  const springY = useSpring(0, { stiffness: 400, damping: 30 });
  const { trigger } = useHapticFeedback();
  const progressiveHaptics = useProgressiveHaptics(trigger);
  
  // Create a transform for rotation based on the springY value
  const rotate = useTransform(springY, [0, pullDistance], [0, 180]);
  
  const isPulling = useRef(false);
  const thresholdReached = useRef(false);
  const thresholds = useRef<Map<number, boolean>>(new Map());
  
  // Set up progressive thresholds for haptic feedback
  useEffect(() => {
    // Reset thresholds
    thresholds.current = new Map([
      [pullDistance * 0.3, false], // Light feedback at 30%
      [pullDistance * 0.6, false], // Medium feedback at 60%
      [pullDistance, false],       // Heavy feedback at 100%
    ]);
  }, [pullDistance]);
  
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull if we're at the top of the page
      if (window.scrollY <= 0) {
        isPulling.current = true;
        startY.current = e.touches[0].clientY;
        
        // Reset all threshold flags when starting a new pull
        for (const threshold of thresholds.current.keys()) {
          thresholds.current.set(threshold, false);
        }
        
        // Initial haptic feedback
        progressiveHaptics.start();
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current) return;
      
      const currentTouchY = e.touches[0].clientY;
      const diff = currentTouchY - startY.current;
      
      // Only allow pulling down
      if (diff > 0) {
        // Resistance factor makes it harder to pull
        const newY = Math.min(diff * 0.4, pullDistance * 1.5);
        currentY.set(newY);
        springY.set(newY);
        
        // Progressive haptic feedback at different thresholds
        for (const [threshold, triggered] of thresholds.current.entries()) {
          if (!triggered && newY >= threshold) {
            // Mark this threshold as triggered
            thresholds.current.set(threshold, true);
            
            if (threshold === pullDistance) {
              // Main threshold - ready to refresh
              thresholdReached.current = true;
              trigger('heavy');
            } else if (threshold === pullDistance * 0.6) {
              // Medium progress
              progressiveHaptics.progress();
            } else {
              // Light initial feedback
              trigger('light');
            }
          } else if (triggered && newY < threshold) {
            // Reset threshold when going back
            thresholds.current.set(threshold, false);
            if (threshold === pullDistance) {
              thresholdReached.current = false;
              trigger('light');
            }
          }
        }
        
        // Prevent default scrolling behavior
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = async () => {
      if (!isPulling.current) return;
      
      isPulling.current = false;
      const pullValue = currentY.get();
      
      if (pullValue >= pullDistance) {
        // User pulled far enough to trigger refresh
        setRefreshing(true);
        trigger('impact');
        
        try {
          await onRefresh();
          // Success feedback
          progressiveHaptics.complete();
        } catch (error) {
          // Error feedback
          progressiveHaptics.error();
          console.error('Refresh failed:', error);
        } finally {
          setRefreshing(false);
        }
      }
      
      // Reset position
      currentY.set(0);
      springY.set(0);
      thresholdReached.current = false;
    };
    
    const element = containerRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [onRefresh, pullDistance, springY, currentY, trigger, progressiveHaptics]);

  return {
    refreshing,
    currentY,
    springY,
    rotate,
    isPulling,
    thresholdReached
  };
};
