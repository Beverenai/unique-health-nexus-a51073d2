
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import SystemIcon from './SystemIcon';
import HealthSystemDialog from './HealthSystemDialog';

interface HealthInfoItem {
  area: string;
  symptoms: string;
  causes: string;
  recommendations: string;
}

interface HealthSystemGridProps {
  title?: string;
  description?: string;
  healthData: HealthInfoItem[];
}

const HealthSystemGrid: React.FC<HealthSystemGridProps> = ({
  title = "Kroppssystemer og balanse",
  description = "Trykk på et system for å se detaljert informasjon",
  healthData
}) => {
  const [selectedSystem, setSelectedSystem] = useState<HealthInfoItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Determine background color based on system type
  const getBgGradient = (area: string): string => {
    const areaLower = area.toLowerCase();
    
    if (areaLower.includes('tarm') || areaLower.includes('fordøyelse')) {
      return 'from-green-50 to-green-100/50';
    } else if (areaLower.includes('lymfe')) {
      return 'from-blue-50 to-blue-100/50';
    } else if (areaLower.includes('nakke') || areaLower.includes('rygg')) {
      return 'from-amber-50 to-amber-100/50';
    } else if (areaLower.includes('oksidativ') || areaLower.includes('stress')) {
      return 'from-rose-50 to-rose-100/50';
    } else if (areaLower.includes('energi') || areaLower.includes('mitokondri')) {
      return 'from-yellow-50 to-yellow-100/50';
    } else if (areaLower.includes('hormon')) {
      return 'from-purple-50 to-purple-100/50';
    } else if (areaLower.includes('immun')) {
      return 'from-indigo-50 to-indigo-100/50';
    } else if (areaLower.includes('hud') || areaLower.includes('bindevev')) {
      return 'from-orange-50 to-orange-100/50';
    } else if (areaLower.includes('avgiftning') || areaLower.includes('lever')) {
      return 'from-emerald-50 to-emerald-100/50';
    } else if (areaLower.includes('psykisk')) {
      return 'from-sky-50 to-sky-100/50';
    } else {
      return 'from-gray-50 to-gray-100/50';
    }
  };
  
  const handleCardClick = (system: HealthInfoItem) => {
    setSelectedSystem(system);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3
      }
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-none shadow-lg mb-8">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-medium mb-1">{title}</h2>
          {description && (
            <p className="text-gray-500 text-sm">{description}</p>
          )}
        </div>
        
        <motion.div 
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {healthData.map((system, index) => (
            <motion.div 
              key={`${system.area}-${index}`}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(system)}
              className={`bg-gradient-to-br ${getBgGradient(system.area)} rounded-xl p-4 border border-white/40 shadow-sm cursor-pointer transition-all hover:shadow-md flex flex-col items-center text-center`}
            >
              <div className="bg-white/80 p-2.5 rounded-full shadow-sm mb-2">
                <SystemIcon name={system.area} size={24} />
              </div>
              <h3 className="font-medium text-sm text-gray-800 break-words">
                {system.area}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
      
      <HealthSystemDialog 
        isOpen={dialogOpen} 
        onClose={handleCloseDialog} 
        healthInfo={selectedSystem} 
      />
    </Card>
  );
};

export default HealthSystemGrid;
