
import * as React from "react"
import { 
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip
} from "@/components/ui/tooltip"
import { useSidebar } from "./sidebar-context"

interface SidebarTooltipProps {
  children: React.ReactNode
  content?: string | React.ComponentProps<typeof TooltipContent>
}

export function SidebarTooltip({ children, content }: SidebarTooltipProps) {
  const { isMobile, state } = useSidebar()
  
  // If no tooltip content or on mobile, just return children
  if (!content) {
    return <>{children}</>
  }

  // Convert string content to TooltipContent props object
  const tooltipContentProps = typeof content === "string" 
    ? { children: content }
    : content

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltipContentProps}
      />
    </Tooltip>
  )
}
