
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PriorityGroup } from '@/components/PriorityGroup';
import { HealthIssue } from '@/types/supabase';

interface PriorityGroupsProps {
  healthIssues: HealthIssue[];
}

const PriorityGroups: React.FC<PriorityGroupsProps> = ({ healthIssues }) => {
  const navigate = useNavigate();
  
  // Group health issues by priority (based on load value)
  const highPriorityIssues = healthIssues.filter(issue => issue.load >= 60);
  const moderatePriorityIssues = healthIssues.filter(issue => issue.load >= 30 && issue.load < 60);
  const lowPriorityIssues = healthIssues.filter(issue => issue.load < 30);

  const priorityGroups = [
    { 
      title: "Høy prioritet", 
      issues: highPriorityIssues, 
      color: "bg-red-50 border-red-200",
      textColor: "text-red-600",
      badge: "bg-[#EA384C]/10 text-[#EA384C] border-[#EA384C]/20",
      urlSlug: "høy-prioritet"
    },
    { 
      title: "Moderat prioritet", 
      issues: moderatePriorityIssues, 
      color: "bg-amber-50 border-amber-200",
      textColor: "text-amber-600",
      badge: "bg-[#F7D154]/10 text-amber-700 border-[#F7D154]/20",
      urlSlug: "moderat-prioritet"
    },
    { 
      title: "Lav prioritet", 
      issues: lowPriorityIssues, 
      color: "bg-green-50 border-green-200",
      textColor: "text-green-600",
      badge: "bg-[#77C17E]/10 text-[#77C17E] border-[#77C17E]/20",
      urlSlug: "lav-prioritet"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {priorityGroups.map((group) => (
        group.issues.length > 0 && (
          <motion.div key={group.title} variants={itemVariants}>
            <PriorityGroup 
              title={group.title}
              count={group.issues.length}
              color={group.color}
              textColor={group.textColor}
              badgeColor={group.badge}
              onClick={() => navigate(`/priority/${group.urlSlug}`)}
            />
          </motion.div>
        )
      ))}
      
      {priorityGroups.every(group => group.issues.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          Ingen prioriterte funn å vise
        </div>
      )}
    </motion.div>
  );
};

export default PriorityGroups;
