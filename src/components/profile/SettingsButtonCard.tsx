
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

const SettingsButtonCard: React.FC = () => {
  const { trigger } = useHapticFeedback();

  return (
    <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
      <CardContent className="p-0">
        <Button 
          variant="ghost" 
          className="w-full flex justify-between items-center p-4 h-auto"
          onClick={() => {
            trigger('light');
            toast.info('Innstillinger ville åpnes her');
          }}
          hapticPattern="light"
        >
          <div className="flex items-center">
            <Settings size={20} className="text-gray-500 mr-3" />
            <span className="text-left font-medium">Innstillinger</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SettingsButtonCard;
