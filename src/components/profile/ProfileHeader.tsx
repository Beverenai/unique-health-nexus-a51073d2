
import React from 'react';
import { Profile } from '@/types/supabase';

interface ProfileHeaderProps {
  profile: Profile | null;
  isDemo: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isDemo }) => {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold">Min Profil</h1>
      <p className="text-gray-500">
        {isDemo ? 'Demo-modus' : 'Administrer din konto og innstillinger'}
      </p>
    </header>
  );
};

export default ProfileHeader;
