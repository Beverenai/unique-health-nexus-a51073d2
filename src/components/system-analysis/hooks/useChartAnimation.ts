
import { Variants } from 'framer-motion';

/**
 * Custom hook to provide animation variants for charts
 */
export const useChartAnimation = () => {
  const containerVariants: Variants = {
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

  return { containerVariants };
};
