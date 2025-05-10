
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PriorityGroupProps {
  title: string;
  count: number;
  color: string;
  textColor: string;
  badgeColor: string;
  onClick: () => void;
}

export const PriorityGroup: React.FC<PriorityGroupProps> = ({ 
  title, 
  count, 
  color,
  textColor,
  badgeColor,
  onClick 
}) => {
  // Enhanced gradient colors and design based on priority type
  const getGradient = () => {
    if (title.toLowerCase().includes('høy')) {
      return 'bg-gradient-to-br from-red-50/90 via-red-50/70 to-amber-50/60';
    } else if (title.toLowerCase().includes('moderat')) {
      return 'bg-gradient-to-br from-amber-50/90 via-amber-50/70 to-yellow-50/60';
    } else {
      return 'bg-gradient-to-br from-green-50/90 via-green-50/70 to-emerald-50/60';
    }
  };
  
  // Get icon based on priority
  const getIcon = () => {
    if (title.toLowerCase().includes('høy')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      );
    } else if (title.toLowerCase().includes('moderat')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      );
    } else {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    }
  };

  return (
    <motion.button 
      className={cn(
        "flex items-center justify-between p-5 w-full rounded-2xl transition-all backdrop-blur-sm", 
        getGradient(),
        "border border-white/40 shadow-md hover:shadow-lg group"
      )}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/70 p-2 rounded-xl shadow-sm">
          {getIcon()}
        </div>
        <div className="text-left">
          <h3 className={cn("text-lg font-playfair font-medium", textColor)}>{title}</h3>
          <Badge className={cn(badgeColor, "mt-1 border shadow-sm group-hover:shadow transition-all")}>
            {count} {count === 1 ? 'funn' : 'funn'}
          </Badge>
        </div>
      </div>
      <div className={cn(
        "bg-white/70 rounded-full p-2 group-hover:bg-white/90 transition-all",
        "shadow-sm group-hover:shadow-md"
      )}>
        <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-gray-800 transition-colors" />
      </div>
    </motion.button>
  );
};
