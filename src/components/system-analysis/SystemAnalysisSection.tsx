
import React, { useState } from 'react';
import { ScannerComponent } from '@/types/supabase';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Motion, Variants, motion } from 'framer-motion';
import { Layers, PlusCircle, Stethoscope } from 'lucide-react';
import { calculateSystemLoads, getSystemAverages } from './utils';
import SystemItem from './SystemItem';
import SystemChart from './SystemChart';
import SystemRelations from './SystemRelations';
import { Button } from '@/components/ui/button';

interface SystemAnalysisSectionProps {
  components: ScannerComponent[];
}

const SystemAnalysisSection: React.FC<SystemAnalysisSectionProps> = ({ components }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate system loads and averages
  const systemLoads = calculateSystemLoads(components);
  const systemAverages = getSystemAverages(systemLoads);
  
  // Get the top systems
  const visibleSystems = expanded ? systemAverages : systemAverages.slice(0, 3);
  const topSystem = systemAverages[0]?.name || 'Nervesystem';
  const secondSystem = systemAverages.length > 1 ? systemAverages[1]?.name : 'Fordøyelsessystem';
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-0">
          <motion.div 
            className="flex items-center gap-2"
            variants={itemVariants}
          >
            <div className="bg-[#9b87f5]/10 p-2 rounded-full">
              <Stethoscope size={20} className="text-[#9b87f5]" />
            </div>
            <h2 className="text-lg font-medium">Systemanalyse</h2>
          </motion.div>
        </CardHeader>
        <CardContent className="pt-3">
          <motion.p 
            className="text-gray-700 mb-4 text-sm"
            variants={itemVariants}
          >
            Nedenfor ser du kroppslige systemer som viser tegn på belastning, basert på den siste skanningen din:
          </motion.p>
          
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
          
          {systemAverages.length > 0 && (
            <motion.div variants={itemVariants}>
              <SystemRelations 
                topSystem={topSystem} 
                secondSystem={secondSystem} 
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemAnalysisSection;
