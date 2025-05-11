
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkIfMobile);
    
    // Clean up
    return () => mql.removeEventListener("change", checkIfMobile);
  }, []);
  
  // We use double negation to convert undefined to false during initial render
  return React.useMemo(() => !!isMobile, [isMobile]);
}
