
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children, 
  icon,
  badge
}) => {
  return (
    <div className="mb-6 bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="h-8 w-8 rounded-full bg-gray-50/80 flex items-center justify-center">
              {icon}
            </div>
          )}
          <h2 className="text-lg font-medium">{title}</h2>
          {badge && <div className="ml-2">{badge}</div>}
        </div>
        <ChevronDown
          size={18}
          className={cn("text-gray-500 transition-transform duration-200", 
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default CollapsibleSection;
