
import React from 'react';
import { motion } from 'framer-motion';
import { type Checkin } from '@/hooks/useDashboardData';
import { Activity, TrendingUp, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DashboardSummaryProps {
  latestCheckin: Checkin | null;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ latestCheckin }) => {
  const navigate = useNavigate();
  
  // Calculate a health score based on check-in data or use a default
  const calculateHealthScore = (): number => {
    if (!latestCheckin) return 65; // Default value

    // Simple algorithm - average of mood, energy, and sleep with equal weights
    const sum = latestCheckin.mood + latestCheckin.energy_level + latestCheckin.sleep_quality;
    // Convert to percentage (assuming each score is 0-10)
    return Math.round((sum / 30) * 100); 
  };

  const healthScore = calculateHealthScore();
  
  // Define status color based on score
  const getStatusColor = (score: number) => {
    if (score < 40) return 'text-red-500 bg-red-50';
    if (score < 70) return 'text-amber-500 bg-amber-50';
    return 'text-green-500 bg-green-50';
  };
  
  // Get status message
  const getStatusMessage = (score: number) => {
    if (score < 40) return 'Krever oppmerksomhet';
    if (score < 70) return 'Moderat balanse';
    return 'God balanse';
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Health Status */}
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="font-medium text-lg text-gray-900">Dagens helsetilstand</h3>
              <span className="text-sm text-gray-500">
                {latestCheckin ? 'Basert på siste dagslogg' : 'Ingen ny dagslogg i dag'}
              </span>
            </div>
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(healthScore)}`}>
              {getStatusMessage(healthScore)}
            </div>
          </motion.div>
          
          {/* Health Score Progress */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Din helsebalanse</span>
              <span className="text-sm font-semibold">{healthScore}%</span>
            </div>
            <Progress 
              value={healthScore} 
              className="h-2.5 bg-gray-100" 
            />
          </motion.div>
          
          {/* Health Metrics */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-3 gap-3 mt-4"
          >
            <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
              <div className="bg-[#9b87f5]/10 p-2 rounded-full mb-2">
                <Heart size={18} className="text-[#9b87f5]" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {latestCheckin ? `${latestCheckin.mood}/10` : '–'}
              </span>
              <span className="text-xs text-gray-500">Humør</span>
            </div>
            
            <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
              <div className="bg-[#9b87f5]/10 p-2 rounded-full mb-2">
                <TrendingUp size={18} className="text-[#9b87f5]" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {latestCheckin ? `${latestCheckin.energy_level}/10` : '–'}
              </span>
              <span className="text-xs text-gray-500">Energi</span>
            </div>
            
            <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
              <div className="bg-[#9b87f5]/10 p-2 rounded-full mb-2">
                <Activity size={18} className="text-[#9b87f5]" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {latestCheckin ? `${latestCheckin.sleep_quality}/10` : '–'}
              </span>
              <span className="text-xs text-gray-500">Søvn</span>
            </div>
          </motion.div>
          
          {/* Action Button */}
          <motion.div variants={itemVariants}>
            <Button 
              variant="outline"
              className="w-full mt-2 bg-white hover:bg-gray-50"
              onClick={() => navigate('/checkin')}
            >
              {latestCheckin ? 'Oppdater dagslogg' : 'Registrer dagslogg'}
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;
