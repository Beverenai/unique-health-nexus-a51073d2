
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabViewItem from './tab-view-item';

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
    <div className={`w-full ${className}`}>
      <motion.div 
        className="w-full overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex rounded-xl bg-gray-100 p-1.5 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-white shadow-sm text-[#9b87f5]' 
                  : 'hover:bg-white/50 text-gray-600'
              }`}
            >
              {tab.icon && (
                <motion.div 
                  animate={{ 
                    scale: activeTab === tab.id ? 1.1 : 1,
                    color: activeTab === tab.id ? "#9b87f5" : "inherit"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.icon}
                </motion.div>
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="relative mt-2 min-h-[320px]">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            <TabViewItem key={tab.id} isActive={activeTab === tab.id}>
              {tab.content}
            </TabViewItem>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
