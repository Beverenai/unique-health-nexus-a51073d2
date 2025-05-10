
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Calendar, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavigationHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-medium text-[#9b87f5]">Unique</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className={cn(
                "p-2 rounded-full transition",
                isActive('/') 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Layout size={20} />
              <span className="sr-only">Oversikt</span>
            </button>
            
            <button 
              onClick={() => navigate('/history')}
              className={cn(
                "p-2 rounded-full transition",
                isActive('/history') 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Calendar size={20} />
              <span className="sr-only">Historikk</span>
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className={cn(
                "p-2 rounded-full transition",
                isActive('/profile') 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <User size={20} />
              <span className="sr-only">Profil</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
