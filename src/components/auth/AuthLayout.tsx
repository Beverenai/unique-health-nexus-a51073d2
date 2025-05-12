
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { updateStatusBarColor } = useTheme();
  const location = useLocation();

  useEffect(() => {
    // Always ensure white status bar for auth pages
    updateStatusBarColor('#FFFFFF');
  }, [location.pathname, updateStatusBarColor]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-[#F8F8FC]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Unique Balance</h1>
          <p className="text-gray-600">Din personlige helseassistent</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
