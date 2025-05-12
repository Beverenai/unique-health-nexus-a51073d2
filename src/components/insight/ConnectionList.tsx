
import React from 'react';
import { motion } from 'framer-motion';

export interface Connection {
  from: string;
  to: string;
  description: string;
}

interface ConnectionListProps {
  connections: Connection[];
  className?: string;
}

const ConnectionList: React.FC<ConnectionListProps> = ({ connections, className = '' }) => {
  if (connections.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-gray-500 text-sm">Ingen systemsammenhenger funnet.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {connections.map((connection, index) => (
        <motion.div
          key={index}
          className="flex flex-col p-3 bg-white rounded-lg shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#9b87f5]/10 text-[#9b87f5] px-2 py-1 rounded text-xs font-medium">
              {connection.from}
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
              {connection.to}
            </div>
          </div>
          <p className="text-sm text-gray-700">{connection.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ConnectionList;
