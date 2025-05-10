
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { seedHistoricalData } from '@/services/supabaseService';
import BottomNavigation from "./components/navigation/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Insights from "./pages/Insights";
import IssueDetail from "./pages/IssueDetail";
import NotFound from "./pages/NotFound";
import Onboarding from "./components/Onboarding";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    // Show onboarding if it hasn't been completed (no login check)
    if (!onboardingCompleted) {
      setShowOnboarding(true);
      
      // Also seed historical data for the demo
      seedHistoricalData();
    }
    
    // Still check auth just to have the session if the user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderContent = () => (
    <div className="min-h-screen flex flex-col pb-16">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/issue/:issueId" element={<IssueDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNavigation />
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-sans bg-gradient-to-b from-white to-[#F8F8FC]">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {showOnboarding && (
              <Onboarding onComplete={() => setShowOnboarding(false)} />
            )}
            {renderContent()}
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
