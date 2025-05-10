
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CoherenceRingProps {
  score: number;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const CoherenceRing: React.FC<CoherenceRingProps> = ({ 
  score, 
  message,
  size = 'lg', 
  showText = true,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Color assignments using modern color palette
  const getModernColor = (score: number): string => {
    if (score < 40) return '#EA384C'; // Red for high load/low score
    if (score < 60) return '#F7D154'; // Yellow for moderate load
    return '#77C17E'; // Green for low load/high score
  };
  
  const getModernTextColor = (score: number): string => {
    if (score < 40) return 'text-[#EA384C]'; 
    if (score < 60) return 'text-[#F7D154]';
    return 'text-[#77C17E]';
  };
  
  const getStatusLabel = (score: number): string => {
    if (score < 40) return 'Krever oppmerksomhet';
    if (score < 60) return 'Moderat';
    return 'Balansert';
  };
  
  const color = getModernColor(score);
  const textColorClass = getModernTextColor(score);
  const statusLabel = getStatusLabel(score);
  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56'
  };
  
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create subtle gradient for background ring
    const bgGradient = ctx.createLinearGradient(0, 0, 0, rect.height);
    bgGradient.addColorStop(0, 'rgba(228, 228, 231, 0.4)');
    bgGradient.addColorStop(1, 'rgba(228, 228, 231, 0.2)');
    
    // Draw background ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 15;
    ctx.strokeStyle = bgGradient;
    ctx.stroke();
    
    // Create subtle gradient for progress ring
    const progressGradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    
    if (score < 40) {
      // Red gradient
      progressGradient.addColorStop(0, '#EA384C');
      progressGradient.addColorStop(1, '#FF6B81');
    } else if (score < 60) {
      // Yellow gradient
      progressGradient.addColorStop(0, '#F7D154');
      progressGradient.addColorStop(1, '#FFE082');
    } else {
      // Green gradient
      progressGradient.addColorStop(0, '#77C17E');
      progressGradient.addColorStop(1, '#A5D6A7');
    }
    
    // Draw progress ring
    const progressAngle = (score / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, progressAngle - Math.PI / 2);
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = progressGradient;
    ctx.stroke();
    
    // Draw glow effect
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, progressAngle - Math.PI / 2);
    ctx.lineWidth = 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.filter = `blur(8px)`;
    ctx.stroke();
    ctx.restore();
    
    // Draw small circles along the progress ring
    const totalDots = 40;
    const visibleDots = Math.floor((score / 100) * totalDots);
    
    for (let i = 0; i < totalDots; i++) {
      const angle = (i / totalDots) * Math.PI * 2 - Math.PI / 2;
      const dotX = centerX + (radius) * Math.cos(angle);
      const dotY = centerY + (radius) * Math.sin(angle);
      
      ctx.beginPath();
      
      // Make dots bigger and with varied sizes for more dynamic look
      const dotSize = i % 3 === 0 ? 2.2 : 1.8;
      
      ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
      
      if (i < visibleDots) {
        // Add slight glow to active dots
        ctx.fillStyle = color;
        
        // Add subtle shadow/glow to active dots
        if (i % 4 === 0) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 4;
        } else {
          ctx.shadowBlur = 0;
        }
      } else {
        ctx.fillStyle = 'rgba(228, 228, 231, 0.3)';
        ctx.shadowBlur = 0;
      }
      
      ctx.fill();
      ctx.shadowBlur = 0;
    }

  }, [score, color]);

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className={cn(
          "relative flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100,
          delay: 0.2 
        }}
      >
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
        
        {/* Inner white circle with text */}
        <motion.div 
          className="bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative z-10" 
          style={{width: '75%', height: '75%'}}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 100
          }}
        >
          {showText && (
            <div className="text-center">
              <motion.div 
                className={cn("font-bold", textSizeClasses[size], textColorClass)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {score}%
              </motion.div>
              <motion.div 
                className="text-gray-500 mt-1 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Koherens
              </motion.div>
            </div>
          )}
        </motion.div>
        
        {/* Animated pulse ring */}
        <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-40" 
             style={{ border: `1px solid ${color}` }} />
      </motion.div>
      
      {/* Status label below ring */}
      <motion.div 
        className={cn("mt-4 px-4 py-2 rounded-full bg-white shadow-sm text-sm font-medium", textColorClass)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {statusLabel}
      </motion.div>
      
      {message && (
        <motion.p 
          className="text-gray-600 text-center max-w-sm mt-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default CoherenceRing;
