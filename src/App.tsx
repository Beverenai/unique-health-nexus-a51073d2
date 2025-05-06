
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { seedHistoricalData } from '@/services/supabaseService';
import Index from "./pages/Index";
import History from "./pages/History";
import Profile from "./pages/Profile";
import IssueDetail from "./pages/IssueDetail";
import NotFound from "./pages/NotFound";
import Onboarding from "./components/Onboarding";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      // Show onboarding if it hasn't been completed and user is logged in
      if (!onboardingCompleted && session) {
        setShowOnboarding(true);
        
        // Also seed historical data for the demo
        seedHistoricalData();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      
      // Show onboarding if it's a new sign-in and onboarding hasn't been completed
      if (!onboardingCompleted && session) {
        setShowOnboarding(true);
        
        // Also seed historical data for the demo
        seedHistoricalData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {showOnboarding && (
            <Onboarding onComplete={() => setShowOnboarding(false)} />
          )}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/issue/:issueId" element={<IssueDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
