
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
  const [expandedSections, setExpandedSections] = useState<{
    causes: boolean;
    recommendations: boolean;
  }>({
    causes: false,
    recommendations: false
  });
  
  const toggleSection = (section: 'causes' | 'recommendations') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
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
  
  const SectionHeader = ({ 
    title, 
    isExpanded, 
    onToggle 
  }: { 
    title: string; 
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <div 
      className="flex items-center justify-between cursor-pointer py-2"
      onClick={onToggle}
    >
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 rounded-full"
      >
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform", 
            isExpanded && "rotate-180"
          )} 
        />
      </Button>
    </div>
  );
  
  return (
    <div 
      className={cn(
        "bg-gradient-to-br rounded-xl border border-white/40 shadow-sm p-5",
        getBgGradient(area),
        "backdrop-blur-sm"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <SystemIcon name={area} size={22} />
        </div>
        <h2 className="font-medium text-lg text-gray-800">{area}</h2>
      </div>
      
      {/* Symptoms - always visible */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Symptomer og tegn:</h3>
        <p className="text-sm text-gray-600 leading-relaxed bg-white/70 p-3 rounded-lg border border-gray-100/40">{symptoms}</p>
      </div>
      
      {/* Causes - expandable */}
      <div className="border-t border-gray-100/40 pt-1">
        <SectionHeader 
          title="Mulige årsaker" 
          isExpanded={expandedSections.causes}
          onToggle={() => toggleSection('causes')}
        />
        
        <motion.div 
          initial={expandedSections.causes ? { height: 'auto' } : { height: 0 }}
          animate={expandedSections.causes ? { height: 'auto' } : { height: 0 }}
          className="overflow-hidden"
        >
          <p className="text-sm text-gray-600 leading-relaxed bg-white/70 p-3 rounded-lg border border-gray-100/40 mb-3">{causes}</p>
        </motion.div>
      </div>
      
      {/* Recommendations - expandable */}
      <div className="border-t border-gray-100/40 pt-1">
        <SectionHeader 
          title="Anbefalte tiltak" 
          isExpanded={expandedSections.recommendations}
          onToggle={() => toggleSection('recommendations')}
        />
        
        <motion.div 
          initial={expandedSections.recommendations ? { height: 'auto' } : { height: 0 }}
          animate={expandedSections.recommendations ? { height: 'auto' } : { height: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-white/70 p-3 rounded-lg border border-gray-100/40">
            <p className="text-sm text-gray-600 leading-relaxed">{recommendations}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthSystemCard;
