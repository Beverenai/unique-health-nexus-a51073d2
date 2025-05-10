
import React from 'react';
import { ScannerComponent } from '@/types/supabase';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { SystemSummary } from './SystemSummary';
import { SystemRelationsSection } from './SystemRelationsSection';
import { containerVariants, itemVariants } from './animation';

interface SystemAnalysisSectionProps {
  components: ScannerComponent[];
}

const SystemAnalysisSection: React.FC<SystemAnalysisSectionProps> = ({ components }) => {
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
          
          <SystemSummary components={components} />
          
          <SystemRelationsSection components={components} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemAnalysisSection;
