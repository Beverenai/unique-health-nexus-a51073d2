
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import LeafyGreen from './LeafyGreen';
import Flask from './Flask';
import { IssueRecommendation, HealthIssue } from '@/types/supabase';

interface RecommendationsTabProps {
  recommendations: IssueRecommendation[];
  issue: HealthIssue;
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ recommendations, issue }) => {
  return (
    <div className="space-y-4">
      <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded-full">
              <LeafyGreen size={16} className="text-green-600" />
            </div>
            <h3 className="font-medium">Kosthold</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <p className="text-gray-700">{issue.specific_advice?.diet || (recommendations[0]?.recommendation || "Ingen spesifikke kostholdsanbefalinger tilgjengelig.")}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-full">
              <Activity size={16} className="text-blue-600" />
            </div>
            <h3 className="font-medium">Livsstil</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <p className="text-gray-700">{issue.specific_advice?.lifestyle || (recommendations[1]?.recommendation || "Ingen spesifikke livsstilsanbefalinger tilgjengelig.")}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-full">
              <Flask size={16} className="text-amber-600" />
            </div>
            <h3 className="font-medium">Tilskudd</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <p className="text-gray-700">{issue.specific_advice?.supplements || (recommendations[2]?.recommendation || "Ingen spesifikke tilskuddsanbefalinger tilgjengelig.")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsTab;
