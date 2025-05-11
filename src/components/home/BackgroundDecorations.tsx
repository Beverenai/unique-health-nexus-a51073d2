
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundDecorations: React.FC = () => {
  return (
    <>
      <motion.div 
        className="fixed -z-10 top-1/4 left-0 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl"
        animate={{
          opacity: [0.2, 0.3, 0.2],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="fixed -z-10 bottom-1/3 right-0 w-60 h-60 bg-blue-50/20 rounded-full blur-3xl"
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.08, 1]
        }}
        transition={{
          duration: 10,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );
};

export default BackgroundDecorations;
