
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HealthSystemItem } from '@/services/healthSystemService';

interface HealthInfoTableProps {
  title?: string;
  description?: string;
  healthData?: HealthSystemItem[];
}

const HealthInfoTable: React.FC<HealthInfoTableProps> = ({ 
  title = "Detaljert helseinformasjon",
  description,
  healthData = []
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? healthData : healthData.slice(0, 3);
  
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-none shadow-lg mb-8 overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-100/40">
        <CardTitle className="text-xl font-playfair">{title}</CardTitle>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <motion.div 
          className="overflow-x-auto"
          initial="hidden"
          animate="visible"
          variants={tableVariants}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] font-medium text-gray-700">Område</TableHead>
                <TableHead className="font-medium text-gray-700">Tegn i kroppen</TableHead>
                <TableHead className="font-medium text-gray-700">Mulige årsaker</TableHead>
                <TableHead className="font-medium text-gray-700">Tiltak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleItems.map((item, index) => (
                <motion.tr 
                  key={index} 
                  className={index % 2 === 0 ? "bg-gray-50/50 hover:bg-gray-100/50 transition-colors" : "hover:bg-gray-100/50 transition-colors"}
                  variants={itemVariants}
                >
                  <TableCell className="font-medium">{item.area}</TableCell>
                  <TableCell>{item.symptoms}</TableCell>
                  <TableCell>{item.causes}</TableCell>
                  <TableCell className="p-4">
                    <div className="p-2 bg-white/50 rounded-lg border border-gray-100/40 shadow-sm">
                      {item.recommendations}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
        
        {healthData.length > 3 && (
          <div className="flex justify-center py-3 border-t border-gray-100/40 bg-white/30">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <span>{expanded ? 'Vis mindre' : 'Vis mer'}</span>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthInfoTable;
