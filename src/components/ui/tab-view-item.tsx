
import React from 'react';
import { motion } from 'framer-motion';

interface TabViewItemProps {
  children: React.ReactNode;
  isActive: boolean;
  transitionDelay?: number;
}

const TabViewItem: React.FC<TabViewItemProps> = ({ 
  children, 
  isActive, 
  transitionDelay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 15
      }}
      transition={{
        duration: 0.3,
        delay: transitionDelay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className={`w-full ${isActive ? 'block' : 'hidden'}`}
    >
      {children}
    </motion.div>
  );
};

export default TabViewItem;
