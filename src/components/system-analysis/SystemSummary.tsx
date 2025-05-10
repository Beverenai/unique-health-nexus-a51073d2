
import React, { useState } from 'react';
import { ScannerComponent } from '@/types/supabase';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SystemItem from './SystemItem';
import SystemChart from './SystemChart';
import { calculateSystemLoads, getSystemAverages } from './utils';
import { itemVariants } from './animation';

interface SystemSummaryProps {
  components: ScannerComponent[];
}

export const SystemSummary: React.FC<SystemSummaryProps> = ({ components }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate system loads and averages
  const systemLoads = calculateSystemLoads(components);
  const systemAverages = getSystemAverages(systemLoads);
  
  // Get the visible systems based on expanded state
  const visibleSystems = expanded ? systemAverages : systemAverages.slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {systemAverages.length > 0 ? (
        <motion.div 
          className="col-span-1 md:col-span-2"
          variants={itemVariants}
        >
          <div className="space-y-3">
            {visibleSystems.map((system, index) => (
              <motion.div 
                key={system.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
              >
                <SystemItem 
                  name={system.name} 
                  value={system.value} 
                  expanded={true}
                />
              </motion.div>
            ))}
            
            {systemAverages.length > 3 && (
              <motion.div 
                whileTap={{ scale: 0.97 }}
                variants={itemVariants}
              >
                <Button
                  variant="ghost" 
                  onClick={() => setExpanded(!expanded)}
                  className="w-full text-sm flex items-center gap-2 justify-center text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#9b87f5]/5 transition-colors"
                >
                  {expanded ? (
                    <>Vis færre systemer</>
                  ) : (
                    <>
                      <PlusCircle size={14} />
                      Vis alle {systemAverages.length} systemer
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <p className="text-gray-500 italic">Ingen systembelastning over terskelen ble funnet.</p>
      )}
      
      {systemAverages.length > 0 && (
        <motion.div 
          className="col-span-1 flex items-center justify-center"
          variants={itemVariants}
        >
          <SystemChart data={systemAverages.slice(0, 5)} />
        </motion.div>
      )}
    </div>
  );
};
