
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
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-medium">Systembelastninger</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-3 bg-white/70 rounded-xl border border-gray-100 hover:border-[#9b87f5]/30 hover:bg-white/90 transition-all cursor-pointer"
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
                        className={`px-2.5 py-1 ${issue.load > 60 ? 'bg-red-50 text-red-500' : issue.load > 40 ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}
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
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-medium">Helhetsvurdering</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Din kropp viser tegn på belastning i flere systemer, med størst fokus på fordøyelse og nervesystem. 
              Følg anbefalingene for hvert problemområde for å forbedre helsen din.
            </p>
            
            <motion.button 
              className="w-full mt-4 py-2.5 flex items-center justify-center bg-[#9b87f5]/10 hover:bg-[#9b87f5]/20 text-[#9b87f5] font-medium rounded-xl transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
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
