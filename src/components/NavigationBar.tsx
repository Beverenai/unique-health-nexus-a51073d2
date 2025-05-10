
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 py-3 px-6 flex justify-around items-center z-40 shadow-sm">
      <Link 
        to="/" 
        className={cn(
          "flex flex-col items-center p-2 rounded-lg transition-colors",
          isActive('/') ? "text-[#9b87f5]" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <Home size={22} />
        <span className="text-xs mt-1 font-medium">Hjem</span>
      </Link>
      
      <Link 
        to="/history" 
        className={cn(
          "flex flex-col items-center p-2 rounded-lg transition-colors",
          isActive('/history') ? "text-[#9b87f5]" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <History size={22} />
        <span className="text-xs mt-1 font-medium">Historikk</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={cn(
          "flex flex-col items-center p-2 rounded-lg transition-colors",
          isActive('/profile') ? "text-[#9b87f5]" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <User size={22} />
        <span className="text-xs mt-1 font-medium">Profil</span>
      </Link>
    </div>
  );
};

export default NavigationBar;
