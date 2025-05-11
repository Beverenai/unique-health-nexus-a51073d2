
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Flame, Heart, Sparkles } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Recommendation } from '@/hooks/useDashboardData';
import { LucideIcon } from 'lucide-react';

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
  
  return (
    <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
      <CardHeader>
        <CardTitle>Dagens anbefalinger</CardTitle>
        <CardDescription>Her er dine anbefalinger for i dag.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border">
          <div className="space-y-3 p-3">
            {recommendations.length > 0 ? (
              recommendations.map(rec => (
                <div key={rec.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {React.createElement(getPriorityIcon(rec.priority), { className: "mr-2 h-4 w-4 text-gray-500" })}
                    <span className="text-sm">{rec.text}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onComplete(rec.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                Ingen anbefalinger for i dag!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
