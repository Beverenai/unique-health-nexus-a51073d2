
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getHistoricalCoherenceData } from '@/services/cohereceService';
import ChatButton from '@/components/ChatButton';
import CoherenceRing from '@/components/CoherenceRing';
import { CalendarClock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ScanTimelineItem from '@/components/history/ScanTimelineItem';

interface HistoricalScan {
  id: string;
  date: string;
  score: number;
  status: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [historicalData, setHistoricalData] = useState<HistoricalScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const data = await getHistoricalCoherenceData();
        setHistoricalData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#4CAF50';
    if (score >= 50) return '#FFC107';
    return '#FF5252';
  };

  // Format data for chart
  const chartData = historicalData.map(item => ({
    date: format(new Date(item.date), 'dd.MM'),
    score: item.score,
    color: getScoreColor(item.score),
    scanId: item.id
  }));

  const handleNewScan = () => {
    // In a real app, this would navigate to the scanning page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laster historikk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-24 pt-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Historikk</h1>
        <p className="text-gray-500">Din koherens-score over tid</p>
      </header>

      {historicalData.length > 1 && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Utvikling over tid</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                score: { theme: { light: '#9b87f5', dark: '#9b87f5' } }
              }}
              className="h-48"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--color-score)" 
                    strokeWidth={3} 
                    dot={{ stroke: "var(--color-score)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "var(--color-score)", strokeWidth: 2 }}
                  />
                  <CartesianGrid stroke="#f5f5f5" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Dine skanninger</h2>
          <Button 
            onClick={handleNewScan}
            size="sm" 
            className="bg-[#9b87f5] hover:bg-[#8b77e5]"
          >
            Ny skanning
          </Button>
        </div>

        {historicalData.length === 0 ? (
          // Empty state
          <EmptyHistoryState onScan={handleNewScan} />
        ) : historicalData.length === 1 ? (
          // Single scan state
          <SingleScanState scan={historicalData[0]} onScan={handleNewScan} />
        ) : (
          // Timeline with multiple scans
          <Card className="overflow-hidden border-gray-100">
            <CardContent className="p-0">
              <ScrollArea className="pb-4 pt-4" orientation="horizontal">
                <div className="flex space-x-6 px-6 pb-2 min-w-max">
                  {historicalData.map((scan, index) => (
                    <ScanTimelineItem 
                      key={scan.id} 
                      scan={scan} 
                      index={index} 
                      totalScans={historicalData.length}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      <ChatButton />
    </div>
  );
};

const EmptyHistoryState: React.FC<{ onScan: () => void }> = ({ onScan }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
    >
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-[#9b87f5]/10 mb-4">
        <CalendarClock className="h-8 w-8 text-[#9b87f5]" />
      </div>
      <h3 className="text-xl font-medium mb-2">Ingen skanninger ennå</h3>
      <p className="text-gray-500 mb-6">
        Du har ikke gjennomført noen skanninger. Ta din første skanning for å begynne å spore din helseutvikling.
      </p>
      <Button 
        onClick={onScan} 
        className="bg-[#9b87f5] hover:bg-[#8b77e5]"
      >
        Start din første skanning
      </Button>
    </motion.div>
  );
};

const SingleScanState: React.FC<{ scan: HistoricalScan; onScan: () => void }> = ({ scan, onScan }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1 flex flex-col items-center md:items-start mb-6 md:mb-0">
          <CoherenceRing score={scan.score} size="md" showText={true} />
          <p className="mt-4 font-medium text-center md:text-left">
            {format(new Date(scan.date), 'd. MMMM yyyy')}
          </p>
        </div>
        
        <div className="flex-1 md:ml-6">
          <div className="flex items-start mb-3">
            <AlertCircle className="text-amber-500 mr-2 h-5 w-5" />
            <p className="text-gray-700">
              For å få bedre innsikt og se din utvikling over tid, anbefaler vi å ta en ny skanning.
            </p>
          </div>
          <Button 
            onClick={onScan}
            className="w-full mt-2 bg-[#9b87f5] hover:bg-[#8b77e5]"
          >
            Ta en ny skanning
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default History;
