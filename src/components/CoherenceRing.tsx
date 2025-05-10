
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

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
    
    // Draw background ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 15;
    ctx.strokeStyle = 'rgba(228, 228, 231, 0.3)';
    ctx.stroke();
    
    // Draw progress ring
    const progressAngle = (score / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, progressAngle - Math.PI / 2);
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.stroke();
    
    // Draw small circles along the progress ring
    const totalDots = 40;
    const visibleDots = Math.floor((score / 100) * totalDots);
    
    for (let i = 0; i < totalDots; i++) {
      const angle = (i / totalDots) * Math.PI * 2 - Math.PI / 2;
      const dotX = centerX + (radius) * Math.cos(angle);
      const dotY = centerY + (radius) * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = i < visibleDots ? color : 'rgba(228, 228, 231, 0.3)';
      ctx.fill();
    }

  }, [score, color]);

  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}>
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
        
        {/* Inner white circle with text */}
        <div className="bg-white rounded-full flex items-center justify-center shadow-sm relative z-10" 
             style={{width: '75%', height: '75%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'}}>
          {showText && (
            <div className="text-center">
              <div className={cn("font-bold", textSizeClasses[size], textColorClass)}>
                {score}%
              </div>
              <div className="text-gray-500 mt-1 text-sm">
                Koherens
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status label below ring */}
      <div className={cn("mt-4 px-4 py-2 rounded-full bg-white shadow-sm text-sm font-medium", textColorClass)}>
        {statusLabel}
      </div>
      
      {message && (
        <p className="text-gray-600 text-center max-w-sm mt-4 text-sm">
          {message}
        </p>
      )}
    </div>
  );
};

export default CoherenceRing;
