
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Activity, Zap, Brain, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

enum ScanStage {
  Preparation,
  Scanning,
  Processing,
  Complete
}

const scanDuration = 30; // seconds

const ScanProcess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState<ScanStage>(ScanStage.Preparation);
  const [progress, setProgress] = useState(0);
  const [scanId, setScanId] = useState<string | null>(null);
  const [systems, setSystems] = useState<string[]>([
    'Nervesystem',
    'Fordøyelsessystem',
    'Hormonsystem',
    'Sirkulasjonssystem',
    'Immunsystem'
  ]);
  const [currentSystem, setCurrentSystem] = useState<string>('');
  
  // Handle the scanning process with realistic animations
  useEffect(() => {
    if (stage === ScanStage.Scanning) {
      const startTime = Date.now();
      const endTime = startTime + (scanDuration * 1000);
      
      const systemInterval = setInterval(() => {
        const randomSystem = systems[Math.floor(Math.random() * systems.length)];
        setCurrentSystem(randomSystem);
      }, 3000);
      
      const progressInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const newProgress = Math.min((elapsed / (scanDuration * 1000)) * 100, 100);
        setProgress(newProgress);
        
        if (now >= endTime) {
          clearInterval(progressInterval);
          clearInterval(systemInterval);
          setStage(ScanStage.Processing);
          setTimeout(() => {
            setStage(ScanStage.Complete);
          }, 3000);
        }
      }, 100);
      
      return () => {
        clearInterval(progressInterval);
        clearInterval(systemInterval);
      };
    }
  }, [stage, systems]);
  
  const startScan = async () => {
    try {
      if (!user) {
        toast.error('Du må være logget inn for å starte en skanning');
        return;
      }
      
      // Create a new scan record
      const { data, error } = await supabase
        .from('scans')
        .insert({
          user_id: user.id,
          status: 'pending'
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setScanId(data[0].id);
      }
      
      setStage(ScanStage.Scanning);
    } catch (error) {
      console.error('Error starting scan:', error);
      toast.error('Kunne ikke starte skanningen');
    }
  };
  
  const completeScan = async () => {
    try {
      if (!scanId || !user) return;
      
      // Update scan status to completed
      await supabase
        .from('scans')
        .update({ status: 'completed' })
        .eq('id', scanId);
      
      // Create coherence data (simulating results)
      const score = Math.floor(Math.random() * (80 - 50) + 50);
      await supabase
        .from('coherence_data')
        .insert({
          scan_id: scanId,
          score
        });
      
      // Create some simulated health issues
      const issues = [
        {
          name: 'Tarmflora i ubalanse',
          description: 'Redusert bakteriell diversitet og tegn på mild inflammasjon.',
          load: Math.floor(Math.random() * (50 - 30) + 30)
        },
        {
          name: 'Stressrespons forhøyet',
          description: 'Økt aktivering av sympatiske nervesystem med påvirkning på HRV.',
          load: Math.floor(Math.random() * (70 - 40) + 40)
        },
        {
          name: 'Lett vitamin D mangel',
          description: 'Nivåene av vitamin D er under optimal verdi.',
          load: Math.floor(Math.random() * (60 - 30) + 30)
        }
      ];
      
      for (const issue of issues) {
        await supabase
          .from('health_issues')
          .insert({
            scan_id: scanId,
            name: issue.name,
            description: issue.description,
            load: issue.load
          });
      }
      
      toast.success('Skanning fullført!');
      navigate('/');
    } catch (error) {
      console.error('Error completing scan:', error);
      toast.error('Kunne ikke fullføre skanningen');
    }
  };
  
  const getStageContent = () => {
    switch (stage) {
      case ScanStage.Preparation:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-40 h-40 rounded-full bg-[#9b87f5]/10 flex items-center justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#9b87f5]/30 flex items-center justify-center">
                  <Activity size={40} className="text-[#9b87f5]" />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-medium mb-2">Klar til å skanne?</h2>
            <p className="text-gray-500 text-center mb-6">
              Finn et rolig sted og forbered deg på å sitte stille i ca. 30 sekunder under skanningen.
            </p>
            
            <ul className="space-y-3 w-full mb-6">
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Check size={16} className="text-green-600" />
                </div>
                <span>Sitt i en komfortabel stilling</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Check size={16} className="text-green-600" />
                </div>
                <span>Sørg for at omgivelsene er rolige</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Check size={16} className="text-green-600" />
                </div>
                <span>Pust rolig og fokuser på avslapping</span>
              </li>
            </ul>
            
            <Button 
              onClick={startScan} 
              className="w-full bg-[#9b87f5] hover:bg-[#8a76e5]"
            >
              Start skanning
            </Button>
          </motion.div>
        );
        
      case ScanStage.Scanning:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-48 h-48">
              <motion.div 
                className="absolute inset-0 rounded-full bg-[#9b87f5]/5"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full bg-[#9b87f5]/10"
                animate={{ 
                  scale: [1, 1.15, 1],
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-32 h-32 rounded-full bg-[#9b87f5]/20 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <Zap size={40} className="text-[#9b87f5]" />
                </motion.div>
              </div>
            </div>
            
            <h2 className="text-xl font-medium mt-6 mb-2">Skanning pågår...</h2>
            <p className="text-gray-500 text-center mb-4">
              Sitt stille og slapp av mens vi skanner kroppen din
            </p>
            
            <div className="w-full mb-2">
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex justify-between w-full text-sm text-gray-500">
              <span>0%</span>
              <span>{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSystem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-[#9b87f5] font-medium">{currentSystem}</p>
                <p className="text-xs text-gray-500">Analyserer...</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        );
        
      case ScanStage.Processing:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-40 h-40 rounded-full bg-[#9b87f5]/10 flex items-center justify-center mb-6">
              <motion.div 
                className="w-32 h-32 rounded-full bg-[#9b87f5]/20 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Brain size={40} className="text-[#9b87f5]" />
              </motion.div>
            </div>
            
            <h2 className="text-xl font-medium mb-2">Behandler resultater</h2>
            <p className="text-gray-500 text-center mb-6">
              Analyserer data og oppretter din helserapport...
            </p>
            
            <div className="w-full">
              <Progress value={100} className="h-2" />
            </div>
          </motion.div>
        );
        
      case ScanStage.Complete:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div 
              className="w-40 h-40 rounded-full bg-green-100 flex items-center justify-center mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Check size={60} className="text-green-600" />
            </motion.div>
            
            <h2 className="text-xl font-medium mb-2">Skanning fullført!</h2>
            <p className="text-gray-500 text-center mb-6">
              Din helserapport er klar. Se resultatene og personlige anbefalinger.
            </p>
            
            <Button 
              onClick={completeScan} 
              className="w-full bg-[#9b87f5] hover:bg-[#8a76e5]"
            >
              Se resultater
            </Button>
          </motion.div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC]">
      <div className="container max-w-md mx-auto px-4 pt-6 pb-10">
        <header className="mb-8">
          <div className="flex items-center">
            {stage === ScanStage.Preparation && (
              <button 
                onClick={() => navigate(-1)}
                className="mr-2 p-1 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-xl font-semibold">Helseanalyse</h1>
          </div>
        </header>
        
        <Card className="bg-white/80 backdrop-blur border-gray-100/20 shadow-sm">
          <CardContent className="pt-6 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {getStageContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Add Check icon component
const Check = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default ScanProcess;
