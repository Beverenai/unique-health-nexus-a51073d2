
import React from 'react';
import { motion } from 'framer-motion';

interface HomeHeaderProps {
  userName: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName }) => {
  return (
    <motion.div
      className="text-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-playfair font-semibold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        Hei, {userName}
      </h1>
      <p className="text-gray-500 text-sm">Slik ser helsen din ut i dag</p>
    </motion.div>
  );
};

export default HomeHeader;
