
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface HomeHeaderProps {
  userName: string;
  scanDate: Date;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, scanDate }) => {
  const today = new Date();
  const daysSinceScan = differenceInDays(today, scanDate);
  const isScanRecommended = daysSinceScan >= 30;
  
  return (
    <motion.div 
      className="container mx-auto px-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-2">
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
    </motion.div>
  );
};

export default HomeHeader;
