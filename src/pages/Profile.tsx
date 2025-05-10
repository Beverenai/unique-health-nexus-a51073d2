
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Profile as ProfileType } from '@/types/supabase';
import { Scan, Settings, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Create a demo profile for non-authenticated users
          setProfile({
            id: '00000000-0000-0000-0000-000000000000',
            first_name: 'Demo',
            last_name: 'Bruker',
            email: 'demo@example.com',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          setIsDemo(true);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        
        // For demo purposes - randomly assign premium status
        setIsPremium(Math.random() > 0.5);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleNewScan = () => {
    toast.success('Starter ny skanning...', {
      description: 'Dette ville starte en ny skanning i en reell applikasjon.'
    });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Det oppsto en feil ved utlogging');
    }
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Det oppsto en feil ved innlogging');
    }
  };

  const handleUpgrade = () => {
    toast.success('Takk! Du er nå oppgradert til Unique+');
    setIsPremium(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laster profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Min Profil</h1>
        <p className="text-gray-500">
          {isDemo ? 'Demo-modus' : 'Administrer din konto og innstillinger'}
        </p>
      </header>

      <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-xl">
              {profile?.first_name ? profile.first_name[0] : ''}
              {profile?.last_name ? profile.last_name[0] : ''}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-medium">
                {profile?.first_name} {profile?.last_name}
                {isDemo && <span className="ml-2 text-sm text-gray-500">(Demo)</span>}
              </h2>
              <p className="text-gray-500">{profile?.email}</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Alder</p>
              <p className="font-medium">35 år</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Høyde</p>
              <p className="font-medium">175 cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vekt</p>
              <p className="font-medium">70 kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Medlem siden</p>
              <p className="font-medium">Mars 2023</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Management Card */}
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
              >
                <Scan size={16} className="mr-2" />
                Start ny skanning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Medlemskap</CardTitle>
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
              <Button onClick={handleUpgrade}>
                Oppgrader
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings button card */}
      <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
        <CardContent className="p-0">
          <Button 
            variant="ghost" 
            className="w-full flex justify-between items-center p-4 h-auto"
            onClick={() => toast.info('Innstillinger ville åpnes her')}
          >
            <div className="flex items-center">
              <Settings size={20} className="text-gray-500 mr-3" />
              <span className="text-left font-medium">Innstillinger</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </Button>
        </CardContent>
      </Card>

      <div className="text-center mb-10">
        {isDemo ? (
          <Button onClick={handleLogin} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
            Logg inn med Google
          </Button>
        ) : (
          <Button variant="outline" onClick={handleLogout}>
            Logg ut
          </Button>
        )}
      </div>
    </div>
  );
};

export default Profile;
