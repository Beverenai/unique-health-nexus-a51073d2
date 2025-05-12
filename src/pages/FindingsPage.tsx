
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HealthIssue } from '@/types/supabase';
import { ArrowRight, Filter, ArrowDownAZ, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getHealthIssues } from '@/services/healthIssueService';
import { ScrollArea } from '@/components/ui/scroll-area';
import IssueCard from '@/components/IssueCard';

const FindingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'load' | 'name'>('load');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const issues = await getHealthIssues();
        setHealthIssues(issues);
      } catch (error) {
        console.error('Error fetching health issues:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Sort health issues based on current sort order
  const sortedIssues = [...healthIssues].sort((a, b) => {
    if (sortOrder === 'load') {
      return b.load - a.load;  // Sort by load (high to low)
    } else {
      return a.name.localeCompare(b.name);  // Sort alphabetically
    }
  });
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'load' ? 'name' : 'load');
  };
  
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ScrollArea className="h-full pb-0">
        <main className="container mx-auto px-4 py-4 max-w-lg">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl font-semibold">Alle helsefunn</h1>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              {healthIssues.length} funn fra analysen
            </p>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
              >
                <Filter size={14} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={toggleSortOrder}
              >
                <ArrowDownAZ size={14} />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#9b87f5] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedIssues.map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue}
                />
              ))}
            </div>
          )}
        </main>
      </ScrollArea>
    </div>
  );
};

export default FindingsPage;
