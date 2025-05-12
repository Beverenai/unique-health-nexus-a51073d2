
import * as React from "react"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
}

// Custom tooltip that doesn't depend on React context
const CustomTooltip = ({ children, content, side = "top", align = "center", className = "" }: TooltipProps) => {
  const [show, setShow] = React.useState(false);
  
  return (
    <div 
      className="relative inline-flex" 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div 
          className={`absolute z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
          style={{ 
            ...(side === "right" && { left: "100%", marginLeft: "8px", top: align === "start" ? "0" : align === "end" ? "auto" : "50%", bottom: align === "end" ? "0" : "auto", transform: align === "center" ? "translateY(-50%)" : "none" }),
            ...(side === "left" && { right: "100%", marginRight: "8px", top: align === "start" ? "0" : align === "end" ? "auto" : "50%", bottom: align === "end" ? "0" : "auto", transform: align === "center" ? "translateY(-50%)" : "none" }),
            ...(side === "top" && { bottom: "100%", marginBottom: "8px", left: align === "start" ? "0" : align === "end" ? "auto" : "50%", right: align === "end" ? "0" : "auto", transform: align === "center" ? "translateX(-50%)" : "none" }),
            ...(side === "bottom" && { top: "100%", marginTop: "8px", left: align === "start" ? "0" : align === "end" ? "auto" : "50%", right: align === "end" ? "0" : "auto", transform: align === "center" ? "translateX(-50%)" : "none" }),
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export { CustomTooltip }
