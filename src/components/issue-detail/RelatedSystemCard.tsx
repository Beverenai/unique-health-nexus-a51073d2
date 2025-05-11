
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SystemIcon from '@/components/health/SystemIcon';
import { HealthSystemItem } from '@/services/healthSystemService';

interface RelatedSystemCardProps {
  system: HealthSystemItem;
  impactLevel: 'high' | 'medium' | 'low';
}

const RelatedSystemCard: React.FC<RelatedSystemCardProps> = ({ system, impactLevel }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getImpactColor = () => {
    switch (impactLevel) {
      case 'high':
        return 'from-red-50 to-red-100/40 border-red-100';
      case 'medium':
        return 'from-amber-50 to-amber-100/40 border-amber-100';
      case 'low':
        return 'from-green-50 to-green-100/40 border-green-100';
      default:
        return 'from-gray-50 to-gray-100/40 border-gray-100';
    }
  };
  
  const getImpactBadgeStyles = () => {
    switch (impactLevel) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getImpactText = () => {
    switch (impactLevel) {
      case 'high':
        return 'Sterk sammenheng';
      case 'medium':
        return 'Moderat sammenheng';
      case 'low':
        return 'Svak sammenheng';
      default:
        return 'Ukjent sammenheng';
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden border bg-gradient-to-br shadow-sm",
        getImpactColor()
      )}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <SystemIcon name={system.area} size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{system.area}</h3>
                <div className={cn("text-xs px-2 py-0.5 rounded-full inline-block mt-1", getImpactBadgeStyles())}>
                  {getImpactText()}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => setExpanded(!expanded)}
            >
              <ChevronDown 
                className={cn(
                  "h-5 w-5 text-gray-500 transition-transform",
                  expanded && "rotate-180"
                )}
              />
            </Button>
          </div>
          
          <div className="mt-2 line-clamp-2 text-sm text-gray-600">
            {system.symptoms}
          </div>
        </div>
        
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="border-t border-gray-100/60 bg-white/60 p-4 space-y-4">
            <div>
              <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Mulige årsaker</h4>
              <p className="text-sm text-gray-700">{system.causes}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Anbefalinger</h4>
              <p className="text-sm text-gray-700">{system.recommendations}</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default RelatedSystemCard;
