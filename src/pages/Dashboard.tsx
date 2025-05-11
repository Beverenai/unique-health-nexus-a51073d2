
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestCoherenceData, getHealthIssues, getHistoricalCoherenceData } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { HealthIssue } from '@/types/supabase';
import { Clock, CalendarClock, PlusCircle, LineChart, ArrowRight, Activity, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart as RechartLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import BodyBalanceDisplay from '@/components/balance/BodyBalanceDisplay';
import HealthInsightSummary from '@/components/balance/HealthInsightSummary';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanRecommendation, HealthCheckIn } from '@/types/database';

interface CheckInSummary extends Pick<HealthCheckIn, 'id' | 'date' | 'mood' | 'energy_level' | 'sleep_quality'> {}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [coherenceData, setCoherenceData] = useState<any>(null);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<PlanRecommendation[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInSummary[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (profileData?.first_name) {
            setUserName(profileData.first_name);
          }
        }
        
        // Fetch coherence data
        const coherenceResult = await getLatestCoherenceData();
        if (coherenceResult) {
          setCoherenceData(coherenceResult);
        }
        
        // Fetch health issues
        const issuesResult = await getHealthIssues();
        if (issuesResult && issuesResult.length > 0) {
          setHealthIssues(issuesResult);
        }
        
        // Fetch historical data
        const historyResult = await getHistoricalCoherenceData();
        if (historyResult) {
          setHistoricalData(historyResult);
        }
        
        // Fetch recommendations directly from Supabase
        if (user) {
          const { data: recommendationsData } = await supabase
            .from('plan_recommendations')
            .select('*')
            .eq('completed', false)
            .limit(3);
          
          if (recommendationsData) {
            setRecommendations(recommendationsData as unknown as PlanRecommendation[]);
          }
          
          // Fetch check-ins directly from Supabase
          const { data: checkInsData } = await supabase
            .from('health_checkins')
            .select('id, date, mood, energy_level, sleep_quality')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(5);
          
          if (checkInsData) {
            setCheckIns(checkInsData as unknown as CheckInSummary[]);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleMarkRecommendationComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plan_recommendations')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      setRecommendations(prev => prev.filter(rec => rec.id !== id));
      toast.success('Anbefaling markert som utført');
    } catch (error) {
      console.error('Error marking recommendation as complete:', error);
      toast.error('Kunne ikke oppdatere anbefalingen');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: nb });
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">
            Hei, {userName || 'der'}!
          </h1>
          <p className="text-gray-600">
            Velkommen til din personlige helsedashboard
          </p>
        </header>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BodyBalanceDisplay coherenceData={coherenceData} />
        </motion.div>
        
        {/* Recommendations section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">Anbefalte tiltak</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/my-plan')}
              className="text-xs text-[#9b87f5]"
            >
              Se alle <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
          
          <AnimatePresence>
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-3 flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#9b87f5]/10 flex items-center justify-center">
                            <Activity size={20} className="text-[#9b87f5]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{recommendation.text}</p>
                            <p className="text-xs text-gray-500">{recommendation.category}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#9b87f5] hover:text-[#7a69c8] h-8 w-8 p-0 rounded-full"
                            onClick={() => handleMarkRecommendationComplete(recommendation.id)}
                          >
                            <Check size={18} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="p-4 text-center">
                  <p className="text-gray-500">Ingen anbefalinger å vise</p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </section>
        
        {/* Health trends section */}
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-2">Din helseutvikling</h2>
          <Card>
            <CardContent className="p-4">
              {historicalData.length > 0 ? (
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLineChart data={historicalData.map(d => ({
                      date: new Date(d.date).toLocaleDateString('nb-NO'),
                      score: d.score
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tickCount={5}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#9b87f5" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#9b87f5' }}
                        activeDot={{ r: 6, fill: '#7a69c8' }}
                      />
                    </RechartLineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-60 flex items-center justify-center">
                  <p className="text-gray-500">Ingen historiske data å vise</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        
        {/* Quick actions */}
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-2">Hurtighandlinger</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/scan')}>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-[#9b87f5]/10 flex items-center justify-center mb-2">
                  <PlusCircle size={24} className="text-[#9b87f5]" />
                </div>
                <h3 className="font-medium">Ny skanning</h3>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/checkin')}>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <CalendarClock size={24} className="text-green-600" />
                </div>
                <h3 className="font-medium">Dagslogg</h3>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Recent check-ins */}
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-2">Nylige dagslogger</h2>
          {checkIns.length > 0 ? (
            <div className="space-y-3">
              {checkIns.map((checkIn) => (
                <Card key={checkIn.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{format(new Date(checkIn.date), 'dd. MMMM', { locale: nb })}</h3>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 mr-1">
                          Søvn: {checkIn.sleep_quality}/10
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-600">
                          Energi: {checkIn.energy_level}/10
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Clock size={14} className="text-gray-400 mr-1" />
                      </div>
                      <span className="text-xs text-gray-500">Humør: {checkIn.mood}/10</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="p-4 text-center">
                <p className="text-gray-500">Ingen dagslogger registrert</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/checkin')}
                >
                  Opprett første dagslogg
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
        
        {/* Health insights */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-2">Helseprioriteringer</h2>
          {healthIssues.length > 0 && (
            <HealthInsightSummary 
              healthIssues={healthIssues.sort((a, b) => b.load - a.load).slice(0, 3)} 
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
