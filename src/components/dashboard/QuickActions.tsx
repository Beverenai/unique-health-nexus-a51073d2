
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ListChecks, LineChart, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-2 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Button 
          className="w-full justify-start bg-gradient-to-br from-[#9b87f5] to-[#8a76e5] hover:opacity-90 transition-opacity shadow-sm"
          onClick={() => navigate('/scan')}
        >
          <ListChecks className="mr-2 h-4 w-4" />
          Ny helsesjekk
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Button 
          className="w-full justify-start bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          onClick={() => navigate('/insights')}
        >
          <LineChart className="mr-2 h-4 w-4" />
          Innsikter
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Button 
          className="w-full justify-start bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          onClick={() => navigate('/my-plan')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Min Plan
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default QuickActions;
