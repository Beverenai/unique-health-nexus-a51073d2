
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { toast } from 'sonner';

interface AuthActionsProps {
  isDemo: boolean;
}

const AuthActions: React.FC<AuthActionsProps> = ({ isDemo }) => {
  const { trigger } = useHapticFeedback();

  const handleLogout = async () => {
    try {
      trigger('heavy');
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      trigger('error');
      toast.error('Det oppsto en feil ved utlogging');
    }
  };

  const handleLogin = async () => {
    try {
      trigger('medium');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
      trigger('error');
      toast.error('Det oppsto en feil ved innlogging');
    }
  };

  return (
    <div className="text-center mb-10">
      {isDemo ? (
        <Button 
          onClick={handleLogin} 
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          hapticPattern="medium"
        >
          Logg inn med Google
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleLogout}
          hapticPattern="heavy"
        >
          Logg ut
        </Button>
      )}
    </div>
  );
};

export default AuthActions;
