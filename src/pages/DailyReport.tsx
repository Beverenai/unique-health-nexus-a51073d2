import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Activity, Calendar, Moon, Zap, LineChart, Smile } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { HealthCheckIn } from '@/types/database';

type CheckIn = HealthCheckIn;

const DailyReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [lastWeekCheckIns, setLastWeekCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCheckIns = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get all check-ins for the user directly from Supabase with type assertion
        const { data, error } = await (supabase
          .from('health_checkins') as any)
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        // Type assertion to ensure data is treated as CheckIn[]
        const typedData = data as unknown as CheckIn[];
        setCheckIns(typedData);
        
        // Process data for the last 7 days for the chart
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        const lastWeekData = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const formattedDate = format(date, 'yyyy-MM-dd');
          
          // Find check-in for this date if it exists
          const checkIn = typedData.find(ci => ci.date === formattedDate);
          
          lastWeekData.unshift({
            date: formattedDate,
            mood: checkIn?.mood || 0,
            energy: checkIn?.energy_level || 0,
            sleep: checkIn?.sleep_quality || 0,
            label: format(date, 'EEE', { locale: nb })
          });
        }
        
        setLastWeekCheckIns(lastWeekData);
      } catch (error) {
        console.error('Error fetching check-ins:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckIns();
  }, [user]);
  
  // Get trends for each metric
  const getTrend = (metric: 'mood' | 'energy_level' | 'sleep_quality') => {
    if (checkIns.length < 2) return { trend: 0, description: 'Nøytral' };
    
    const latest = checkIns[0][metric];
    const previous = checkIns[1][metric];
    const difference = latest - previous;
    
    if (difference > 0) return { trend: 1, description: 'Økende' };
    if (difference < 0) return { trend: -1, description: 'Synkende' };
    return { trend: 0, description: 'Stabil' };
  };
  
  const moodTrend = getTrend('mood');
  const energyTrend = getTrend('energy_level');
  const sleepTrend = getTrend('sleep_quality');
  
  const getMoodEmoji = (value: number) => {
    if (value >= 8) return '😀';
    if (value >= 6) return '🙂';
    if (value >= 4) return '😐';
    if (value >= 2) return '🙁';
    return '😞';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  const latestCheckIn = checkIns.length > 0 ? checkIns[0] : null;
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 pt-6">
        <header className="mb-6">
          <div className="flex items-center mb-2">
            <button 
              onClick={() => navigate(-1)}
              className="mr-2 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Dagslogg rapport</h1>
          </div>
          <p className="text-gray-500">
            Din helse de siste dagene
          </p>
        </header>
        
        {latestCheckIn ? (
          <div className="space-y-6">
            {/* Today's summary */}
            <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center justify-between">
                  <span>Dagens oversikt</span>
                  <span className="text-sm font-normal text-gray-500">
                    {format(new Date(latestCheckIn.date), 'PPP', { locale: nb })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center p-3 bg-[#9b87f5]/5 rounded-lg">
                    <div className="text-3xl mb-1">{getMoodEmoji(latestCheckIn.mood)}</div>
                    <div className="text-xs font-medium">Humør</div>
                    <div className="text-xl font-semibold">{latestCheckIn.mood}/10</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
                    <Zap size={24} className="text-amber-500 mb-1" />
                    <div className="text-xs font-medium">Energi</div>
                    <div className="text-xl font-semibold">{latestCheckIn.energy_level}/10</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <Moon size={24} className="text-blue-500 mb-1" />
                    <div className="text-xs font-medium">Søvn</div>
                    <div className="text-xl font-semibold">{latestCheckIn.sleep_quality}/10</div>
                  </div>
                </div>
                
                {latestCheckIn.symptoms && latestCheckIn.symptoms.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Rapporterte symptomer:</h3>
                    <div className="flex flex-wrap gap-1">
                      {latestCheckIn.symptoms.map((symptom, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {latestCheckIn.notes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-1">Noter:</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {latestCheckIn.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Chart for last 7 days */}
            <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center">
                  <LineChart size={18} className="mr-2 text-[#9b87f5]" />
                  <span>7-dagers trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={lastWeekCheckIns}>
                      <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        domain={[0, 10]}
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        name="Humør" 
                        stroke="#9b87f5" 
                        activeDot={{ r: 6 }} 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="energy" 
                        name="Energi" 
                        stroke="#f59b23" 
                        activeDot={{ r: 6 }} 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sleep" 
                        name="Søvn" 
                        stroke="#4dabf5" 
                        activeDot={{ r: 6 }} 
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Insights */}
            <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center">
                  <Activity size={18} className="mr-2 text-[#9b87f5]" />
                  <span>Innsikter</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <Smile size={18} className="mr-2 text-[#9b87f5]" />
                      <span className="font-medium">Humør</span>
                    </div>
                    <div className="flex items-center">
                      {moodTrend.trend > 0 && <span className="text-green-500">↑</span>}
                      {moodTrend.trend < 0 && <span className="text-red-500">↓</span>}
                      <span className="ml-1 text-sm">{moodTrend.description}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <Zap size={18} className="mr-2 text-amber-500" />
                      <span className="font-medium">Energi</span>
                    </div>
                    <div className="flex items-center">
                      {energyTrend.trend > 0 && <span className="text-green-500">↑</span>}
                      {energyTrend.trend < 0 && <span className="text-red-500">↓</span>}
                      <span className="ml-1 text-sm">{energyTrend.description}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon size={18} className="mr-2 text-blue-500" />
                      <span className="font-medium">Søvn</span>
                    </div>
                    <div className="flex items-center">
                      {sleepTrend.trend > 0 && <span className="text-green-500">↑</span>}
                      {sleepTrend.trend < 0 && <span className="text-red-500">↓</span>}
                      <span className="ml-1 text-sm">{sleepTrend.description}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/checkin')}
                className="bg-[#9b87f5] hover:bg-[#8a76e5]"
              >
                <Calendar size={16} className="mr-2" />
                Ny dagslogg
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} className="text-gray-500" />
            </div>
            <h2 className="text-lg font-medium mb-2">Ingen dagslogger</h2>
            <p className="text-gray-500 text-center mb-6">
              Du har ikke registrert noen dagslogger enda.
            </p>
            <Button 
              onClick={() => navigate('/checkin')}
              className="bg-[#9b87f5] hover:bg-[#8a76e5]"
            >
              Opprett første dagslogg
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReport;
