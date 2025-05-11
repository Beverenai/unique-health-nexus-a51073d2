
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { usePullToRefresh } from './usePullToRefresh';
import { PullIndicator } from './PullIndicator';
import { PullToRefreshProps } from './types';
import { useGestureHaptics } from '@/utils/advanced-haptic-utils';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ 
  onRefresh, 
  children, 
  pullDistance = 80,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { trigger } = useHapticFeedback();
  
  const {
    refreshing,
    springY,
    rotate,
  } = usePullToRefresh(onRefresh, pullDistance, containerRef);
  
  // Add gesture recognition for additional haptic feedback
  useGestureHaptics(containerRef, trigger);
  
  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      <PullIndicator 
        springY={springY} 
        rotate={rotate} 
        refreshing={refreshing} 
      />
      
      {/* Content */}
      <motion.div style={{ y: springY }}>
        {children}
      </motion.div>
    </div>
  );
};
