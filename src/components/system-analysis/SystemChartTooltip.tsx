
import React from 'react';
import { TooltipProps } from 'recharts';
import { ChartData } from './types';

// This is specifically a Recharts tooltip, not a Radix UI tooltip
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
      {data.description && (
        <p className="mt-1 text-gray-600 max-w-[200px]">{data.description}</p>
      )}
    </div>
  );
};

export default SystemChartTooltip;
