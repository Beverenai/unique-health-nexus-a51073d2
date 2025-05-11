
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface WeekChartProps {
  lastWeekCheckIns: any[];
}

const WeekChart: React.FC<WeekChartProps> = ({ lastWeekCheckIns }) => {
  return (
    <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center">
          <LineChart size={18} className="mr-2 text-[#9b87f5]" />
          <span>7-dagers trend</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={lastWeekCheckIns}>
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                domain={[0, 10]}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="mood" 
                name="Humør" 
                stroke="#9b87f5" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                name="Energi" 
                stroke="#f59b23" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="sleep" 
                name="Søvn" 
                stroke="#4dabf5" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekChart;
