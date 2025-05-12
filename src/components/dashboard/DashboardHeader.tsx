
import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader: React.FC = () => {
  return (
    <motion.header 
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>
      <p className="text-gray-500">
        Velkommen tilbake! Her er en oversikt over din helse.
      </p>
    </motion.header>
  );
};

export default DashboardHeader;
