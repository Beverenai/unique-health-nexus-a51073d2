
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  showHealthTable: boolean;
  toggleHealthTable: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ showHealthTable, toggleHealthTable }) => {
  const navigate = useNavigate();
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div className="mt-6 space-y-3" variants={itemVariants}>
      <Button 
        variant="outline" 
        className="w-full flex justify-between items-center bg-white/50 hover:bg-white/80 backdrop-blur-sm border-white/40 shadow-sm hover:shadow"
        onClick={() => navigate('/insights')}
      >
        <span>Se alle innsikter</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full flex justify-between items-center bg-white/50 hover:bg-white/80 backdrop-blur-sm border-white/40 shadow-sm hover:shadow"
        onClick={toggleHealthTable}
      >
        <span>{showHealthTable ? "Skjul helseinformasjon" : "Vis detaljert helseinformasjon"}</span>
        {showHealthTable ? (
          <ArrowRight size={16} className="transform rotate-90" />
        ) : (
          <ArrowRight size={16} className="transform rotate-0" />
        )}
      </Button>
    </motion.div>
  );
};

export default ActionButtons;
