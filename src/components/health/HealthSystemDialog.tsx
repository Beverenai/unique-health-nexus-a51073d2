
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SystemIcon from './SystemIcon';
import { motion } from 'framer-motion';

interface HealthInfoItem {
  area: string;
  symptoms: string;
  causes: string;
  recommendations: string;
}

interface HealthSystemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  healthInfo: HealthInfoItem | null;
}

const HealthSystemDialog: React.FC<HealthSystemDialogProps> = ({ 
  isOpen, 
  onClose, 
  healthInfo 
}) => {
  if (!healthInfo) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <SystemIcon name={healthInfo.area} />
            </div>
            <DialogTitle className="text-xl">{healthInfo.area}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Detaljert informasjon om dette kroppssystemet
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Tegn i kroppen:</h3>
            <p className="text-sm text-gray-600 p-3 bg-gray-50/80 rounded-md">
              {healthInfo.symptoms}
            </p>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Mulige årsaker:</h3>
            <p className="text-sm text-gray-600 p-3 bg-gray-50/80 rounded-md">
              {healthInfo.causes}
            </p>
          </div>
          
          <motion.div 
            className="space-y-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-medium">Anbefalte tiltak:</h3>
            <div className="p-3 bg-white shadow-sm border border-gray-100 rounded-md">
              <p className="text-sm text-gray-600">{healthInfo.recommendations}</p>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HealthSystemDialog;
