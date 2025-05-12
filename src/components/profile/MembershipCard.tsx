
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface MembershipCardProps {
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ isPremium, setIsPremium }) => {
  const { trigger } = useHapticFeedback();

  const handleUpgrade = () => {
    trigger('success');
    toast.success('Takk! Du er nå oppgradert til Unique+');
    setIsPremium(true);
  };

  return (
    <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">Medlemskap</CardTitle>
          {isPremium && (
            <img 
              src="/lovable-uploads/7f3db508-ef1a-4c8f-8163-91404c131e30.png" 
              alt="Unique+" 
              className="h-6 w-6" 
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{isPremium ? 'Unique+' : 'Gratis plan'}</p>
            <p className="text-sm text-gray-500">
              {isPremium 
                ? 'Du har tilgang til alle premium-funksjoner' 
                : 'Oppgrader for å få tilgang til alle funksjoner'}
            </p>
          </div>
          {!isPremium && (
            <Button 
              onClick={handleUpgrade}
              hapticPattern="success"
            >
              Oppgrader
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
