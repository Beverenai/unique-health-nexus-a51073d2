
import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownIcon, RefreshCcw } from 'lucide-react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  pullDistance?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ 
  onRefresh, 
  children, 
  pullDistance = 80,
  className = ''
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useMotionValue(0);
  const springY = useSpring(0, { stiffness: 400, damping: 30 });
  const { trigger } = useHapticFeedback();
  
  // Create a transform for rotation based on the springY value
  const rotate = useTransform(springY, [0, pullDistance], [0, 180]);
  
  const isPulling = useRef(false);
  const thresholdReached = useRef(false);
  
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull if we're at the top of the page
      if (window.scrollY <= 0) {
        isPulling.current = true;
        startY.current = e.touches[0].clientY;
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
        
        // Provide light haptic feedback when reaching threshold
        if (newY > pullDistance && !thresholdReached.current) {
          trigger('medium');
          thresholdReached.current = true;
        } else if (newY < pullDistance && thresholdReached.current) {
          thresholdReached.current = false;
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
          trigger('success');
        } catch (error) {
          // Error feedback
          trigger('error');
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
  }, [onRefresh, pullDistance, springY, currentY, trigger]);
  
  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      <motion.div 
        className="absolute top-0 left-0 w-full flex justify-center items-center"
        style={{ y: springY }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm">
          {refreshing ? (
            <RefreshCcw className="animate-spin h-6 w-6 text-primary" />
          ) : (
            <motion.div
              style={{ rotate }}
            >
              <ArrowDownIcon className="h-6 w-6 text-primary" />
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Content */}
      <motion.div style={{ y: springY }}>
        {children}
      </motion.div>
    </div>
  );
};
