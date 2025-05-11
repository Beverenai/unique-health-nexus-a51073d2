
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile as ProfileType } from '@/types/supabase';

// Import refactored components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileCard from '@/components/profile/ProfileCard';
import ScanManagementCard from '@/components/profile/ScanManagementCard';
import MembershipCard from '@/components/profile/MembershipCard';
import AppSettingsCard from '@/components/profile/AppSettingsCard';
import SettingsButtonCard from '@/components/profile/SettingsButtonCard';
import AuthActions from '@/components/profile/AuthActions';
import ProfileLoading from '@/components/profile/ProfileLoading';

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

  if (loading) {
    return <ProfileLoading />;
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-10">
      <ProfileHeader profile={profile} isDemo={isDemo} />
      <ProfileCard profile={profile} isDemo={isDemo} />
      <ScanManagementCard isPremium={isPremium} />
      <MembershipCard isPremium={isPremium} setIsPremium={setIsPremium} />
      <AppSettingsCard />
      <SettingsButtonCard />
      <AuthActions isDemo={isDemo} />
    </div>
  );
};

export default Profile;
