
import React from 'react';
import { motion } from 'framer-motion';

interface Recommendation {
  color: string;
  text: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
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
      className="pt-5 mt-5 border-t border-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h4 
        className="text-sm font-semibold mb-3 text-gray-800 flex items-center"
        variants={itemVariants}
      >
        <span className="w-1 h-4 bg-[#9b87f5] rounded-full mr-2"></span>
        Anbefalinger basert på helheten
      </motion.h4>
      
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.01, 
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" 
            }}
            transition={{ type: "spring", stiffness: 400 }}
            className="group rounded-xl bg-gradient-to-r from-[#f8f8f8] to-[#f1f1f5] p-[1px] shadow-sm"
          >
            <div className={`flex items-center gap-2.5 rounded-xl bg-white px-3 py-3`}>
              <div className={`flex-shrink-0 h-2 w-2 rounded-full ${recommendation.color.replace('bg-', 'bg-').replace('-50', '-400')} mt-0.5`}></div>
              <span className="text-sm text-gray-700 leading-tight">{recommendation.text}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-4 text-center" 
        variants={itemVariants}
      >
        <motion.button 
          className="text-xs text-[#9b87f5] font-medium hover:underline inline-flex items-center"
          whileHover={{ y: -2 }}
        >
          Se alle anbefalinger
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
    </motion.div>
  );
};

export default RecommendationList;
