
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  description?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children, 
  icon,
  badge,
  description
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
          <div>
            <h2 className="text-lg font-medium">{title}</h2>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
          {badge && <div className="ml-2">{badge}</div>}
        </div>
        <ChevronDown
          size={18}
          className={cn("text-gray-500 transition-transform duration-200", 
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className="relative overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection;
