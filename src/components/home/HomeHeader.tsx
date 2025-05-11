
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface HomeHeaderProps {
  userName: string;
  scanDate: Date;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, scanDate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgen';
    if (hour < 18) return 'God dag';
    return 'God kveld';
  };
  
  return (
    <motion.div
      className="mb-2"
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
      
      <div className="flex items-center justify-between mt-2.5">
        <motion.div 
          className="w-2/3 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        
        <motion.div 
          className="flex items-center text-xs text-gray-500 gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Calendar size={12} className="text-[#9b87f5]" />
          <span>{format(scanDate, 'd. MMM', { locale: nb })}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomeHeader;
