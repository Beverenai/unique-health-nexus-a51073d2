
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Heart, Sparkles } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Recommendation } from '@/hooks/useDashboardData';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendationsCardProps {
  recommendations: Recommendation[];
  onComplete: (id: string) => Promise<void>;
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations, onComplete }) => {
  const getPriorityIcon = (priority: string): LucideIcon => {
    switch (priority) {
      case 'high':
        return Flame;
      case 'medium':
        return Heart;
      case 'low':
      default:
        return Sparkles;
    }
  };
  
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-amber-500 bg-amber-50';
      case 'low':
      default:
        return 'text-green-500 bg-green-50';
    }
  };
  
  return (
    <div className="space-y-4">
      {recommendations.length > 0 ? (
        <ScrollArea className="h-[250px] w-full pr-3">
          <div className="space-y-3">
            {recommendations.map((rec, index) => {
              const PriorityIcon = getPriorityIcon(rec.priority);
              const priorityColor = getPriorityColor(rec.priority);
              
              return (
                <motion.div 
                  key={rec.id} 
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 relative overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Priority indicator */}
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ 
                    backgroundColor: rec.priority === 'high' 
                      ? '#EA384C' 
                      : rec.priority === 'medium' 
                        ? '#F7D154' 
                        : '#77C17E' 
                  }}></div>
                  
                  <div className="ml-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`rounded-full px-2 py-0.5 text-xs ${priorityColor} inline-flex items-center gap-1`}>
                        <PriorityIcon className="h-3 w-3" />
                        <span>
                          {rec.priority === 'high' ? 'Høy prioritet' : 
                           rec.priority === 'medium' ? 'Medium prioritet' :
                           'Lav prioritet'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm mb-3">{rec.text}</p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs bg-white hover:bg-gray-50"
                        onClick={() => onComplete(rec.id)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Fullfør
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Ingen anbefalinger for øyeblikket!</p>
          <p className="text-gray-400 text-sm mt-1">Gjennomfør en ny helsesjekk for å få anbefalinger.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsCard;
