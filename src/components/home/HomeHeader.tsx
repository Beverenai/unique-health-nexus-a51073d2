
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HomeHeaderProps {
  userName: string;
  scanDate: Date;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, scanDate }) => {
  const navigate = useNavigate();
  const today = new Date();
  const daysSinceScan = differenceInDays(today, scanDate);
  const isScanRecommended = daysSinceScan >= 30;
  
  // Get the first letter of the first name and last name
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <motion.div 
      className="container mx-auto px-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-2 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Hei, {userName}</h1>
          <p className="text-gray-600 text-sm">
            Din siste kroppsanalyse er fra{' '}
            <span className="font-medium text-gray-700">
              {format(scanDate, 'd. MMMM yyyy', { locale: nb })}
            </span>
          </p>
          
          {isScanRecommended && (
            <div className="mt-2 text-sm px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg inline-block">
              <span className="text-amber-600">
                Det har gått {daysSinceScan} dager siden siste skanning. En ny skanning anbefales for oppdaterte resultater.
              </span>
            </div>
          )}
        </div>
        
        <Avatar 
          className="h-10 w-10 bg-[#9b87f5]/10 hover:bg-[#9b87f5]/20 transition-colors cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <AvatarFallback className="text-[#9b87f5] font-medium">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
      </div>
    </motion.div>
  );
};

export default HomeHeader;
