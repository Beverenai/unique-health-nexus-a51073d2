
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PieChart, Scan, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleNewScan = () => {
    toast.success('Starter ny skanning...', {
      description: 'Dette ville starte en ny skanning i en reell applikasjon.'
    });
  };

  const navigationItems = [
    {
      icon: Home,
      label: 'Hjem',
      path: '/',
      action: () => navigate('/'),
    },
    {
      icon: PieChart,
      label: 'Innsikter',
      path: '/insights',
      action: () => navigate('/insights'),
    },
    {
      icon: Scan,
      label: 'Skann',
      path: '/scan',
      action: handleNewScan,
      highlight: true,
    },
    {
      icon: User,
      label: 'Profil',
      path: '/profile',
      action: () => navigate('/profile'),
    },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-lg rounded-t-xl z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full rounded-lg transition-all",
              isActive(item.path) ? "text-[#9b87f5]" : "text-gray-500",
              item.highlight && "text-[#9b87f5]"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-10 h-10 mb-1 rounded-full transition-all",
              item.highlight && "bg-[#9b87f5]/10",
              isActive(item.path) && !item.highlight && "bg-gray-50"
            )}>
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon size={20} />
              </motion.div>
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
