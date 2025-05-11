import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircle2, Circle, Flame, Heart, ListChecks, LucideIcon, Sparkles, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { PlanRecommendation, HealthCheckIn } from '@/types/database';

interface Recommendation extends PlanRecommendation {}

interface Checkin extends HealthCheckIn {}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [latestCheckin, setLatestCheckin] = useState<Checkin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  useEffect(() => {
    if (user) {
      setUserId(user.id);
      fetchRecommendations();
    }
  }, [user]);
  
  // Fix Supabase queries with proper type assertions
  const fetchRecommendations = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await (supabase
        .from('plan_recommendations') as any)
        .select('*')
        .eq('completed', false)
        .order('priority', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      setRecommendations(data as any);
      
      // Also fetch the latest checkin
      const { data: checkinData, error: checkinError } = await (supabase
        .from('health_checkins') as any)
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1);
        
      if (checkinError) {
        console.error('Error fetching checkin:', checkinError);
      } else if (checkinData && checkinData.length > 0) {
        setLatestCheckin(checkinData[0]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRecommendation = async (id: string) => {
    try {
      const { error } = await (supabase
        .from('plan_recommendations') as any)
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setRecommendations(recommendations.filter(rec => rec.id !== id));
      toast.success('Anbefaling markert som fullført!');
    } catch (error) {
      console.error('Error completing recommendation:', error);
      toast.error('Kunne ikke oppdatere anbefalingen');
    }
  };
  
  const getPriorityIcon = (priority: string): LucideIcon => {
    switch (priority) {
      case 'high':
        return Flame;
      case 'medium':
        return Heart;
      case 'low':
      default:
        return Sparkles;
    }
  };
  
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'PPP', { locale: nb });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Ukjent dato';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-3xl mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Velkommen tilbake! Her er en oversikt over din helse.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
              <CardHeader>
                <CardTitle>Hurtighandlinger</CardTitle>
                <CardDescription>Kom raskt i gang med disse handlingene.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="w-full justify-start bg-[#9b87f5] hover:bg-[#8a76e5]"
                  onClick={() => navigate('/checkin')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Dagslogg
                </Button>
                <Button 
                  className="w-full justify-start bg-[#9b87f5] hover:bg-[#8a76e5]"
                  onClick={() => navigate('/scan')}
                >
                  <ListChecks className="mr-2 h-4 w-4" />
                  Helsesjekk
                </Button>
              </CardContent>
            </Card>
            
            {/* Today's Recommendations */}
            <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
              <CardHeader>
                <CardTitle>Dagens anbefalinger</CardTitle>
                <CardDescription>Her er dine anbefalinger for i dag.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <div className="space-y-3 p-3">
                    {recommendations.length > 0 ? (
                      recommendations.map(rec => (
                        <div key={rec.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <getPriorityIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-sm">{rec.text}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleCompleteRecommendation(rec.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        Ingen anbefalinger for i dag!
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Calendar */}
            <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
              <CardHeader>
                <CardTitle>Kalender</CardTitle>
                <CardDescription>Se dine dagslogger og avtaler.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? formatDate(date.toISOString()) : <span>Velg en dato</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date > new Date() || date < new Date("2023-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
            
            {/* Latest Check-in */}
            <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
              <CardHeader>
                <CardTitle>Siste dagslogg</CardTitle>
                <CardDescription>Siste registrerte dagslogg.</CardDescription>
              </CardHeader>
              <CardContent>
                {latestCheckin ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Humør:</span>
                      <span className="text-sm">{latestCheckin.mood}/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Energi:</span>
                      <span className="text-sm">{latestCheckin.energy_level}/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Søvn:</span>
                      <span className="text-sm">{latestCheckin.sleep_quality}/10</span>
                    </div>
                    <Button 
                      variant="secondary"
                      className="w-full"
                      onClick={() => navigate('/daily-report')}
                    >
                      Se full rapport
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    Ingen dagslogger registrert ennå.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
