
import React from 'react';
import { motion } from 'framer-motion';

const HomeLoading: React.FC = () => {
  return (
    <div className="flex justify-center py-20">
      <motion.div 
        className="rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity
        }}
      />
    </div>
  );
};

export default HomeLoading;
