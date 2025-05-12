
import React from 'react';
import { ScannerComponent } from '@/types/supabase';
import { motion } from 'framer-motion';
import SystemRelations from './SystemRelations';
import { calculateSystemLoads, getSystemAverages } from './utils';
import { itemVariants } from './animation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

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
    <motion.div variants={itemVariants} className="mt-4">
      {systemAverages.length >= 2 ? (
        <SystemRelations 
          topSystem={topSystem} 
          secondSystem={secondSystem} 
        />
      ) : (
        <Alert className="bg-gray-50/70 border-gray-100">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Ikke nok data til å vise systemsammenhenger. Flere systemer må analyseres.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Show additional info about why these connections are important */}
      <motion.div 
        className="mt-2 text-xs text-gray-500 bg-gray-50/50 p-2 rounded-lg"
        variants={itemVariants}
        transition={{ delay: 1.2 }}
      >
        Forstå hvordan ulike kroppssystemer påvirker hverandre er nøkkelen til å bedre din helse.
        Kroppen fungerer som ett helhetlig system, og belastning i ett område kan påvirke andre.
      </motion.div>
    </motion.div>
  );
};
