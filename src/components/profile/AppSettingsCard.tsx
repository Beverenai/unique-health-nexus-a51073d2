
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

const AppSettingsCard: React.FC = () => {
  const { isEnabled, toggleHapticFeedback, trigger } = useHapticFeedback();

  const handleToggleHaptic = () => {
    toggleHapticFeedback();
    toast.success(
      isEnabled ? 'Haptisk tilbakemelding deaktivert' : 'Haptisk tilbakemelding aktivert',
      { duration: 2000 }
    );
  };

  return (
    <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">App-innstillinger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Haptic feedback toggle */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Haptisk tilbakemelding</p>
                <p className="text-xs text-gray-500">
                  {isEnabled ? 'Aktivert - Du vil føle vibrasjon ved interaksjon' : 'Deaktivert - Ingen vibrasjon ved interaksjon'}
                </p>
              </div>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleHaptic}
            />
          </div>
          
          {/* Notification Settings - placeholder for future implementation */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Varsler</p>
                <p className="text-xs text-gray-500">
                  Administrer push-varsler og påminnelser
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8"
              onClick={() => {
                trigger('light');
                toast.info('Varslingsinnstillinger vil åpnes her');
              }}
            >
              Konfigurer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppSettingsCard;
