
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabViewProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

export const TabView: React.FC<TabViewProps> = ({ 
  tabs, 
  defaultTab = tabs[0]?.id, 
  className 
}) => {
  return (
    <Tabs defaultValue={defaultTab} className={className}>
      <motion.div 
        className="w-full overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TabsList className="bg-white/50 backdrop-blur-sm border border-white/40 p-1 w-full justify-between rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </motion.div>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {tab.content}
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
