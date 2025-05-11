
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart2, History, User, ListTodo, CalendarClock, LayoutDashboard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  
  const navItems = [
    { 
      path: '/', 
      label: 'Hjem', 
      icon: <Home size={isMobile ? 20 : 22} />,
      active: currentPath === '/'
    },
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={isMobile ? 20 : 22} />,
      active: currentPath === '/dashboard'
    },
    { 
      path: '/insights', 
      label: 'Innsikt', 
      icon: <BarChart2 size={isMobile ? 20 : 22} />,
      active: currentPath === '/insights'
    },
    { 
      path: '/checkin', 
      label: 'Dagslogg', 
      icon: <CalendarClock size={isMobile ? 20 : 22} />,
      active: currentPath === '/checkin'
    },
    { 
      path: '/profile', 
      label: 'Profil', 
      icon: <User size={isMobile ? 20 : 22} />,
      active: currentPath === '/profile'
    }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] border-t border-gray-200">
      <div className="container max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center justify-center ${isMobile ? 'w-14' : 'w-16'} h-full ${
                item.active ? 'text-[#9b87f5]' : 'text-gray-500'
              }`}
            >
              {item.active ? (
                <motion.div 
                  initial={{ scale: 0.8 }} 
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  {item.icon}
                  <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} mt-0.5 font-medium`}>{item.label}</span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  {item.icon}
                  <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} mt-0.5`}>{item.label}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
