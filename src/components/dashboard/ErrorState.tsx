
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  refetch: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, refetch }) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Kunne ikke laste dashbordet</AlertTitle>
      <AlertDescription className="mt-2">
        {error}
        <Button 
          onClick={refetch}
          variant="outline" 
          size="sm" 
          className="ml-2 mt-2"
        >
          <RefreshCcw size={16} className="mr-2" />
          Prøv igjen
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;
