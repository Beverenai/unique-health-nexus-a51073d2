
import * as React from "react"
import { useSidebar } from "./sidebar-context"
import { 
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip"

interface SidebarTooltipProps {
  children: React.ReactNode
  content?: string | React.ReactNode
}

export function SidebarTooltip({ children, content }: SidebarTooltipProps) {
  const { isMobile, state } = useSidebar()
  
  // If no tooltip content or on mobile or sidebar is expanded, just return children
  if (!content || isMobile || state !== "collapsed") {
    return <>{children}</>
  }

  // Use Radix UI Tooltip for better accessibility and positioning
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right"
          align="center"
          className="z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
