
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Smile, Zap, Moon } from 'lucide-react';
import { HealthCheckIn } from '@/types/database';

interface TrendResult {
  trend: number;
  description: string;
}

interface InsightsSectionProps {
  checkIns: HealthCheckIn[];
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ checkIns }) => {
  const getTrend = (metric: 'mood' | 'energy_level' | 'sleep_quality') => {
    if (checkIns.length < 2) return { trend: 0, description: 'Nøytral' };
    
    const latest = checkIns[0][metric];
    const previous = checkIns[1][metric];
    const difference = latest - previous;
    
    if (difference > 0) return { trend: 1, description: 'Økende' };
    if (difference < 0) return { trend: -1, description: 'Synkende' };
    return { trend: 0, description: 'Stabil' };
  };
  
  const moodTrend = getTrend('mood');
  const energyTrend = getTrend('energy_level');
  const sleepTrend = getTrend('sleep_quality');
  
  return (
    <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center">
          <Activity size={18} className="mr-2 text-[#9b87f5]" />
          <span>Innsikter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center">
              <Smile size={18} className="mr-2 text-[#9b87f5]" />
              <span className="font-medium">Humør</span>
            </div>
            <div className="flex items-center">
              {moodTrend.trend > 0 && <span className="text-green-500">↑</span>}
              {moodTrend.trend < 0 && <span className="text-red-500">↓</span>}
              <span className="ml-1 text-sm">{moodTrend.description}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center">
              <Zap size={18} className="mr-2 text-amber-500" />
              <span className="font-medium">Energi</span>
            </div>
            <div className="flex items-center">
              {energyTrend.trend > 0 && <span className="text-green-500">↑</span>}
              {energyTrend.trend < 0 && <span className="text-red-500">↓</span>}
              <span className="ml-1 text-sm">{energyTrend.description}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Moon size={18} className="mr-2 text-blue-500" />
              <span className="font-medium">Søvn</span>
            </div>
            <div className="flex items-center">
              {sleepTrend.trend > 0 && <span className="text-green-500">↑</span>}
              {sleepTrend.trend < 0 && <span className="text-red-500">↓</span>}
              <span className="ml-1 text-sm">{sleepTrend.description}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsSection;
