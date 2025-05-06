
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import NavigationBar from '@/components/NavigationBar';
import ChatButton from '@/components/ChatButton';
import { Profile as ProfileType } from '@/types/supabase';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laster profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-20 pt-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Min Profil</h1>
        <p className="text-gray-500">
          {isDemo ? 'Demo-modus' : 'Administrer din konto og innstillinger'}
        </p>
      </header>

      <Card className="mb-8">
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Medlemskap</CardTitle>
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Varsler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daglige påminnelser</p>
                <p className="text-sm text-gray-500">Motta daglige påminnelser om helseanbefalinger</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <span className="absolute h-4 w-4 transform rounded-full bg-white transition ml-1"></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ukentlig rapport</p>
                <p className="text-sm text-gray-500">Motta en ukentlig sammendrag av din helsestatus</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                <span className="absolute h-4 w-4 transform rounded-full bg-white transition ml-6"></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        {isDemo ? (
          <Button onClick={handleLogin}>
            Logg inn med Google
          </Button>
        ) : (
          <Button variant="outline" onClick={handleLogout}>
            Logg ut
          </Button>
        )}
      </div>

      <ChatButton />
      <NavigationBar />
    </div>
  );
};

export default Profile;
