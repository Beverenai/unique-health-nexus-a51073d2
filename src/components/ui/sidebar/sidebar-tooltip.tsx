
import * as React from "react"
import { useSidebar } from "./sidebar-context"

interface SidebarTooltipProps {
  children: React.ReactNode
  content?: string | React.ReactNode
}

export function SidebarTooltip({ children, content }: SidebarTooltipProps) {
  const { isMobile, state } = useSidebar()
  const [show, setShow] = React.useState(false)
  
  // If no tooltip content or on mobile or sidebar is expanded, just return children
  if (!content || isMobile || state !== "collapsed") {
    return <>{children}</>
  }

  const handleMouseEnter = () => setShow(true)
  const handleMouseLeave = () => setShow(false)
  
  return (
    <div 
      className="relative inline-flex" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && (
        <div 
          className="absolute left-full ml-2 z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
