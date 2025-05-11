
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import SystemIcon from './SystemIcon';
import { HealthSystemItem } from '@/services/healthSystemService';
import { SYSTEM_CATEGORIES, groupSystemsByCategory } from './SystemCategories';
import { Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HealthSystemGridProps {
  title?: string;
  description?: string;
  healthData: HealthSystemItem[];
}

const HealthSystemGrid: React.FC<HealthSystemGridProps> = ({
  title = "Kroppssystemer",
  description = "Trykk på en kategori for å se systemene innen denne kategorien",
  healthData
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const categorizedSystems = groupSystemsByCategory(healthData);
  
  // Get background color for category
  const getCategoryGradient = (category: string): string => {
    switch(category) {
      case SYSTEM_CATEGORIES.DIGESTIVE:
        return 'from-green-50 to-green-100/50';
      case SYSTEM_CATEGORIES.NERVOUS:
        return 'from-blue-50 to-blue-100/50';
      case SYSTEM_CATEGORIES.HORMONAL:
        return 'from-purple-50 to-purple-100/50';
      case SYSTEM_CATEGORIES.MUSCULOSKELETAL:
        return 'from-amber-50 to-amber-100/50';
      case SYSTEM_CATEGORIES.IMMUNE:
        return 'from-rose-50 to-rose-100/50';
      default:
        return 'from-gray-50 to-gray-100/50';
    }
  };
  
  const handleCategoryClick = (index: number) => {
    navigate(`/health-system/${index}`);
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
    <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium`}>{title}</h2>
            <div className="bg-[#9b87f5]/10 rounded-full p-1">
              <Info size={isMobile ? 14 : 16} className="text-[#9b87f5]" />
            </div>
          </div>
          {description && (
            <p className="text-gray-500 text-xs sm:text-sm">{description}</p>
          )}
        </div>
        
        <motion.div 
          className="grid grid-cols-2 gap-2 sm:gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(categorizedSystems).map(([category, systems], index) => (
            <motion.div 
              key={`${category}-${index}`}
              variants={itemVariants}
              whileHover={{ scale: isMobile ? 1.02 : 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(index)}
              className={`bg-gradient-to-br ${getCategoryGradient(category)} rounded-xl ${isMobile ? 'p-3' : 'p-4'} border border-white/40 shadow-sm cursor-pointer transition-all hover:shadow-md flex flex-col items-center text-center`}
            >
              <div className={`bg-white/80 ${isMobile ? 'p-2' : 'p-2.5'} rounded-full shadow-sm mb-2`}>
                <SystemIcon name={category} size={isMobile ? 20 : 24} />
              </div>
              <h3 className="font-medium text-xs sm:text-sm text-gray-800 break-words">
                {category}
              </h3>
              <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 mt-0.5 sm:mt-1`}>
                {systems.length} systemer
              </p>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default HealthSystemGrid;
