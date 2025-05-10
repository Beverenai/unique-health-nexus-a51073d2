
import React from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ScanDateCardProps {
  scanDate: Date;
}

const ScanDateCard: React.FC<ScanDateCardProps> = ({ scanDate }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-6 bg-white border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="text-blue-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Siste skanning</p>
              <p className="font-medium text-gray-800">
                {format(scanDate, 'd. MMMM yyyy', { locale: nb })}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:bg-blue-50" 
            onClick={() => navigate('/history')}
          >
            <span className="text-sm">Historikk</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanDateCard;
