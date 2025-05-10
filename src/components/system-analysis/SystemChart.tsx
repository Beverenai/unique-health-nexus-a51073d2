
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { ChartData } from './types';
import { useChartAnimation } from './hooks/useChartAnimation';
import SystemChartTooltip from './SystemChartTooltip';

interface SystemChartProps {
  data: ChartData[];
}

/**
 * A pie chart component that displays system load data
 */
const SystemChart: React.FC<SystemChartProps> = ({ data }) => {
  const { containerVariants } = useChartAnimation();

  // Custom tooltip renderer
  const renderTooltip = (props: any) => {
    return <SystemChartTooltip {...props} data={data} />;
  };

  return (
    <motion.div
      className="w-32 h-32"
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
            innerRadius={25}
            outerRadius={40}
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
