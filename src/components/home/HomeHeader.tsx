
import React from 'react';
import { motion } from 'framer-motion';

interface HomeHeaderProps {
  userName: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgen';
    if (hour < 18) return 'God dag';
    return 'God kveld';
  };
  
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1 
        className="text-2xl font-playfair font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {getGreeting()}, {userName}
      </motion.h1>
      
      <motion.div 
        className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-2.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
    </motion.div>
  );
};

export default HomeHeader;
