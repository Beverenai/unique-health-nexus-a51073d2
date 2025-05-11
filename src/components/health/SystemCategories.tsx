
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthSystemItem } from '@/services/healthSystemService';
import SystemIcon from './SystemIcon';

// Define our categories
export const SYSTEM_CATEGORIES = {
  DIGESTIVE: 'Fordøyelse & Stoffskifte',
  NERVOUS: 'Nervesystem & Hjerne',
  HORMONAL: 'Hormonsystem & Energi',
  MUSCULOSKELETAL: 'Bevegelsesapparat',
  IMMUNE: 'Immunsystem & Avgiftning',
  OTHER: 'Andre systemer',
};

// Function to categorize health systems
export const categorizeSystem = (area: string): string => {
  const lowercasedArea = area.toLowerCase();
  
  if (lowercasedArea.includes('tarm') || 
      lowercasedArea.includes('fordøyelse') || 
      lowercasedArea.includes('lever') || 
      lowercasedArea.includes('mage')) {
    return SYSTEM_CATEGORIES.DIGESTIVE;
  }
  
  if (lowercasedArea.includes('nerve') || 
      lowercasedArea.includes('hjerne') || 
      lowercasedArea.includes('psykisk') || 
      lowercasedArea.includes('kognitiv')) {
    return SYSTEM_CATEGORIES.NERVOUS;
  }
  
  if (lowercasedArea.includes('hormon') || 
      lowercasedArea.includes('energi') || 
      lowercasedArea.includes('mitokondri') || 
      lowercasedArea.includes('stoffskifte')) {
    return SYSTEM_CATEGORIES.HORMONAL;
  }
  
  if (lowercasedArea.includes('muskel') || 
      lowercasedArea.includes('skjelett') || 
      lowercasedArea.includes('nakke') || 
      lowercasedArea.includes('rygg') ||
      lowercasedArea.includes('ledd')) {
    return SYSTEM_CATEGORIES.MUSCULOSKELETAL;
  }
  
  if (lowercasedArea.includes('immun') || 
      lowercasedArea.includes('lymfe') || 
      lowercasedArea.includes('avgift') || 
      lowercasedArea.includes('betennelse') ||
      lowercasedArea.includes('sopp')) {
    return SYSTEM_CATEGORIES.IMMUNE;
  }
  
  return SYSTEM_CATEGORIES.OTHER;
};

// Group health systems by category
export const groupSystemsByCategory = (healthData: HealthSystemItem[]) => {
  const categories: {[key: string]: HealthSystemItem[]} = {};
  
  healthData.forEach(item => {
    const category = categorizeSystem(item.area);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });
  
  return categories;
};

// Get health status color for a category based on systems within
const getCategoryStatusColor = (systems: HealthSystemItem[]): string => {
  // Logic to determine category status (red, yellow, green)
  // This is a placeholder - in a real app, you would calculate this 
  // based on the actual health data
  const color = Math.random() > 0.7 ? 'bg-red-50 text-red-600' : 
               Math.random() > 0.4 ? 'bg-amber-50 text-amber-600' : 
               'bg-green-50 text-green-600';
  return color;
};

interface SystemCategoryProps {
  categoryName: string;
  systems: HealthSystemItem[];
  onSelectSystem: (index: number) => void;
}

const SystemCategory: React.FC<SystemCategoryProps> = ({ 
  categoryName, 
  systems, 
  onSelectSystem 
}) => {
  const [expanded, setExpanded] = useState(false);
  const statusColor = getCategoryStatusColor(systems);
  
  return (
    <div className="mb-3">
      {/* Category header - always visible */}
      <motion.div 
        className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${statusColor.includes('green') ? 'bg-green-50' : statusColor.includes('amber') ? 'bg-amber-50' : 'bg-red-50'}`}>
            <SystemIcon name={categoryName} size={18} />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{categoryName}</h3>
            <p className="text-xs text-gray-500">{systems.length} systemer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
            {statusColor.includes('green') ? 'God balanse' : 
             statusColor.includes('amber') ? 'Lett ubalanse' : 
             'Ubalanse'}
          </span>
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </motion.div>
      
      {/* Systems list - visible when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pl-4 space-y-2 mt-2">
              {systems.map((system, index) => (
                <motion.div
                  key={`${system.area}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/80 rounded-lg p-3 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-1.5 rounded-full shadow-sm">
                        <SystemIcon name={system.area} size={16} />
                      </div>
                      <h4 className="text-sm font-medium text-gray-700">{system.area}</h4>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSelectSystem(index)}
                      className="text-[#9b87f5] text-xs hover:text-[#7E69AB] hover:bg-[#9b87f5]/5"
                    >
                      Se detaljer
                    </Button>
                  </div>
                  
                  {/* Preview of symptoms - just a short excerpt */}
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {system.symptoms.substring(0, 60)}...
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SystemCategoriesProps {
  healthData: HealthSystemItem[];
  onSelectSystem: (index: number) => void;
}

const SystemCategories: React.FC<SystemCategoriesProps> = ({ healthData, onSelectSystem }) => {
  const categorizedSystems = groupSystemsByCategory(healthData);
  
  return (
    <div className="space-y-1">
      <div className="mb-4 px-1">
        <p className="text-sm text-gray-600">
          Her er en oversikt over dine kroppssystemer, gruppert etter funksjon. 
          Trykk på en kategori for å se systemene, og deretter på "Se detaljer" for mer informasjon.
        </p>
      </div>
      
      {Object.entries(categorizedSystems).map(([category, systems]) => (
        <SystemCategory
          key={category}
          categoryName={category}
          systems={systems}
          onSelectSystem={onSelectSystem}
        />
      ))}
    </div>
  );
};

export default SystemCategories;
