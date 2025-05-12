
import React from 'react';
import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Heart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlan, PlanRecommendation } from '@/types/database';

interface PlanSummaryCardProps {
  plan: UserPlan;
  recommendations: PlanRecommendation[];
}

const PlanSummaryCard: React.FC<PlanSummaryCardProps> = ({ plan, recommendations }) => {
  const calculateProgress = () => {
    if (recommendations.length === 0) return 0;
    
    const completed = recommendations.filter(rec => rec.completed).length;
    return (completed / recommendations.length) * 100;
  };
  
  const progress = calculateProgress();
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPP', { locale: nb });
  };
  
  return (
    <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Heart size={20} className="mr-2 text-[#9b87f5]" />
          {plan.title}
        </CardTitle>
        <CardDescription className="text-gray-500">
          {plan.description || 'Personlig helseplan basert på din analyse'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Fremdrift:
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Startdato:</span>
              <span className="block text-gray-500">{formatDate(plan.start_date)}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Sluttdato:</span>
              <span className="block text-gray-500">
                {plan.end_date ? formatDate(plan.end_date) : 'Ingen sluttdato'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSummaryCard;
