
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { HealthCheckIn } from '@/types/database';

interface TodaySummaryProps {
  checkIn: HealthCheckIn;
}

const TodaySummary: React.FC<TodaySummaryProps> = ({ checkIn }) => {
  const getMoodEmoji = (value: number) => {
    if (value >= 8) return '😀';
    if (value >= 6) return '🙂';
    if (value >= 4) return '😐';
    if (value >= 2) return '🙁';
    return '😞';
  };
  
  return (
    <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between">
          <span>Dagens oversikt</span>
          <span className="text-sm font-normal text-gray-500">
            {format(new Date(checkIn.date), 'PPP', { locale: nb })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-[#9b87f5]/5 rounded-lg">
            <div className="text-3xl mb-1">{getMoodEmoji(checkIn.mood)}</div>
            <div className="text-xs font-medium">Humør</div>
            <div className="text-xl font-semibold">{checkIn.mood}/10</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
            <Zap size={24} className="text-amber-500 mb-1" />
            <div className="text-xs font-medium">Energi</div>
            <div className="text-xl font-semibold">{checkIn.energy_level}/10</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
            <Moon size={24} className="text-blue-500 mb-1" />
            <div className="text-xs font-medium">Søvn</div>
            <div className="text-xl font-semibold">{checkIn.sleep_quality}/10</div>
          </div>
        </div>
        
        {checkIn.symptoms && checkIn.symptoms.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Rapporterte symptomer:</h3>
            <div className="flex flex-wrap gap-1">
              {checkIn.symptoms.map((symptom, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {checkIn.notes && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">Noter:</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {checkIn.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySummary;
