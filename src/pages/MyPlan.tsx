
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  ListTodo, 
  ChevronRight, 
  MoreHorizontal,
  Heart,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { HealthIssue } from '@/types/supabase';
import { getHealthIssues } from '@/services';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Types for recommendations
interface PlanItem {
  id: string;
  text: string;
  category: 'daily' | 'weekly' | 'longTerm';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  source?: string;
  dueDate?: string;
}

const MyPlan = () => {
  const navigate = useNavigate();
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'weekly' | 'longTerm'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        const issues = await getHealthIssues();
        setHealthIssues(issues);
        
        // Generate plan items from health issues
        const generatedItems: PlanItem[] = [];
        
        // Process recommendations from health issues
        issues.forEach(issue => {
          if (issue.recommendations) {
            issue.recommendations.forEach((rec, index) => {
              generatedItems.push({
                id: `${issue.id}-rec-${index}`,
                text: rec,
                category: index % 3 === 0 ? 'daily' : index % 3 === 1 ? 'weekly' : 'longTerm',
                priority: issue.load > 60 ? 'high' : issue.load > 30 ? 'medium' : 'low',
                completed: false,
                source: issue.name
              });
            });
          }
        });
        
        // Add some general health recommendations
        generatedItems.push({
          id: 'general-1',
          text: 'Drikk minst 2 liter vann daglig',
          category: 'daily',
          priority: 'medium',
          completed: false
        });
        
        generatedItems.push({
          id: 'general-2', 
          text: 'Få 20 minutter med dagslys om morgenen',
          category: 'daily',
          priority: 'medium',
          completed: false
        });
        
        generatedItems.push({
          id: 'general-3',
          text: 'Praktiser pusteøvelser i 5 minutter før leggetid',
          category: 'daily',
          priority: 'low',
          completed: false
        });
        
        setPlanItems(generatedItems);
      } catch (error) {
        console.error('Error loading health data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadHealthData();
  }, []);
  
  const toggleItemCompletion = (itemId: string) => {
    setPlanItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const getCompletionPercentage = () => {
    if (planItems.length === 0) return 0;
    const completed = planItems.filter(item => item.completed).length;
    return Math.round((completed / planItems.length) * 100);
  };
  
  const getFilteredItems = () => {
    if (activeFilter === 'all') return planItems;
    return planItems.filter(item => item.category === activeFilter);
  };
  
  const getWeekRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' }),
      end: endOfWeek.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
    };
  };
  
  const weekRange = getWeekRange();
  const filteredItems = getFilteredItems();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-10 pb-20">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-gray-500">Laster din plan...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-20 bg-gradient-to-b from-white to-[#F8F8FC]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-600"
            aria-label="Gå tilbake"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-medium text-gray-800">Min helseplan</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </motion.div>
        
        {/* Progress overview */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium text-gray-800">Total fremgang</h2>
                <div className="text-sm font-medium text-[#9b87f5]">{getCompletionPercentage()}%</div>
              </div>
              
              <Progress value={getCompletionPercentage()} className="h-2 mb-4" />
              
              <div className="text-sm text-gray-600">
                {planItems.filter(item => item.completed).length} av {planItems.length} anbefalinger utført
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Filters */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center space-x-2 pb-1 overflow-x-auto scrollbar-hide"
        >
          <Button 
            variant={activeFilter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('all')}
            className={activeFilter === 'all' ? "bg-[#9b87f5] hover:bg-[#8a75e3]" : ""}
          >
            Alle
          </Button>
          <Button 
            variant={activeFilter === 'daily' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('daily')}
            className={activeFilter === 'daily' ? "bg-[#9b87f5] hover:bg-[#8a75e3]" : ""}
          >
            <Calendar size={14} className="mr-1" />
            Daglige
          </Button>
          <Button 
            variant={activeFilter === 'weekly' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('weekly')}
            className={activeFilter === 'weekly' ? "bg-[#9b87f5] hover:bg-[#8a75e3]" : ""}
          >
            <ListTodo size={14} className="mr-1" />
            Ukentlige
          </Button>
          <Button 
            variant={activeFilter === 'longTerm' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('longTerm')}
            className={activeFilter === 'longTerm' ? "bg-[#9b87f5] hover:bg-[#8a75e3]" : ""}
          >
            <Heart size={14} className="mr-1" />
            Langsiktige
          </Button>
        </motion.div>
        
        {/* Week range if showing weekly items */}
        {activeFilter === 'weekly' && (
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="text-sm text-gray-500">
              {weekRange.start} - {weekRange.end}
            </div>
            <Button variant="ghost" size="sm" className="text-[#9b87f5] p-0 h-auto">
              Se kalender
              <ChevronRight size={14} className="ml-0.5" />
            </Button>
          </motion.div>
        )}
        
        {/* Tasks list */}
        <motion.div variants={itemVariants} className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Ingen anbefalinger funnet for dette filteret
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id}
                className={`bg-white border ${item.completed ? 'border-green-100 bg-green-50/40' : 'border-gray-100'} shadow-sm rounded-lg p-4`}
              >
                <div className="flex items-center mb-1">
                  <button
                    onClick={() => toggleItemCompletion(item.id)}
                    className={`flex-shrink-0 h-5 w-5 rounded-full ${
                      item.completed ? 'bg-green-500 text-white' : 'bg-gray-100'
                    } flex items-center justify-center mr-3`}
                  >
                    {item.completed && <CheckCircle size={14} />}
                  </button>
                  
                  <span 
                    className={`flex-1 font-medium ${
                      item.completed ? 'text-green-700 line-through decoration-green-500/30' : 'text-gray-800'
                    }`}
                  >
                    {item.text}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleItemCompletion(item.id)}>
                        {item.completed ? 'Merk som ikke fullført' : 'Merk som fullført'}
                      </DropdownMenuItem>
                      {item.source && (
                        <DropdownMenuItem onClick={() => navigate(`/issue/${item.source}`)}>
                          Se relatert helseproblem
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Sett påminnelse</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {item.source && (
                  <div className="ml-8 text-xs text-gray-500">
                    Relatert til: <span className="text-[#9b87f5]">{item.source}</span>
                  </div>
                )}
                
                {item.category !== 'daily' && (
                  <div className="ml-8 mt-1 flex items-center">
                    <div className={`px-2 py-0.5 text-xs rounded-full ${
                      item.priority === 'high' 
                        ? 'bg-red-50 text-red-600 border border-red-100' 
                        : item.priority === 'medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {item.priority === 'high' ? 'Høy prioritet' : item.priority === 'medium' ? 'Medium prioritet' : 'Lav prioritet'}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </motion.div>
        
        {/* Add new recommendation button */}
        <motion.div 
          variants={itemVariants}
          className="fixed bottom-20 right-6"
        >
          <Button className="rounded-full h-12 w-12 bg-[#9b87f5] hover:bg-[#8a75e3] shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MyPlan;
