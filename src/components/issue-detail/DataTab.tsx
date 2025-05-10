
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import ScannerComponentTable from '@/components/ScannerComponentTable';
import { ScannerComponent } from '@/types/supabase';

interface DataTabProps {
  scannerComponents: ScannerComponent[];
}

const DataTab: React.FC<DataTabProps> = ({ scannerComponents }) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-[#9b87f5]" />
          <h2 className="text-lg font-medium">Rådata fra scanner</h2>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="text-gray-700 mb-4">
          Disse dataene viser de detekterte komponentene i din skanneøkt med deres respektive nivåer. 
          Høyere prosentverdier indikerer sterkere deteksjoner.
        </p>
        
        {scannerComponents.length > 0 ? (
          <ScannerComponentTable components={scannerComponents} />
        ) : (
          <p className="text-gray-500 italic">Ingen rådata tilgjengelig for denne helseproblematikken.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTab;
