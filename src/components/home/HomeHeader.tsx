
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface HomeHeaderProps {
  userName: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'God morgen';
    if (hour < 18) return 'God dag';
    return 'God kveld';
  };
  
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-1">
        <motion.h1 
          className="text-3xl font-playfair font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {getGreeting()}, {userName}
        </motion.h1>
        
        <motion.div 
          className="bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-full p-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar size={18} className="text-[#9b87f5]" />
        </motion.div>
      </div>
      
      <div className="flex items-center">
        <p className="text-sm text-gray-500 font-medium">
          {format(currentTime, 'EEEE d. MMMM', { locale: nb })}
        </p>
        <div className="h-1 w-1 rounded-full bg-gray-300 mx-2"></div>
        <p className="text-sm text-[#9b87f5] font-medium">
          Helsetilstand
        </p>
      </div>
      
      <motion.div 
        className="w-full h-0.5 bg-gradient-to-r from-[#9b87f5]/50 via-[#9b87f5] to-[#9b87f5]/50 mt-4 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      />
    </motion.div>
  );
};

export default HomeHeader;
