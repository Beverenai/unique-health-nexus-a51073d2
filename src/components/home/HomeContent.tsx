
import React from 'react';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { motion } from 'framer-motion';
import BodyFocusSummary from '@/components/home/bodyFocus/BodyFocusSummary';
import HomeHeader from '@/components/home/HomeHeader';
import { Card } from '@/components/ui/card';
import ActionButtons from '@/components/home/ActionButtons';
import BodyBalanceDisplay from '@/components/balance/BodyBalanceDisplay';
import HealthInsightSummary from '@/components/balance/HealthInsightSummary';
import { TabView } from '@/components/ui/tab-view';
import { Gauge, List, Lightbulb } from 'lucide-react';
import OverviewTab from '@/components/home/tabs/OverviewTab';
import PrioritiesTab from '@/components/home/tabs/PrioritiesTab';
import FindingsTab from '@/components/home/tabs/FindingsTab';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface HomeContentProps {
  coherenceData: CoherenceData | null;
  healthIssues: HealthIssue[];
  userName: string;
  scanDate: Date;
}

const HomeContent: React.FC<HomeContentProps> = ({
  coherenceData,
  healthIssues,
  userName,
  scanDate
}) => {
  // Define tab structure
  const tabs = [
    {
      id: "overview",
      label: "Oversikt",
      icon: <Gauge size={16} />,
      content: <OverviewTab healthIssues={healthIssues} />
    },
    {
      id: "priorities",
      label: "Prioriteter",
      icon: <List size={16} />,
      content: <PrioritiesTab healthIssues={healthIssues} />
    },
    {
      id: "findings",
      label: "Funn",
      icon: <Lightbulb size={16} />,
      content: <FindingsTab healthIssues={healthIssues} />
    }
  ];
  
  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Integrated header with scan date */}
      <motion.div variants={itemVariants} className="pt-4 pb-2 bg-gray-50 z-10">
        <HomeHeader 
          userName={userName} 
          scanDate={new Date(coherenceData?.created_at || scanDate)} 
        />
      </motion.div>
      
      {/* Main content sections using Accordion for collapsible behavior */}
      <Accordion type="multiple" defaultValue={['body-balance', 'body-focus']} className="space-y-5">
        {/* Body Balance - Hero Section */}
        <AccordionItem value="body-balance" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h2 className="text-base font-medium text-gray-700">Kroppens balanse</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <motion.div variants={itemVariants} className="transform transition-all duration-300">
              <BodyBalanceDisplay coherenceData={coherenceData} />
            </motion.div>
          </AccordionContent>
        </AccordionItem>
          
        {/* Health insights summary */}
        <AccordionItem value="health-insights" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h2 className="text-base font-medium text-gray-700">Nøkkelinnsikt</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <motion.div variants={itemVariants} className="transform transition-all duration-300">
              <HealthInsightSummary 
                healthIssues={healthIssues.sort((a, b) => b.load - a.load).slice(0, 3)} 
              />
            </motion.div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Main focus area */}
        <AccordionItem value="body-focus" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h2 className="text-base font-medium text-gray-700">Fokusområder</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <motion.div variants={itemVariants}>
              <BodyFocusSummary 
                coherenceScore={coherenceData?.score || 64} 
                healthIssues={healthIssues}
                className="transform transition-all duration-300" 
              />
            </motion.div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Action buttons section */}
        <motion.div variants={itemVariants} className="py-2">
          <ActionButtons />
        </motion.div>
        
        {/* Tab view moved below the main content */}
        <AccordionItem value="details" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h2 className="text-base font-medium text-gray-700">Detaljert informasjon</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <motion.div variants={itemVariants}>
              <TabView tabs={tabs} className="bg-transparent" />
            </motion.div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

export default HomeContent;
