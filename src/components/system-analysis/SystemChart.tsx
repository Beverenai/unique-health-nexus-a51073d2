
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { ChartData } from './types';
import { useChartAnimation } from './hooks/useChartAnimation';
import SystemChartTooltip from './SystemChartTooltip';

interface SystemChartProps {
  data: ChartData[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * A pie chart component that displays system load data
 */
const SystemChart: React.FC<SystemChartProps> = ({ data, size = 'md', className = '' }) => {
  const { containerVariants } = useChartAnimation();
  
  // Determine chart dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 'w-24', height: 'h-24', inner: 20, outer: 30 };
      case 'lg': return { width: 'w-40', height: 'h-40', inner: 30, outer: 50 };
      default: return { width: 'w-32', height: 'h-32', inner: 25, outer: 40 };
    }
  };
  
  const { width, height, inner, outer } = getDimensions();

  // Custom tooltip renderer
  const renderTooltip = (props: any) => {
    return <SystemChartTooltip {...props} data={data} />;
  };

  return (
    <motion.div
      className={`${width} ${height} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={inner}
            outerRadius={outer}
            paddingAngle={2}
            dataKey="value"
            animationBegin={300}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                strokeWidth={index === 0 ? 2 : 0}
                stroke={index === 0 ? "#fff" : "none"}
              />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SystemChart;
