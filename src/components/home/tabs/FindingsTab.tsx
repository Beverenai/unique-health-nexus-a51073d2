
import React from 'react';
import { motion } from 'framer-motion';
import { HealthIssue } from '@/types/supabase';
import { HealthIssuesCarousel } from '@/components/carousel';
import { ArrowRight, Filter, ArrowDownAZ } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FindingsTabProps {
  healthIssues: HealthIssue[];
}

const FindingsTab: React.FC<FindingsTabProps> = ({ healthIssues }) => {
  const navigate = useNavigate();
  const sortedIssues = [...healthIssues].sort((a, b) => b.load - a.load);
  
  return (
    <motion.div
      className="space-y-6 pt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Alle funn ({healthIssues.length})</h2>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Filter size={14} />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowDownAZ size={14} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedIssues.map((issue) => (
          <motion.div
            key={issue.id}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => navigate(`/issue/${issue.id}`)}
            className="bg-white/70 backdrop-blur-sm shadow-sm border border-white/40 rounded-xl p-4 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">{issue.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{issue.description}</p>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium 
                ${issue.load >= 60 ? 'bg-red-50 text-red-600' : 
                 issue.load >= 30 ? 'bg-amber-50 text-amber-600' : 
                 'bg-green-50 text-green-600'}`}>
                {issue.load}% belastning
              </div>
            </div>
            
            <div className="flex justify-end mt-3">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-[#9b87f5]">
                Se detaljer <ArrowRight size={12} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FindingsTab;
