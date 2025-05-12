
import React from 'react';
import { motion } from 'framer-motion';
import { HealthIssue } from '@/types/supabase';
import { HealthIssuesCarousel } from '@/components/carousel';
import { Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentFindingsProps {
  healthIssues: HealthIssue[];
}

const RecentFindings: React.FC<RecentFindingsProps> = ({ healthIssues }) => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.2
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
  
  const handleViewAllFindings = () => {
    navigate('/findings');
  };
  
  return (
    <motion.section 
      className="mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
    >
      <motion.div 
        className="flex items-center justify-between mb-4" 
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <div className="bg-[#9b87f5]/10 p-1.5 rounded-full">
            <Lightbulb size={16} className="text-[#9b87f5]" />
          </div>
          <h2 className="text-xl font-playfair font-medium text-gray-800">Nylige funn</h2>
        </div>
        
        <motion.span 
          className="text-xs px-2 py-1 bg-[#9b87f5]/10 text-[#9b87f5] font-medium rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {healthIssues.length} funn
        </motion.span>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <HealthIssuesCarousel healthIssues={healthIssues.sort((a, b) => b.load - a.load).slice(0, 5)} />
      </motion.div>
      
      <motion.div 
        className="mt-4 text-center"
        variants={itemVariants}
      >
        <motion.button 
          className="text-sm text-[#9b87f5] font-medium hover:underline inline-flex items-center"
          whileHover={{ y: -2 }}
          onClick={handleViewAllFindings}
          transition={{ type: "spring", stiffness: 400 }}
        >
          Se alle helsefunn
          <svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default RecentFindings;
