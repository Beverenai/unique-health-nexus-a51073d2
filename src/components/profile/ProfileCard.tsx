
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Profile } from '@/types/supabase';

interface ProfileCardProps {
  profile: Profile | null;
  isDemo: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isDemo }) => {
  return (
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
  );
};

export default ProfileCard;
