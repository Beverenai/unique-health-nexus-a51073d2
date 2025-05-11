
import React from 'react';
import { Activity } from 'lucide-react';
import LeafyGreen from './LeafyGreen';
import Flask from './Flask';
import { IssueRecommendation, HealthIssue } from '@/types/supabase';
import { motion } from 'framer-motion';

interface RecommendationsTabProps {
  recommendations: IssueRecommendation[];
  issue: HealthIssue;
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ recommendations, issue }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
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
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="rounded-xl bg-white shadow-sm border border-gray-100"
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
            <LeafyGreen size={16} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Kosthold</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {issue.specific_advice?.diet || (recommendations[0]?.recommendation || "Ingen spesifikke kostholdsanbefalinger tilgjengelig.")}
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="rounded-xl bg-white shadow-sm border border-gray-100"
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
            <Activity size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Livsstil</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {issue.specific_advice?.lifestyle || (recommendations[1]?.recommendation || "Ingen spesifikke livsstilsanbefalinger tilgjengelig.")}
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="rounded-xl bg-white shadow-sm border border-gray-100"
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center mt-0.5">
            <Flask size={16} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Tilskudd</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {issue.specific_advice?.supplements || (recommendations[2]?.recommendation || "Ingen spesifikke tilskuddsanbefalinger tilgjengelig.")}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationsTab;
