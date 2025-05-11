
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Connection } from './ConnectionList';
import { CircleHelp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SystemConnectionsCardProps {
  connections: Connection[];
}

const SystemConnectionsCard: React.FC<SystemConnectionsCardProps> = ({ connections }) => {
  if (connections.length === 0) return null;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <span>Systemsammenhenger</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleHelp className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Sammenhenger mellom ulike systemer i kroppen din basert på skanningen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {connections.map((connection, idx) => (
              <motion.div 
                key={idx} 
                className="flex items-start p-3.5 bg-white/80 rounded-lg shadow-sm border border-gray-50 hover:shadow-md transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              >
                <div className="flex items-center flex-1 gap-4">
                  <div className="flex-shrink-0 min-w-fit">
                    <div className="px-3 py-1.5 bg-[#9b87f5]/10 rounded-lg text-xs font-medium text-[#9b87f5]">
                      {connection.from}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-gray-400">→</div>
                  
                  <div className="flex-shrink-0 min-w-fit">
                    <div className="px-3 py-1.5 bg-emerald-50 rounded-lg text-xs font-medium text-emerald-700">
                      {connection.to}
                    </div>
                  </div>
                  
                  <div className="hidden md:block border-l border-gray-200 pl-3 text-sm text-gray-600">
                    {connection.description}
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="md:hidden pt-2 space-y-3">
              {connections.map((connection, idx) => (
                <div key={`desc-${idx}`} className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">{connection.from} → {connection.to}:</span> {connection.description}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemConnectionsCard;
