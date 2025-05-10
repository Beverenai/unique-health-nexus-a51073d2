
import React, { useEffect, useState } from 'react';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { getLatestCoherenceData, getHealthIssues, seedDemoData } from '@/services/supabaseService';
import CoherenceDisplay from '@/components/CoherenceDisplay';
import ScanDateCard from '@/components/ScanDateCard';
import HealthIssuesCarousel from '@/components/HealthIssuesCarousel';
import { useNavigate } from 'react-router-dom';
import { PriorityGroup } from '@/components/PriorityGroup';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HealthInfoTable from '@/components/HealthInfoTable';
import { motion } from 'framer-motion';

// Hardcoded mock data to ensure it always displays
const mockCoherenceData: CoherenceData = {
  score: 64,
  message: "Din kroppskanning indikerer en total koherens-score på 64%.",
  id: "mock-id",
  scan_id: "mock-scan-id",
  created_at: new Date().toISOString()
};

const mockHealthIssues: HealthIssue[] = [
  {
    id: "issue-1",
    scan_id: "mock-scan-id",
    name: "Tarmflora i ubalanse",
    description: "Bakterielle mønstre viser redusert mangfold og lett inflammasjon.",
    load: 45,
    created_at: new Date().toISOString(),
    recommendations: ["Fermentert mat, pre- og probiotika, vurder test av matintoleranser."]
  },
  {
    id: "issue-2",
    scan_id: "mock-scan-id",
    name: "Hormonell ubalanse",
    description: "Kortisol og melatonin viser avvik som kan påvirke søvn og stressrespons.",
    load: 38,
    created_at: new Date().toISOString(),
    recommendations: ["Regelmessig døgnrytme, dagslys, adaptogener."]
  },
  {
    id: "issue-3",
    scan_id: "mock-scan-id",
    name: "Kompresjon i nakkevirvler C4–C5",
    description: "Signalene indikerer redusert sirkulasjon og stress i nakke/skulderområdet.",
    load: 65,
    created_at: new Date().toISOString(),
    recommendations: ["Vurder kiropraktikk, massasje og spesifikke øvelser for nakkeområdet."]
  },
  {
    id: "issue-4",
    scan_id: "mock-scan-id",
    name: "Vitamin D mangel",
    description: "Analysen indikerer lave nivåer av vitamin D som kan påvirke immunsystemet.",
    load: 72,
    created_at: new Date().toISOString(),
    recommendations: ["Daglig tilskudd av vitamin D, økt eksponering for sollys når mulig."]
  },
  {
    id: "issue-5",
    scan_id: "mock-scan-id",
    name: "Lett dehydrering",
    description: "Cellulære signaler tyder på redusert væskebalanse.",
    load: 25,
    created_at: new Date().toISOString(),
    recommendations: ["Øk daglig vanninntak, vurder elektrolytter ved trening."]
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [coherenceData, setCoherenceData] = useState<CoherenceData | null>(mockCoherenceData);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [scanDate, setScanDate] = useState<Date>(new Date());
  const [userName, setUserName] = useState<string>("Demo");
  const [showHealthTable, setShowHealthTable] = useState<boolean>(false);
  
  // Fetch real data from Supabase when available
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try seeding demo data first
        await seedDemoData();
        
        // Then try to load it
        const coherenceResult = await getLatestCoherenceData();
        if (coherenceResult) {
          setCoherenceData(coherenceResult);
        }
        
        const issuesResult = await getHealthIssues();
        if (issuesResult && issuesResult.length > 0) {
          setHealthIssues(issuesResult);
        }

        // Try to get user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.first_name) {
            setUserName(profile.first_name);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep using mock data (already set as default state)
      }
    };
    
    fetchData();
  }, []);

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

  const toggleHealthTable = () => {
    setShowHealthTable(!showHealthTable);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] pt-4 pb-24 subtle-pattern">
      <main className="container max-w-md mx-auto px-4">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-playfair font-semibold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Hei, {userName}
          </h1>
          <p className="text-gray-500 text-sm">Slik ser helsen din ut i dag</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ScanDateCard scanDate={new Date(coherenceData?.created_at || scanDate)} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          <CoherenceDisplay coherenceData={coherenceData} />
        </motion.div>
        
        <motion.div 
          className="mt-10 space-y-4"
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
        </motion.div>
        
        {showHealthTable && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <HealthInfoTable 
              title="Helseinformasjon" 
              description="Detaljert oversikt over helsetilstanden din"
            />
          </motion.div>
        )}
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-playfair font-medium mb-4 text-gray-800">Nylige funn</h2>
          <HealthIssuesCarousel healthIssues={healthIssues.sort((a, b) => b.load - a.load).slice(0, 5)} />
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
