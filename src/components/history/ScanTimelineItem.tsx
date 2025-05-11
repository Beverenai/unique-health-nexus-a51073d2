
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import CoherenceRing from '@/components/CoherenceRing';

interface ScanTimelineItemProps {
  scan: {
    id: string;
    date: string;
    score: number;
    status: string;
  };
  index: number;
  totalScans: number;
}

const ScanTimelineItem: React.FC<ScanTimelineItemProps> = ({ scan, index, totalScans }) => {
  const navigate = useNavigate();
  const isFirst = index === 0;
  const isLatest = index === 0; // First item is the latest in our array
  
  const handleClick = () => {
    navigate(`/?scan=${scan.id}`);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex flex-col items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        {/* Scan ring component */}
        <CoherenceRing score={scan.score} size="sm" />
        
        {isLatest && (
          <div className="absolute -top-1 -right-1 bg-[#9b87f5] text-white text-[10px] rounded-full px-2 py-0.5 font-medium">
            Nyeste
          </div>
        )}
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-sm font-medium">
          {format(new Date(scan.date), 'd. MMM', { locale: nb })}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {format(new Date(scan.date), 'yyyy')}
        </p>
      </div>
    </motion.div>
  );
};

export default ScanTimelineItem;
