
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Checkin } from '@/hooks/useDashboardData';

interface LatestCheckinCardProps {
  latestCheckin: Checkin | null;
}

const LatestCheckinCard: React.FC<LatestCheckinCardProps> = ({ latestCheckin }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
      <CardHeader>
        <CardTitle>Siste dagslogg</CardTitle>
        <CardDescription>Siste registrerte dagslogg.</CardDescription>
      </CardHeader>
      <CardContent>
        {latestCheckin ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Humør:</span>
              <span className="text-sm">{latestCheckin.mood}/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Energi:</span>
              <span className="text-sm">{latestCheckin.energy_level}/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Søvn:</span>
              <span className="text-sm">{latestCheckin.sleep_quality}/10</span>
            </div>
            <Button 
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/daily-report')}
            >
              Se full rapport
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            Ingen dagslogger registrert ennå.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestCheckinCard;
