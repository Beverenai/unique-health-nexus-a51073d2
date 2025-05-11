
import React from 'react';
import { motion } from 'framer-motion';
import { HealthIssue } from '@/types/supabase';
import TabViewItem from '@/components/ui/tab-view-item';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface OverviewTabProps {
  healthIssues: HealthIssue[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ healthIssues }) => {
  const navigate = useNavigate();
  
  // Only show top 5 issues for the overview
  const topIssues = [...healthIssues].sort((a, b) => b.load - a.load).slice(0, 5);
  
  return (
    <div className="space-y-5">
      <TabViewItem isActive={true}>
        <Card className="bg-white border-0 shadow-sm rounded-lg">
          <CardHeader className="pb-0">
            <h3 className="text-base font-medium text-gray-800">Systembelastninger</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                  onClick={() => navigate(`/issue/${issue.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">{issue.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{issue.description}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`px-2 py-0.5 ${
                          issue.load > 60 
                            ? 'bg-red-50 text-red-500 border-red-100' 
                            : issue.load > 40 
                              ? 'bg-amber-50 text-amber-500 border-amber-100' 
                              : 'bg-green-50 text-green-500 border-green-100'
                        }`}
                      >
                        {issue.load}%
                      </Badge>
                      <ArrowUpRight size={16} className="ml-2 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabViewItem>
      
      <TabViewItem isActive={true} transitionDelay={0.1}>
        <Card className="bg-white border-0 shadow-sm rounded-lg">
          <CardHeader className="pb-0">
            <h3 className="text-base font-medium text-gray-800">Helhetsvurdering</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-sm">
              Din kropp viser tegn på belastning i flere systemer, med størst fokus på fordøyelse og nervesystem. 
              Følg anbefalingene for hvert problemområde for å forbedre helsen din.
            </p>
            
            <motion.button 
              className="w-full mt-4 py-2.5 flex items-center justify-center bg-[#9b87f5]/5 hover:bg-[#9b87f5]/10 text-[#9b87f5] font-medium rounded-lg transition-all"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => navigate('/insights')}
            >
              Se detaljert analyse <ArrowUpRight size={14} className="ml-1" />
            </motion.button>
          </CardContent>
        </Card>
      </TabViewItem>
    </div>
  );
};

export default OverviewTab;
