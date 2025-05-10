
import React from 'react';
import { motion } from 'framer-motion';

export interface Connection {
  from: string;
  to: string;
  description: string;
}

interface ConnectionListProps {
  connections: Connection[];
}

const ConnectionList: React.FC<ConnectionListProps> = ({ connections }) => {
  if (connections.length === 0) return null;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      } 
    }
  };
  
  return (
    <motion.div 
      className="pt-4 border-t border-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h4 
        className="text-sm font-semibold mb-4 text-gray-800 flex items-center"
        variants={itemVariants}
      >
        <span className="w-1 h-4 bg-[#9b87f5] rounded-full mr-2"></span>
        Systemforbindelser
      </motion.h4>
      
      <div className="space-y-3">
        {connections.map((connection, idx) => (
          <motion.div 
            key={idx} 
            className="flex items-start p-3.5 bg-white/80 rounded-lg shadow-sm border border-gray-50 hover:shadow-md transition-all"
            variants={itemVariants}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2"></div>
            <div>
              <span className="text-gray-800">
                <span className="font-medium text-[#9b87f5]">{connection.from}</span>
                <span className="mx-1.5 text-gray-400">→</span>
                <span className="font-medium text-[#9b87f5]">{connection.to}:</span> 
                <span className="ml-1">{connection.description}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-4 text-center" 
        variants={itemVariants}
      >
        <motion.button 
          className="text-xs text-[#9b87f5] font-medium hover:underline"
          whileHover={{ y: -2 }}
        >
          Lær mer om systemforbindelsene
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ConnectionList;
