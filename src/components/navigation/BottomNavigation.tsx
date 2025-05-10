
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PieChart, Scan, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
      icon: Calendar,
      label: 'Historikk',
      path: '/history',
      action: () => navigate('/history'),
    },
    {
      icon: User,
      label: 'Profil',
      path: '/profile',
      action: () => navigate('/profile'),
    },
  ];

  // Animation variants
  const navVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30, 
        mass: 0.8,
        delay: 0.2
      }
    },
    exit: { 
      y: 100, 
      opacity: 0,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3 + custom * 0.1,
        type: "spring",
        stiffness: 300
      }
    })
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50"
        variants={navVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="px-4 pb-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl overflow-hidden">
            <div className="flex justify-around items-center h-16 px-2">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={item.action}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full rounded-lg transition-all",
                    isActive(item.path) ? 
                      "text-[#9b87f5]" : "text-gray-500",
                    item.highlight && "text-[#9b87f5]"
                  )}
                >
                  <motion.div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 mb-1 rounded-full transition-all",
                      item.highlight ? "bg-[#9b87f5]/10 scale-110" : "",
                      isActive(item.path) && !item.highlight && "bg-[#9b87f5]/10"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Active indicator */}
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -top-1 w-1 h-1 rounded-full bg-[#9b87f5]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <item.icon size={item.highlight ? 24 : 20} />
                  </motion.div>
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BottomNavigation;
