
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ListChecks } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
      <CardHeader>
        <CardTitle>Hurtighandlinger</CardTitle>
        <CardDescription>Kom raskt i gang med disse handlingene.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          className="w-full justify-start bg-[#9b87f5] hover:bg-[#8a76e5]"
          onClick={() => navigate('/checkin')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Dagslogg
        </Button>
        <Button 
          className="w-full justify-start bg-[#9b87f5] hover:bg-[#8a76e5]"
          onClick={() => navigate('/scan')}
        >
          <ListChecks className="mr-2 h-4 w-4" />
          Helsesjekk
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
