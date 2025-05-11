
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan } from 'lucide-react';
import { toast } from 'sonner';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface ScanManagementCardProps {
  isPremium: boolean;
}

const ScanManagementCard: React.FC<ScanManagementCardProps> = ({ isPremium }) => {
  const { trigger } = useHapticFeedback();

  const handleNewScan = () => {
    trigger('impact');
    toast.success('Starter ny skanning...', {
      description: 'Dette ville starte en ny skanning i en reell applikasjon.'
    });
  };

  return (
    <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Helseanalyse</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="font-medium">Sist gjennomført skanning</p>
            <p className="text-sm text-gray-500">25. april 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {isPremium ? 'Du kan gjennomføre en ny skanning når du ønsker det.' : 
              'Du har 1 gjenstående skanning denne måneden.'}
            </p>
            <Button 
              onClick={handleNewScan} 
              className="mt-2 bg-[#9b87f5] hover:bg-[#7E69AB] w-full"
              hapticPattern="impact"
            >
              <Scan size={16} className="mr-2" />
              Start ny skanning
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanManagementCard;
