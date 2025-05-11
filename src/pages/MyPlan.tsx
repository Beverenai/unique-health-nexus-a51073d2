
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CalendarClock, CheckCircle2, Flame, ListChecks, Plus, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format, isPast, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { tables } from '@/integrations/supabase/client-extensions';
import { UserPlan, PlanRecommendation } from '@/types/database';

const MyPlan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [recommendations, setRecommendations] = useState<PlanRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchPlans();
  }, [user]);
  
  const fetchPlans = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await tables.userPlans()
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single() as any;
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error code
        throw error;
      }
      
      if (data) {
        setPlan(data);
        await fetchRecommendations(data.id);
      } else {
        // If no plan exists, try to create a default one
        await createDefaultPlan();
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Kunne ikke hente helseplan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchRecommendations = async (planId: string) => {
    try {
      const { data, error } = await tables.planRecommendations()
        .select('*')
        .eq('plan_id', planId)
        .order('priority', { ascending: false }) as any;
        
      if (error) throw error;
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Kunne ikke hente anbefalinger for planen');
    }
  };
  
  const createDefaultPlan = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30); // Default plan duration: 30 days
      
      const { data, error } = await tables.userPlans()
        .insert({
          user_id: user.id,
          title: 'Standard helseplan',
          description: 'En standard helseplan generert av systemet',
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active'
        } as any)
        .select()
        .single() as any;
        
      if (error) throw error;
      
      setPlan(data);
      toast.success('Standard helseplan opprettet!');
    } catch (error) {
      console.error('Error creating default plan:', error);
      toast.error('Kunne ikke opprette standard helseplan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateProgress = () => {
    if (recommendations.length === 0) return 0;
    
    const completed = recommendations.filter(rec => rec.completed).length;
    return (completed / recommendations.length) * 100;
  };
  
  const progress = calculateProgress();
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPP', { locale: nb });
  };
  
  const isRecommendationOverdue = (recommendation: PlanRecommendation) => {
    if (!recommendation.due_date) return false;
    const dueDate = parseISO(recommendation.due_date);
    return isPast(dueDate);
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
      <div className="container max-w-md mx-auto px-4 pt-6">
        <header className="mb-6">
          <div className="flex items-center mb-2">
            <button 
              onClick={() => navigate(-1)}
              className="mr-2 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Min helseplan</h1>
          </div>
          <p className="text-gray-500">
            Oversikt over din personlige helseplan
          </p>
        </header>
        
        {plan ? (
          <div className="space-y-6">
            {/* Plan Summary */}
            <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ListChecks size={20} className="mr-2 text-[#9b87f5]" />
                  {plan.title}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {plan.description || 'Ingen beskrivelse tilgjengelig'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Fremdrift:
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 font-medium">Startdato:</span>
                      <span className="block text-gray-500">{formatDate(plan.start_date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Sluttdato:</span>
                      <span className="block text-gray-500">
                        {plan.end_date ? formatDate(plan.end_date) : 'Ingen sluttdato'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recommendations Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="recommendations">
                <AccordionTrigger className="text-lg font-semibold">
                  <Flame size={20} className="mr-2 text-red-500" />
                  Anbefalinger
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="rounded-md border p-4">
                    <div className="grid gap-4">
                      {recommendations.length > 0 ? (
                        recommendations.map(recommendation => (
                          <div 
                            key={recommendation.id}
                            className="flex items-center justify-between"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="text-sm font-medium">{recommendation.text}</span>
                                {recommendation.due_date && (
                                  <Badge 
                                    variant="secondary"
                                    className={`ml-2 text-xs ${
                                      isRecommendationOverdue(recommendation) 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-gray-200 text-gray-700'
                                    }`}
                                  >
                                    {formatDate(recommendation.due_date)}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Kategori: {recommendation.category}
                              </p>
                            </div>
                            <Button 
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <ThumbsUp size={16} className="mr-2" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Ingen anbefalinger funnet for denne planen.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/insights')}
                className="bg-[#9b87f5] hover:bg-[#8a76e5]"
              >
                <CheckCircle2 size={16} className="mr-2" />
                Se dine innsikter
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarClock size={24} className="text-gray-500" />
            </div>
            <h2 className="text-lg font-medium mb-2">Ingen aktiv plan</h2>
            <p className="text-gray-500 text-center mb-6">
              Du har ingen aktiv helseplan for øyeblikket.
            </p>
            <Button 
              onClick={() => createDefaultPlan()}
              className="bg-[#9b87f5] hover:bg-[#8a76e5]"
            >
              <Plus size={16} className="mr-2" />
              Opprett standard plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlan;
