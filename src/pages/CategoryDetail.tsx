
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ArrowRight, ChevronRight } from 'lucide-react';
import { isPast, parseISO, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { tables } from '@/integrations/supabase/client-extensions';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { PlanRecommendation, UserPlan } from '@/types/database';

const CategoryDetail = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<PlanRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Define category icons mapping (same as in MyPlan.tsx)
  const categories = {
    'kosthold': <div className="text-green-500"><Apple size={20} /></div>,
    'bevegelse': <div className="text-blue-500"><Dumbbell size={20} /></div>,
    'tilskudd': <div className="text-purple-500"><Sparkles size={20} /></div>,
    'mental helse': <div className="text-amber-500"><Brain size={20} /></div>,
    'søvn': <div className="text-indigo-500"><Coffee size={20} /></div>,
    'stress': <div className="text-red-500"><Flame size={20} /></div>
  };
  
  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [categoryName, user]);
  
  const fetchRecommendations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // First get the active plan
      const { data: planData, error: planError } = await tables.userPlans()
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single() as any;
        
      if (planError) throw planError;
      
      if (planData) {
        // Then fetch all recommendations for this plan
        const { data: recData, error: recError } = await tables.planRecommendations()
          .select('*')
          .eq('plan_id', planData.id)
          .order('priority', { ascending: false }) as any;
          
        if (recError) throw recError;
        
        // Filter recommendations by category
        const filteredRecommendations = recData.filter((rec: PlanRecommendation) => 
          rec.category?.toLowerCase() === categoryName?.toLowerCase()
        );
        
        setRecommendations(filteredRecommendations);
      }
    } catch (error) {
      console.error('Error fetching category recommendations:', error);
      toast.error('Kunne ikke hente anbefalinger for kategorien');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPP', { locale: nb });
  };
  
  const isRecommendationOverdue = (recommendation: PlanRecommendation) => {
    if (!recommendation.due_date) return false;
    const dueDate = parseISO(recommendation.due_date);
    return isPast(dueDate);
  };
  
  const getCategoryIcon = () => {
    const key = Object.keys(categories).find(
      key => key.toLowerCase() === categoryName?.toLowerCase()
    );
    return key ? categories[key as keyof typeof categories] : null;
  };
  
  const formatCategoryName = () => {
    if (!categoryName) return '';
    
    // Capitalize the first letter
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
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
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-3"
            onClick={() => navigate('/my-plan')}
          >
            <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
            Tilbake
          </Button>
          
          <div className="flex items-center mb-2">
            {getCategoryIcon()}
            <h1 className="text-2xl font-bold ml-2">{formatCategoryName()}</h1>
          </div>
          
          <p className="text-gray-500 text-sm">
            Her er alle anbefalingene for {categoryName?.toLowerCase()}.
          </p>
        </div>
        
        {/* Recommendations List */}
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map(recommendation => (
              <div 
                key={recommendation.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100/20"
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
                  {recommendation.explanation && (
                    <p className="text-xs text-gray-500">
                      {recommendation.explanation}
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 ml-2"
                >
                  <ThumbsUp size={16} />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40">
              <p className="text-gray-500">
                Ingen anbefalinger funnet for {categoryName}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Need to include the lucide icons that we're using
import { Apple, Dumbbell, Sparkles, Brain, Coffee, Flame } from 'lucide-react';

export default CategoryDetail;
