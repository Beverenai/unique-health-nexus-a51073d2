
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SystemIcon from '@/components/health/SystemIcon';
import { Button } from '@/components/ui/button';

interface HealthSystemCardProps {
  area: string;
  symptoms: string;
  causes: string;
  recommendations: string;
  index: number;
}

const HealthSystemCard: React.FC<HealthSystemCardProps> = ({ 
  area, 
  symptoms, 
  causes, 
  recommendations, 
  index 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine background color based on system type
  const getBgGradient = (area: string): string => {
    const areaLower = area.toLowerCase();
    
    if (areaLower.includes('tarm') || areaLower.includes('fordøyelse')) {
      return 'from-green-50/80 to-green-100/40';
    } else if (areaLower.includes('lymfe')) {
      return 'from-blue-50/80 to-blue-100/40';
    } else if (areaLower.includes('nakke') || areaLower.includes('rygg')) {
      return 'from-amber-50/80 to-amber-100/40';
    } else if (areaLower.includes('oksidativ') || areaLower.includes('stress')) {
      return 'from-rose-50/80 to-rose-100/40';
    } else if (areaLower.includes('energi') || areaLower.includes('mitokondri')) {
      return 'from-yellow-50/80 to-yellow-100/40';
    } else if (areaLower.includes('hormon')) {
      return 'from-purple-50/80 to-purple-100/40';
    } else if (areaLower.includes('immun')) {
      return 'from-indigo-50/80 to-indigo-100/40';
    } else if (areaLower.includes('hud') || areaLower.includes('bindevev')) {
      return 'from-orange-50/80 to-orange-100/40';
    } else if (areaLower.includes('avgiftning') || areaLower.includes('lever')) {
      return 'from-emerald-50/80 to-emerald-100/40';
    } else if (areaLower.includes('psykisk')) {
      return 'from-sky-50/80 to-sky-100/40';
    } else {
      return 'from-gray-50/80 to-gray-100/40';
    }
  };
  
  // Animation variants
  const cardVariants = {
    collapsed: { 
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    expanded: { 
      height: 'auto',
      transition: { duration: 0.5, ease: 'easeInOut' }
    }
  };
  
  const contentVariants = {
    collapsed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    },
    expanded: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.5, delay: 0.1 }
    }
  };
  
  return (
    <motion.div 
      className={cn(
        "bg-gradient-to-br rounded-xl overflow-hidden shadow-sm border border-white/40",
        getBgGradient(area),
        "backdrop-blur-sm"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      variants={cardVariants}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      layout
    >
      <div className="p-4">
        {/* Header section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1.5 rounded-full shadow-sm">
              <SystemIcon name={area} />
            </div>
            <h3 className="font-medium text-gray-800">{area}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Skjul detaljer om ${area}` : `Vis detaljer om ${area}`}
          >
            <ChevronDown 
              className={cn(
                "h-4 w-4 text-gray-500 transition-transform", 
                isExpanded && "rotate-180"
              )} 
            />
          </Button>
        </div>
        
        {/* Main content - always visible */}
        <div className="mb-2">
          <p className="text-sm text-gray-600">{symptoms}</p>
        </div>
        
        {/* Expandable content */}
        <motion.div 
          className="overflow-hidden"
          variants={contentVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
        >
          <div className="pt-3 border-t border-gray-100/40 mt-2 space-y-3">
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Mulige årsaker:</h4>
              <p className="text-sm text-gray-600">{causes}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Anbefalte tiltak:</h4>
              <div className="p-2 bg-white/50 rounded-lg border border-gray-100/40 shadow-sm">
                <p className="text-sm text-gray-600">{recommendations}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HealthSystemCard;
