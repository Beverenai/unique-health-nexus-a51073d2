
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';

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
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs 
      defaultValue={defaultTab} 
      value={activeTab}
      onValueChange={setActiveTab}
      className={className}
    >
      <motion.div 
        className="w-full overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TabsList className="bg-gray-100 p-1 w-full justify-between rounded-lg">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 ease-out rounded-md px-4 py-2"
            >
              {tab.icon && (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ 
                    scale: activeTab === tab.id ? 1.1 : 1,
                    color: activeTab === tab.id ? "#9b87f5" : "inherit"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.icon}
                </motion.div>
              )}
              <span className="font-medium text-sm">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </motion.div>

      <div className="mt-3 relative">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }}
                className="absolute w-full"
              >
                <TabsContent value={tab.id} forceMount className="m-0 outline-none">
                  {tab.content}
                </TabsContent>
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {/* Placeholder to maintain proper layout height */}
        <div className="invisible">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>
    </Tabs>
  );
};
