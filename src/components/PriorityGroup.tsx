
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
  // Enhanced gradient colors based on priority type
  const getGradient = () => {
    if (title.toLowerCase().includes('høy')) {
      return 'bg-gradient-to-r from-red-50 to-amber-50';
    } else if (title.toLowerCase().includes('moderat')) {
      return 'bg-gradient-to-r from-amber-50 to-yellow-50';
    } else {
      return 'bg-gradient-to-r from-green-50 to-emerald-50';
    }
  };

  return (
    <motion.button 
      className={cn(
        "flex items-center justify-between p-4 w-full rounded-xl transition-all", 
        getGradient(),
        "border border-white/40 hover:shadow-md hover:scale-[1.02] group"
      )}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <h3 className={cn("text-lg font-playfair", textColor)}>{title}</h3>
        <Badge className={cn(badgeColor, "border shadow-sm group-hover:shadow transition-all")}>
          {count} {count === 1 ? 'funn' : 'funn'}
        </Badge>
      </div>
      <div className={cn(
        "bg-white/50 rounded-full p-1.5 group-hover:bg-white/80 transition-all",
        "shadow-sm group-hover:shadow"
      )}>
        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-800 transition-colors" />
      </div>
    </motion.button>
  );
};
