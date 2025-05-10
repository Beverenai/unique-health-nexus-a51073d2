
import React, { useEffect, useRef } from 'react';
import { getModernColor } from '@/utils/coherenceUtils';

interface CoherenceRingCanvasProps {
  score: number;
}

export const CoherenceRingCanvas: React.FC<CoherenceRingCanvasProps> = ({ score }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const color = getModernColor(score);
  
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
    drawBackgroundRing(ctx, centerX, centerY, radius, rect);
    
    // Draw progress ring
    drawProgressRing(ctx, centerX, centerY, radius, score, rect);
    
    // Draw glow effect
    drawGlowEffect(ctx, centerX, centerY, radius, score);
    
    // Draw dots along the ring
    drawDots(ctx, centerX, centerY, radius, score, color);

  }, [score, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

// Helper functions for canvas drawing
function drawBackgroundRing(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  rect: DOMRect
) {
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
}

function drawProgressRing(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  score: number,
  rect: DOMRect
) {
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
}

function drawGlowEffect(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  score: number
) {
  // Draw glow effect
  ctx.save();
  ctx.beginPath();
  const progressAngle = (score / 100) * Math.PI * 2;
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, progressAngle - Math.PI / 2);
  ctx.lineWidth = 20;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.filter = `blur(8px)`;
  ctx.stroke();
  ctx.restore();
}

function drawDots(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  score: number,
  color: string
) {
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
}
