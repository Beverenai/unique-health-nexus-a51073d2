
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DetailCard from '@/components/DetailCard';
import { IssueDetail } from '@/types/supabase';
import HealthInfoTable from '@/components/HealthInfoTable';

interface OverviewTabProps {
  details: IssueDetail[];
  detailedInfo?: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ details, detailedInfo }) => {
  return (
    <>
      {/* Details section */}
      {details.length > 0 ? (
        <Card className="mb-6 glassmorphism border-none bg-gradient-to-br from-white/80 to-white/50 shadow-lg">
          <CardHeader className="pb-0">
            <h2 className="text-lg font-medium">Detaljer</h2>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {details.map(detail => (
              <DetailCard 
                key={detail.id} 
                detail={detail} 
              />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 glassmorphism border-none bg-gradient-to-br from-white/80 to-white/50 shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-3 font-playfair">Detaljert informasjon</h2>
            <p className="text-gray-700">
              {detailedInfo || "Dine resultater viser forhøyede verdier som kan påvirke helsetilstanden din. Se anbefalinger nedenfor for hvordan du kan forbedre dette området."}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Connected systems section */}
      <Card className="mb-6 glassmorphism border-none bg-gradient-to-br from-white/80 to-white/50 shadow-lg">
        <CardHeader className="pb-0">
          <h2 className="text-lg font-medium font-playfair">Forbundet med</h2>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/50 hover:bg-white/60 transition-all">Nervesystem</Badge>
            <Badge variant="outline" className="bg-white/50 hover:bg-white/60 transition-all">Hormonsystem</Badge>
            <Badge variant="outline" className="bg-white/50 hover:bg-white/60 transition-all">Fordøyelsessystem</Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Health info table section */}
      <HealthInfoTable 
        title="Relatert helseinformasjon" 
        description="Oversikt over helsesystemer og anbefalte tiltak"
      />
    </>
  );
};

export default OverviewTab;
