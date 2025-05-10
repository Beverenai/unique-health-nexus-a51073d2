
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DetailCard from '@/components/DetailCard';
import { IssueDetail } from '@/types/supabase';

interface OverviewTabProps {
  details: IssueDetail[];
  detailedInfo?: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ details, detailedInfo }) => {
  return (
    <>
      {/* Details section */}
      {details.length > 0 ? (
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-gray-100/20">
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
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-gray-100/20">
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-3">Detaljert informasjon</h2>
            <p className="text-gray-700">
              {detailedInfo || "Dine resultater viser forhøyede verdier som kan påvirke helsetilstanden din. Se anbefalinger nedenfor for hvordan du kan forbedre dette området."}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Connected systems section */}
      <Card className="mb-6 bg-white/70 backdrop-blur-sm border-gray-100/20">
        <CardHeader className="pb-0">
          <h2 className="text-lg font-medium">Forbundet med</h2>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/50">Nervesystem</Badge>
            <Badge variant="outline" className="bg-white/50">Hormonsystem</Badge>
            <Badge variant="outline" className="bg-white/50">Fordøyelsessystem</Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewTab;
