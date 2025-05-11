
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';
import { useDailyReport } from '@/hooks/useDailyReport';
import ReportHeader from '@/components/daily-report/ReportHeader';
import TodaySummary from '@/components/daily-report/TodaySummary';
import WeekChart from '@/components/daily-report/WeekChart';
import InsightsSection from '@/components/daily-report/InsightsSection';
import EmptyState from '@/components/daily-report/EmptyState';

const DailyReport = () => {
  const navigate = useNavigate();
  const { checkIns, lastWeekCheckIns, loading, latestCheckIn } = useDailyReport();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 pt-6">
        <ReportHeader />
        
        {latestCheckIn ? (
          <div className="space-y-6">
            {/* Today's summary */}
            <TodaySummary checkIn={latestCheckIn} />
            
            {/* Chart for last 7 days */}
            <WeekChart lastWeekCheckIns={lastWeekCheckIns} />
            
            {/* Insights */}
            <InsightsSection checkIns={checkIns} />
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/checkin')}
                className="bg-[#9b87f5] hover:bg-[#8a76e5]"
              >
                <Calendar size={16} className="mr-2" />
                Ny dagslogg
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default DailyReport;
