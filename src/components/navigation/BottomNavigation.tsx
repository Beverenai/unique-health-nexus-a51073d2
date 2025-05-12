
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
      icon: <Home size={isMobile ? 24 : 26} />,
      active: currentPath === '/'
    },
    { 
      path: '/insights', 
      label: 'Unique+', 
      icon: <img 
              src="/lovable-uploads/7f3db508-ef1a-4c8f-8163-91404c131e30.png" 
              alt="Unique+" 
              className={`h-${isMobile ? '6' : '7'} w-${isMobile ? '6' : '7'} object-contain`} 
            />,
      active: currentPath === '/insights'
    },
    { 
      path: '/my-plan', 
      label: 'Min Helse', 
      icon: <Heart size={isMobile ? 24 : 26} />,
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] border-t border-gray-200">
      <div className="container max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
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
                  <span className={`${isMobile ? 'text-[11px]' : 'text-sm'} mt-1 font-medium`}>{item.label}</span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  {item.icon}
                  <span className={`${isMobile ? 'text-[11px]' : 'text-sm'} mt-1`}>{item.label}</span>
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
