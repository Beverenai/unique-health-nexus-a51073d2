
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface SystemChartProps {
  data: ChartData[];
}

const SystemChart: React.FC<SystemChartProps> = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
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
          <Tooltip 
            formatter={(value) => [`${value}% belastning`, entry.name]}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid rgba(155, 135, 245, 0.2)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SystemChart;
