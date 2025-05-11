
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, InfoIcon, Layers, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      } 
    }
  };

  return (
    <motion.div 
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative">
        <motion.div 
          className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />
        <motion.div 
          className="relative z-10 flex justify-center"
          variants={itemVariants}
        >
          <span className="bg-[#F8F8FC] text-xs text-gray-400 px-4">
            HANDLINGER
          </span>
        </motion.div>
      </div>
      
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.15)" }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center bg-white hover:bg-white/90 backdrop-blur-sm border-white/40 shadow-sm hover:shadow"
          onClick={() => navigate('/insights')}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#9b87f5]/10 p-1.5 rounded-full">
              <InfoIcon size={16} className="text-[#9b87f5]" />
            </div>
            <span>Se detaljert systemanalyse</span>
          </div>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.15)" }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center bg-white hover:bg-white/90 backdrop-blur-sm border-white/40 shadow-sm hover:shadow"
          onClick={() => navigate('/history')}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#9b87f5]/10 p-1.5 rounded-full">
              <Layers size={16} className="text-[#9b87f5]" />
            </div>
            <span>Se historisk utvikling</span>
          </div>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.15)" }}
        whileTap={{ scale: 0.98 }}
        className="opacity-80" // Slightly less emphasized
      >
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center bg-white/60 hover:bg-white/90 backdrop-blur-sm border-white/40 shadow-sm hover:shadow"
          onClick={() => navigate('/')}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#9b87f5]/10 p-1.5 rounded-full">
              <Heart size={16} className="text-[#9b87f5]" />
            </div>
            <span>Få personlige anbefalinger</span>
          </div>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ActionButtons;
