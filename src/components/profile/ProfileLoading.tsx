
import React from 'react';

const ProfileLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Laster profil...</p>
      </div>
    </div>
  );
};

export default ProfileLoading;
