
import React from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Calendar, ChevronRight, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ScanDateCardProps {
  scanDate: Date;
}

const ScanDateCard: React.FC<ScanDateCardProps> = ({ scanDate }) => {
  const navigate = useNavigate();
  
  const handleNewScan = () => {
    toast.success('Starter ny skanning...', {
      description: 'Dette ville starte en ny skanning i en reell applikasjon.'
    });
  };
  
  return (
    <div className="mb-6 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#9b87f5]/10 p-2 rounded-full">
              <Calendar className="text-[#9b87f5]" size={18} />
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
            className="text-[#9b87f5] hover:bg-[#9b87f5]/10" 
            onClick={() => navigate('/history')}
          >
            <span className="text-sm">Historikk</span>
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Button 
            onClick={handleNewScan} 
            variant="outline" 
            className="w-full bg-white border-[#9b87f5]/20 text-[#9b87f5] hover:bg-[#9b87f5]/10 hover:text-[#9b87f5]"
            size="sm"
          >
            <Scan size={16} className="mr-2" />
            Ny skanning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanDateCard;
