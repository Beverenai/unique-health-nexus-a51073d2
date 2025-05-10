
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp, InfoIcon, Layers, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  showHealthTable: boolean;
  toggleHealthTable: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ showHealthTable, toggleHealthTable }) => {
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

  const buttonHoverStyle = {
    scale: 1.02, 
    boxShadow: "0 4px 12px rgba(155, 135, 245, 0.15)"
  };

  return (
    <motion.div 
      className="mt-6 space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={itemVariants}
        whileHover={buttonHoverStyle}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center bg-white/70 hover:bg-white/90 backdrop-blur-sm border-white/40 shadow-sm hover:shadow"
          onClick={() => navigate('/insights')}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#9b87f5]/10 p-1.5 rounded-full">
              <InfoIcon size={16} className="text-[#9b87f5]" />
            </div>
            <span>Se alle innsikter</span>
          </div>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        whileHover={buttonHoverStyle}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center bg-white/70 hover:bg-white/90 backdrop-blur-sm border-white/40 shadow-sm hover:shadow"
          onClick={toggleHealthTable}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#9b87f5]/10 p-1.5 rounded-full">
              <Settings size={16} className="text-[#9b87f5]" />
            </div>
            <span>{showHealthTable ? "Skjul helseinformasjon" : "Vis detaljert helseinformasjon"}</span>
          </div>
          {showHealthTable ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </Button>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        whileHover={buttonHoverStyle}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center bg-white/70 hover:bg-white/90 backdrop-blur-sm border-white/40 shadow-sm hover:shadow"
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
    </motion.div>
  );
};

export default ActionButtons;
