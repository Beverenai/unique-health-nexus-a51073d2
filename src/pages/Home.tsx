
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CoherenceRing from '@/components/CoherenceRing';
import IssueCard from '@/components/IssueCard';
import ChatButton from '@/components/ChatButton';
import NavigationBar from '@/components/NavigationBar';
import { supabase } from '@/integrations/supabase/client';
import { getLatestCoherenceData, getHealthIssues, seedDemoData } from '@/services/supabaseService';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [coherenceData, setCoherenceData] = useState<CoherenceData | null>(null);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (!data.user) {
        setLoading(false);
        return;
      }

      try {
        // Load data or seed if empty
        const coherenceData = await getLatestCoherenceData();
        const issues = await getHealthIssues();
        
        if (!coherenceData || issues.length === 0) {
          await seedDemoData();
          // Fetch data again after seeding
          const newCoherenceData = await getLatestCoherenceData();
          const newIssues = await getHealthIssues();
          setCoherenceData(newCoherenceData);
          setHealthIssues(newIssues);
        } else {
          setCoherenceData(coherenceData);
          setHealthIssues(issues);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Det oppsto en feil ved lasting av data');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleIssueClick = (issueId: string) => {
    navigate(`/issue/${issueId}`);
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Det oppsto en feil ved innlogging');
    }
  };

  const handleEmailLogin = async () => {
    // In a real app, you'd have a form for email/password input
    // For demo purposes, we'll use a magic link to a test email
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: 'test@example.com',
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      toast.success('Magisk lenke sendt til din e-post');
    } catch (error) {
      console.error('Error sending magic link:', error);
      toast.error('Det oppsto en feil ved sending av magisk lenke');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laster...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Unique</h1>
          <p className="text-gray-500">Din personlige helseassistent</p>
        </header>
        
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-6 text-center">Logg inn for å fortsette</h2>
          
          <div className="space-y-4">
            <Button onClick={handleLogin} className="w-full">
              Logg inn med Google
            </Button>
            <Button onClick={handleEmailLogin} variant="outline" className="w-full">
              Logg inn med e-post
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-20 pt-10">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Unique</h1>
          <p className="text-gray-500">Din personlige helseassistent</p>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center mb-12">
        <CoherenceRing score={coherenceData?.score || 0} />
        <p className="text-gray-600 mt-8 text-center max-w-xs">
          Din kroppskanning indikerer en total koherens-score på {coherenceData?.score || 0}%.
          {healthIssues.length > 0 && ' Sjekk dine prioriterte områder nedenfor.'}
        </p>
      </div>

      {healthIssues.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Prioriterte områder</h2>
          {healthIssues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onClick={() => handleIssueClick(issue.id)} 
            />
          ))}
        </div>
      )}

      <ChatButton />
      <NavigationBar />
    </div>
  );
};

export default Home;
