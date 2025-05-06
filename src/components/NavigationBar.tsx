
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavigationBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-around items-center z-40">
      <Link 
        to="/" 
        className={cn(
          "flex flex-col items-center p-2 rounded-lg transition-colors",
          isActive('/') ? "text-primary" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Hjem</span>
      </Link>
      
      <Link 
        to="/history" 
        className={cn(
          "flex flex-col items-center p-2 rounded-lg transition-colors",
          isActive('/history') ? "text-primary" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <History size={24} />
        <span className="text-xs mt-1">Historikk</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={cn(
          "flex flex-col items-center p-2 rounded-lg transition-colors",
          isActive('/profile') ? "text-primary" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <User size={24} />
        <span className="text-xs mt-1">Profil</span>
      </Link>
    </div>
  );
};

export default NavigationBar;
