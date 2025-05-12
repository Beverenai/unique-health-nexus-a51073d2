
import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from 'react-router-dom';

export const StatusBar: React.FC = () => {
  const { updateStatusBarColor } = useTheme();
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/insights') {
      updateStatusBarColor('#9b87f5');
    } else {
      updateStatusBarColor('#FFFFFF');
    }
  }, [location.pathname, updateStatusBarColor]);
  
  return null; // This is a utility component with no visual rendering
};

export default StatusBar;
