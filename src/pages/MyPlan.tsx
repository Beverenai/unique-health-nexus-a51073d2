import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowLeft, Plus, Clock, Calendar, ListChecks, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { tables } from '@/integrations/supabase/client-extensions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { UserPlan, PlanRecommendation } from '@/types/database';

interface Plan extends UserPlan {}
interface Recommendation extends PlanRecommendation {}

const getIconForCategory = (category: string) => {
  const categoryIconMap: Record<string, React.ReactNode> = {
    'Kosthold': <div className="bg-green-100 p-2 rounded-full"><Utensils size={16} className="text-green-600" /></div>,
    'Mosjon': <div className="bg-blue-100 p-2 rounded-full"><Activity size={16} className="text-blue-600" /></div>,
    'Søvn': <div className="bg-purple-100 p-2 rounded-full"><Moon size={16} className="text-purple-600" /></div>,
    'Stress': <div className="bg-amber-100 p-2 rounded-full"><Wind size={16} className="text-amber-600" /></div>,
    'Tilskudd': <div className="bg-red-100 p-2 rounded-full"><Pills size={16} className="text-red-600" /></div>,
    'Hydration': <div className="bg-cyan-100 p-2 rounded-full"><Droplets size={16} className="text-cyan-600" /></div>,
    'Healing': <div className="bg-pink-100 p-2 rounded-full"><Heart size={16} className="text-pink-600" /></div>,
  };
  
  return categoryIconMap[category] || <div className="bg-gray-100 p-2 rounded-full"><ListChecks size={16} className="text-gray-600" /></div>;
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colorMap: Record<string, string> = {
    'high': 'bg-red-100 text-red-700',
    'medium': 'bg-amber-100 text-amber-700',
    'low': 'bg-green-100 text-green-700'
  };
  
  return (
    <Badge variant="outline" className={`bg-gray-100 text-gray-700`}>
      {priority === 'high' ? 'Høy' : priority === 'medium' ? 'Middels' : 'Lav'}
    </Badge>
  );
};

const MyPlan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('all');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user plans directly from Supabase
        const { data: plansData, error: plansError } = await (supabase
          .from('user_plans') as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (plansError) throw plansError;
        setPlans(plansData as unknown as Plan[] || []);
        
        // If we have plans, fetch recommendations for the first plan
        if (plansData && plansData.length > 0) {
          const { data: recsData, error: recsError } = await (supabase
            .from('plan_recommendations') as any)
            .select('*')
            .eq('plan_id', plansData[0].id)
            .order('created_at', { ascending: false });
          
          if (recsError) throw recsError;
          setRecommendations(recsData as unknown as Recommendation[] || []);
          applyFilters(recsData as unknown as Recommendation[] || [], currentTab, categoryFilter);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Kunne ikke hente planer');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [user, currentTab, categoryFilter]);
  
  const applyFilters = (recs: Recommendation[], tab: string, category: string | null) => {
    let filtered = [...recs];
    
    // Apply tab filter
    if (tab === 'active') {
      filtered = filtered.filter(rec => !rec.completed);
    } else if (tab === 'completed') {
      filtered = filtered.filter(rec => rec.completed);
    }
    
    // Apply category filter if selected
    if (category) {
      filtered = filtered.filter(rec => rec.category === category);
    }
    
    setFilteredRecommendations(filtered);
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    applyFilters(recommendations, value, categoryFilter);
  };
  
  const handleCategoryFilter = (category: string | null) => {
    setCategoryFilter(category);
    applyFilters(recommendations, currentTab, category);
  };
  
  const toggleRecommendation = async (rec: Recommendation) => {
    try {
      const updatedRec = {
        ...rec,
        completed: !rec.completed,
        completed_at: !rec.completed ? new Date().toISOString() : null
      };
      
      const { error } = await (supabase
        .from('plan_recommendations') as any)
        .update({
          completed: updatedRec.completed,
          completed_at: updatedRec.completed_at
        })
        .eq('id', rec.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedRecs = recommendations.map(r => 
        r.id === rec.id ? updatedRec : r
      );
      setRecommendations(updatedRecs);
      applyFilters(updatedRecs, currentTab, categoryFilter);
      
      toast.success(
        updatedRec.completed 
          ? 'Markert som fullført!' 
          : 'Markert som ikke fullført'
      );
    } catch (error) {
      console.error('Error toggling recommendation:', error);
      toast.error('Kunne ikke oppdatere anbefalingen');
    }
  };
  
  // Extract unique categories for filter
  const uniqueCategories = [...new Set(recommendations.map(rec => rec.category))];
  
  // Get completed percentage
  const totalCount = recommendations.length;
  const completedCount = recommendations.filter(rec => rec.completed).length;
  const completedPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  if (plans.length === 0) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Calendar size={30} className="text-gray-500" />
        </div>
        <h2 className="text-xl font-medium mb-2">Ingen helseplan</h2>
        <p className="text-gray-500 text-center mb-6">
          Det ser ut til at du ikke har en aktiv helseplan enda.
        </p>
        <Button className="bg-[#9b87f5] hover:bg-[#8a76e5]" onClick={() => navigate('/')}>
          Gå til dashboard
        </Button>
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
            Dine personlige helseanbefalinger
          </p>
        </header>
        
        <div className="space-y-6">
          {/* Plan overview card */}
          <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="font-semibold">{plans[0]?.title || 'Min helseplan'}</h2>
                  <p className="text-sm text-gray-500">
                    Opprettet {format(new Date(plans[0]?.created_at || new Date()), 'PPP', { locale: nb })}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#9b87f5]/10 flex items-center justify-center">
                  <Calendar size={20} className="text-[#9b87f5]" />
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Fullført</span>
                  <span className="text-sm font-medium">{completedPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#9b87f5] h-2 rounded-full"
                    style={{ width: `${completedPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{completedCount} av {totalCount} anbefalinger</span>
                  <span className="text-xs text-gray-500">
                    Sist oppdatert {format(new Date(), 'd. MMM', { locale: nb })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recommendation tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Tabs value={currentTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="active">Aktive</TabsTrigger>
                  <TabsTrigger value="completed">Fullført</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleCategoryFilter(null)}>
                    Alle kategorier
                  </DropdownMenuItem>
                  {uniqueCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="space-y-3">
              {filteredRecommendations.length > 0 ? (
                filteredRecommendations.map((rec) => (
                  <RecommendationCard 
                    key={rec.id} 
                    recommendation={rec} 
                    toggleComplete={() => toggleRecommendation(rec)} 
                  />
                ))
              ) : (
                <Card className="bg-gray-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <ListChecks size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">
                      {categoryFilter 
                        ? `Ingen anbefalinger i kategorien "${categoryFilter}"` 
                        : currentTab === 'active' 
                          ? 'Ingen aktive anbefalinger' 
                          : currentTab === 'completed' 
                            ? 'Ingen fullførte anbefalinger' 
                            : 'Ingen anbefalinger å vise'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Add recommendation button */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => toast.info('Denne funksjonen kommer snart!')}
            >
              <Plus size={16} />
              Legg til egen anbefaling
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  toggleComplete: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, toggleComplete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/80 backdrop-blur border-gray-100/20 shadow-sm">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getIconForCategory(recommendation.category)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={`font-medium ${recommendation.completed ? 'line-through text-gray-400' : ''}`}>
                    {recommendation.text}
                  </h3>
                  <button
                    className={`flex-shrink-0 h-6 w-6 rounded-full border ${
                      recommendation.completed 
                        ? 'bg-[#9b87f5] border-[#9b87f5] text-white' 
                        : 'border-gray-300 bg-white'
                    } flex items-center justify-center transition-colors`}
                    onClick={toggleComplete}
                  >
                    {recommendation.completed && <Check size={14} />}
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-gray-100 text-gray-700">
                    {recommendation.category}
                  </Badge>
                  <PriorityBadge priority={recommendation.priority} />
                  
                  {recommendation.due_date && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {format(new Date(recommendation.due_date), 'dd.MM.yyyy')}
                    </div>
                  )}
                </div>
                
                {recommendation.completed && recommendation.completed_at && (
                  <div className="text-xs text-gray-500 mt-1">
                    Fullført {format(new Date(recommendation.completed_at), 'PPP', { locale: nb })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Add missing icon components
const Activity = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const Moon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const Wind = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
  </svg>
);

const Utensils = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
    <path d="M7 2v20"></path>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
  </svg>
);

const Pills = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="9" r="7"></circle>
    <path d="m15 15 6 6"></path>
  </svg>
);

const Droplets = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
  </svg>
);

const Heart = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>
);

export default MyPlan;
