
import React from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ScanDateCardProps {
  scanDate: Date;
}

const ScanDateCard: React.FC<ScanDateCardProps> = ({ scanDate }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="mb-4 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-[#9b87f5]/10 p-1.5 rounded-full">
            <Calendar className="text-[#9b87f5]" size={16} />
          </div>
          <p className="text-sm">
            <span className="text-gray-500">Skannet </span>
            <span className="font-medium text-gray-700">
              {format(scanDate, 'd. MMMM', { locale: nb })}
            </span>
          </p>
        </div>
        
        <button 
          className="text-gray-400 hover:text-[#9b87f5] transition-colors p-1 rounded-full hover:bg-[#9b87f5]/10"
          onClick={() => navigate('/history')}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default ScanDateCard;
