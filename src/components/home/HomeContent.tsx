
import React from 'react';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { Gauge, List, Lightbulb } from 'lucide-react';
import { TabView } from '@/components/ui/tab-view';
import BodyBalanceDisplay from '@/components/balance/BodyBalanceDisplay';
import OverviewTab from '@/components/home/tabs/OverviewTab';
import PrioritiesTab from '@/components/home/tabs/PrioritiesTab';
import FindingsTab from '@/components/home/tabs/FindingsTab';
import { BodyFocusSummary } from '@/components/home';
import ActionButtons from '@/components/home/ActionButtons';
import HealthInsightSummary from '@/components/balance/HealthInsightSummary';
import HomeHeader from '@/components/home/HomeHeader';

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

  return (
    <>
      {/* Integrated header with scan date */}
      <div className="pt-4 pb-2 bg-gray-50 z-10">
        <HomeHeader 
          userName={userName} 
          scanDate={new Date(coherenceData?.created_at || scanDate)} 
        />
      </div>
      
      <div className="space-y-5 mt-3">
        {/* Body Balance - Now at the top */}
        <div className="transform transition-all duration-300">
          <BodyBalanceDisplay coherenceData={coherenceData} />
        </div>
        
        {/* Health insights summary */}
        <div className="transform transition-all duration-300">
          <HealthInsightSummary 
            healthIssues={healthIssues.sort((a, b) => b.load - a.load).slice(0, 3)} 
          />
        </div>
        
        {/* Main focus area */}
        <BodyFocusSummary 
          coherenceScore={coherenceData?.score || 64} 
          healthIssues={healthIssues}
          className="transform transition-all duration-300" 
        />
        
        {/* Action buttons section */}
        <ActionButtons />
        
        {/* Tab view moved below the main content */}
        <div className="pt-1">
          <h3 className="text-base font-medium text-gray-700 mb-3">Detaljert informasjon</h3>
          <TabView tabs={tabs} className="bg-transparent" />
        </div>
      </div>
    </>
  );
};

export default HomeContent;
