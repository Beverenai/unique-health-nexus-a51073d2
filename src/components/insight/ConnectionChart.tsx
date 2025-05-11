
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { HealthIssue } from '@/types/supabase';
import { motion } from 'framer-motion';

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
  
  // Custom colors with the app's color palette
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div 
      className="w-full h-64 my-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h4 className="text-center text-sm font-medium mb-3 text-gray-600">Belastningsnivå fordeling</h4>
      <ResponsiveContainer width="100%" height="85%">
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
            animationDuration={800}
            animationBegin={200}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${entry.id}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Belastning']}
            labelFormatter={(name) => `${name}`}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid rgba(155, 135, 245, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ConnectionChart;
