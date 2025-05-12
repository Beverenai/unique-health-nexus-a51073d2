
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await requestPasswordReset(email);
    
    if (result.success) {
      setIsSubmitted(true);
      toast.success('Tilbakestillingslenke sendt til din e-post');
    } else {
      toast.error(result.error || 'Det oppstod en feil ved sending av tilbakestillingslenke');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-[#F8F8FC]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Unique Balance</h1>
          <p className="text-gray-600">Din personlige helseassistent</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Glemt passord</CardTitle>
            <CardDescription>
              {isSubmitted 
                ? 'Sjekk din e-post for en link til å tilbakestille passordet ditt.'
                : 'Skriv inn din e-postadresse for å tilbakestille passordet.'}
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-post</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="din@epost.no" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#9b87f5] hover:bg-[#8a76e5]" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Sender...' : 'Send tilbakestillingslenke'}
                </Button>
                <div className="text-center w-full">
                  <p className="text-sm text-gray-600">
                    <Link to="/login" className="text-[#9b87f5] hover:underline">
                      Tilbake til innlogging
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4 text-center">
              <p className="text-green-600">
                Tilbakestillingslenke er sendt til {email}
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                className="mt-4 bg-[#9b87f5] hover:bg-[#8a76e5]"
              >
                Tilbake til innlogging
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
