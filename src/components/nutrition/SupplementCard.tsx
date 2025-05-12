
import React from 'react';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Info } from 'lucide-react';
import { CustomTooltip } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

export interface Supplement {
  id: string;
  name: string;
  category: string;
  benefits: string[];
  dosage: string;
  description?: string;
  warning?: string;
  imageUrl?: string;
}

interface SupplementCardProps {
  supplement: Supplement;
  reason?: string;
}

const SupplementCard: React.FC<SupplementCardProps> = ({ supplement, reason }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden border-white/20 backdrop-blur-sm">
        <div className="flex items-start p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-800">{supplement.name}</h3>
              {reason && (
                <CustomTooltip content={reason}>
                  <Info size={14} className="text-gray-400 cursor-help" />
                </CustomTooltip>
              )}
            </div>
            
            {supplement.description && (
              <CardDescription className="mt-1 text-sm text-gray-500">
                {supplement.description}
              </CardDescription>
            )}
            
            <div className="mt-2">
              <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                {supplement.dosage}
              </Badge>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1.5">
              {supplement.benefits.map((benefit, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {benefit}
                </Badge>
              ))}
            </div>
            
            {supplement.warning && (
              <div className="mt-2 text-xs text-amber-600">
                <strong>Advarsel:</strong> {supplement.warning}
              </div>
            )}
          </div>
          
          {supplement.imageUrl && (
            <div className="ml-3 h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
              {supplement.imageUrl ? (
                <img 
                  src={supplement.imageUrl} 
                  alt={supplement.name}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Sparkles size={24} className="text-purple-300" />
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default SupplementCard;
