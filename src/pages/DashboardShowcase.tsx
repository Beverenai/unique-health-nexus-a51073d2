
import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { motion } from 'framer-motion';

const DashboardShowcase: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50"
    >
      <Dashboard />
    </motion.div>
  );
};

export default DashboardShowcase;
