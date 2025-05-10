
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import SystemCard from '@/components/insight/SystemCard';
import ConnectionList from '@/components/insight/ConnectionList';
import RecommendationList from '@/components/insight/RecommendationList';
import { findIssueByType, getSystemConnections } from '@/utils/systemUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InsightCardProps {
  healthIssues: HealthIssue[];
}

const InsightCard: React.FC<InsightCardProps> = ({ healthIssues }) => {
  const [expanded, setExpanded] = useState(false);
  const sortedIssues = [...healthIssues].sort((a, b) => b.load - a.load);
  
  // Find issues by type
  const nervesystemIssue = findIssueByType(sortedIssues, "nervesystem");
  const tarmIssue = findIssueByType(sortedIssues, "tarmflora") || findIssueByType(sortedIssues, "tarm");
  const hormonIssue = findIssueByType(sortedIssues, "hormon");
  const muskelIssue = findIssueByType(sortedIssues, "kompresjon") || findIssueByType(sortedIssues, "nakkevirvler");
  const hjerteIssue = findIssueByType(sortedIssues, "hjerte") || findIssueByType(sortedIssues, "kardio");
  const lungeIssue = findIssueByType(sortedIssues, "lunge") || findIssueByType(sortedIssues, "puste");
  
  // List of body systems to display
  const bodySystems = [
    { name: "Nervesystem", issue: nervesystemIssue },
    { name: "Fordøyelsessystem", issue: tarmIssue },
    { name: "Hormonsystem", issue: hormonIssue },
    { name: "Muskelsystem", issue: muskelIssue },
    { name: "Hjerte-karsystem", issue: hjerteIssue },
    { name: "Respirasjonssystem", issue: lungeIssue }
  ].filter(system => system.issue); // Only show systems with issues

  // Get visible systems based on expanded state
  const visibleSystems = expanded ? bodySystems : bodySystems.slice(0, 3);

  // Get system connections
  const connections = getSystemConnections(sortedIssues);

  // Recommendations based on system analysis
  const recommendations = [
    {
      color: "bg-emerald-50",
      text: "Fokuser på tarmhelse med prebiotika og probiotika for å påvirke både tarmflora og hormoner"
    },
    {
      color: "bg-amber-50",
      text: "Reduser stress som kan påvirke både hormonbalanse og muskelskjelettproblemer"
    },
    {
      color: "bg-blue-50",
      text: "Vurder fysisk behandling for nakken som kan forbedre nervesignaler i hele kroppen"
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="mb-8 bg-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <motion.div className="flex items-center gap-2 mb-4" variants={itemVariants}>
            <div className="bg-[#9b87f5]/10 p-2 rounded-full">
              <Lightbulb size={18} className="text-[#9b87f5]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Kroppen din som et helhetlig system</h3>
          </motion.div>
          
          <motion.p className="text-gray-600 mb-6 leading-relaxed text-sm" variants={itemVariants}>
            Skanningen indikerer sammenhenger mellom ulike systemer i kroppen din. 
            Se hvordan systemene påvirker hverandre og hvilke tiltak som kan ha størst effekt.
          </motion.p>
          
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6" variants={itemVariants}>
            {visibleSystems.map((system, index) => (
              <motion.div 
                key={system.name}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
              >
                <SystemCard 
                  name={system.name}
                  issue={system.issue}
                />
              </motion.div>
            ))}
          </motion.div>
          
          {bodySystems.length > 3 && (
            <motion.div 
              className="mb-6" 
              variants={itemVariants}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="outline" 
                onClick={() => setExpanded(!expanded)}
                className="w-full text-sm flex items-center gap-2 justify-center"
              >
                {expanded ? (
                  <>Vis færre systemer</>
                ) : (
                  <>
                    Vis alle {bodySystems.length} systemer
                    <ChevronDown size={14} className="ml-1" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <ConnectionList connections={connections} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <RecommendationList recommendations={recommendations} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InsightCard;
