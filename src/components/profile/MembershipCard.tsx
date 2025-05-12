
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { motion } from 'framer-motion';

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
    <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">Medlemskap</CardTitle>
          {isPremium && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <div className="bg-[#9b87f5]/10 p-1 rounded-full">
                <Crown size={16} className="text-[#9b87f5]" />
              </div>
            </motion.div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{isPremium ? 'Unique+' : 'Gratis plan'}</p>
              {isPremium && (
                <Badge className="bg-[#9b87f5]/10 text-[#9b87f5] border-none">
                  Aktiv
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {isPremium 
                ? 'Du har tilgang til alle premium-funksjoner' 
                : 'Oppgrader for å få tilgang til alle funksjoner'}
            </p>
          </div>
          {!isPremium && (
            <Button 
              onClick={handleUpgrade}
              hapticPattern="success"
              className="bg-[#9b87f5] hover:bg-[#8a73e8] text-white"
            >
              Oppgrader
            </Button>
          )}
        </div>
        
        {isPremium && (
          <motion.div 
            className="mt-3 bg-[#9b87f5]/5 rounded-lg p-3 text-xs text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p>
              Denne visningen er kun tilgjengelig for Unique+ medlemmer. 
              Du har tilgang til avansert analyse, spesialistanbefalinger og detaljerte innsikter.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

// Add the missing Badge import
import { Badge } from '@/components/ui/badge';

export default MembershipCard;
