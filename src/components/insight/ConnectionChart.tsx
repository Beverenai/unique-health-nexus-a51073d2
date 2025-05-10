
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { HealthIssue } from '@/types/supabase';

interface ConnectionChartProps {
  healthIssues: HealthIssue[];
}

const ConnectionChart: React.FC<ConnectionChartProps> = ({ healthIssues }) => {
  const sortedIssues = [...healthIssues].sort((a, b) => b.load - a.load);
  
  // Process data for the chart - limit to top 5 issues for better visualization
  const chartData = sortedIssues.slice(0, 5).map((issue) => ({
    name: issue.name,
    value: issue.load,
    id: issue.id,
  }));
  
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF'];
  
  return (
    <div className="w-full h-64 my-4">
      <h4 className="text-center text-sm font-medium mb-2 text-gray-600">Belastningsnivå fordeling</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Belastning']}
            labelFormatter={(name) => `${name}`}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center mt-2 gap-2">
        {chartData.map((entry, index) => (
          <div key={`legend-${entry.id}`} className="flex items-center">
            <div 
              className="w-3 h-3 mr-1 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionChart;
