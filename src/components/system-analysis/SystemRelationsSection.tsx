
import React from 'react';
import { ScannerComponent } from '@/types/supabase';
import { motion } from 'framer-motion';
import SystemRelations from './SystemRelations';
import { calculateSystemLoads, getSystemAverages } from './utils';
import { itemVariants } from './animation';

interface SystemRelationsSectionProps {
  components: ScannerComponent[];
}

export const SystemRelationsSection: React.FC<SystemRelationsSectionProps> = ({ components }) => {
  // Calculate system loads and averages
  const systemLoads = calculateSystemLoads(components);
  const systemAverages = getSystemAverages(systemLoads);
  
  // Get the top systems
  const topSystem = systemAverages[0]?.name || 'Nervesystem';
  const secondSystem = systemAverages.length > 1 ? systemAverages[1]?.name : 'Fordøyelsessystem';
  
  if (systemAverages.length === 0) {
    return null;
  }
  
  return (
    <motion.div variants={itemVariants}>
      <SystemRelations 
        topSystem={topSystem} 
        secondSystem={secondSystem} 
      />
    </motion.div>
  );
};
