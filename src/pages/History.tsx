
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
import { getHistoricalCoherenceData } from '@/services/supabaseService';
import NavigationBar from '@/components/NavigationBar';
import ChatButton from '@/components/ChatButton';

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

  const handleScanClick = (scanId: string) => {
    // In a real app, this would navigate to scan details
    // For now, we'll just navigate to the homepage
    navigate(`/?scan=${scanId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laster historikk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-20 pt-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Historikk</h1>
        <p className="text-gray-500">Din koherens-score over tid</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Koherens-progresjon</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer 
              config={{
                score: { theme: { light: '#4CAF50', dark: '#4CAF50' } }
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--color-score)" 
                    strokeWidth={3} 
                    dot={{ stroke: "var(--color-score)", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "var(--color-score)", strokeWidth: 2 }}
                  />
                  <CartesianGrid stroke="#f5f5f5" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center py-8">
              <p>Ingen historiske data tilgjengelig ennå.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-medium mb-4">Tidligere skanninger</h2>
      
      <div className="space-y-4">
        {historicalData.map((scan) => (
          <Card 
            key={scan.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleScanClick(scan.id)}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{format(new Date(scan.date), 'dd. MMMM yyyy')}</p>
                <p className="text-sm text-gray-500">Koherens-score: {scan.score}%</p>
              </div>
              <div 
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${getScoreColor(scan.score)}20` }}
              >
                <span className="font-bold text-lg" style={{ color: getScoreColor(scan.score) }}>
                  {scan.score}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ChatButton />
      <NavigationBar />
    </div>
  );
};

export default History;
