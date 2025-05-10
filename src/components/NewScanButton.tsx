
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';

interface NewScanButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  fullWidth?: boolean;
}

const NewScanButton: React.FC<NewScanButtonProps> = ({ 
  variant = "default", 
  size = "default",
  className = "",
  fullWidth = false
}) => {
  const handleNewScan = () => {
    toast.success('Starter ny skanning...', {
      description: 'Dette ville starte en ny skanning i en reell applikasjon.'
    });
  };

  return (
    <Button 
      className={`${className} ${fullWidth ? 'w-full' : ''} ${variant === "default" ? "bg-[#9b87f5] hover:bg-[#7E69AB] text-white" : ""}`}
      variant={variant}
      size={size}
      onClick={handleNewScan}
    >
      <Scan size={size === "sm" ? 16 : 20} className={size === "sm" ? "mr-1" : "mr-2"} />
      <span>Ny skanning</span>
    </Button>
  );
};

export default NewScanButton;
