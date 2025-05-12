
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const { trigger } = useHapticFeedback();
  
  const navItems = [
    { 
      path: '/', 
      label: 'Hjem', 
      icon: <Home size={isMobile ? 28 : 26} />,
      active: currentPath === '/'
    },
    { 
      path: '/insights', 
      label: 'Unique+', 
      icon: <img 
              src="/lovable-uploads/7f3db508-ef1a-4c8f-8163-91404c131e30.png" 
              alt="Unique+" 
              className={`h-${isMobile ? '7' : '7'} w-${isMobile ? '7' : '7'} object-contain`} 
            />,
      active: currentPath === '/insights'
    },
    { 
      path: '/my-plan', 
      label: 'Min Helse', 
      icon: <Heart size={isMobile ? 28 : 26} />,
      active: currentPath === '/my-plan'
    }
  ];
  
  const handleNavPress = (path: string) => {
    // Only trigger haptic feedback if navigating to a different page
    if (path !== currentPath) {
      trigger('selection');
    }
  };
  
  return (
    <nav className="fixed bottom-6 left-0 right-0 z-40 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-gray-200 mx-4 rounded-2xl">
      <div className="container max-w-md mx-auto">
        <div className="flex justify-around items-center h-[70px]">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center justify-center w-1/3 h-full ${
                item.active ? 'text-[#9b87f5]' : 'text-gray-500'
              }`}
              onClick={() => handleNavPress(item.path)}
            >
              {item.active ? (
                <motion.div 
                  initial={{ scale: 0.8 }} 
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  {item.icon}
                  <span className={`${isMobile ? 'text-[13px]' : 'text-sm'} mt-1.5 font-medium`}>{item.label}</span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  {item.icon}
                  <span className={`${isMobile ? 'text-[13px]' : 'text-sm'} mt-1.5`}>{item.label}</span>
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
