import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, History, User, Menu, Scan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

// Menu items
const menuItems = [
  {
    title: "Hjem",
    path: "/",
    icon: Home,
  },
  {
    title: "Historikk",
    path: "/history",
    icon: History,
  },
  {
    title: "Profil",
    path: "/profile",
    icon: User,
  },
];

const handleNewScan = () => {
  toast.success('Starter ny skanning...', {
    description: 'Dette ville starte en ny skanning i en reell applikasjon.'
  });
};

// Mobile navigation component
const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm border rounded-full shadow-sm"
        >
          <Menu size={20} />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] p-0">
        <div className="py-6 px-4 border-b">
          <h2 className="text-xl font-medium text-[#9b87f5]">Unique</h2>
        </div>
        <div className="py-4">
          <nav>
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive(item.path) ? "bg-[#9b87f5]/10 text-[#9b87f5]" : ""
                    )}
                    onClick={() => {
                      navigate(item.path);
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </li>
              ))}
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleNewScan}
                >
                  <Scan className="mr-2 h-4 w-4" />
                  Ny skanning
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Desktop sidebar menu content
const SidebarMenuContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            isActive={isActive(item.path)}
            tooltip={item.title}
            onClick={() => navigate(item.path)}
          >
            <item.icon />
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Ny skanning"
          onClick={handleNewScan}
        >
          <Scan />
          <span>Ny skanning</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

// Main sidebar wrapper
export function AppSidebar() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileNavigation />;
  }
  
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex h-14 items-center px-4 font-semibold">
          <span className="text-[#9b87f5]">Unique</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigasjon</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuContent />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex h-14 items-center px-4 text-xs text-muted-foreground">
          <span>Unique Health © 2025</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

// Wrapper component to provide sidebar context
export function AppNavigation({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
