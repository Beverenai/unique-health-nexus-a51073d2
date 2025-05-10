
import React from 'react';
import { TooltipProps } from 'recharts';
import { ChartData } from './types';

type SystemChartTooltipProps = TooltipProps<number, string> & {
  data: ChartData[];
};

const SystemChartTooltip: React.FC<SystemChartTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload as ChartData;
  
  return (
    <div className="bg-white/95 px-3 py-2 rounded-lg border border-[#9b87f5]/20 shadow-md text-xs">
      <p className="font-medium">{data.name}</p>
      <p className="text-[#9b87f5]">{data.value}% belastning</p>
    </div>
  );
};

export default SystemChartTooltip;
