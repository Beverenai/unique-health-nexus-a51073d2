
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we have a session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      // If no session and no recovery token in URL, redirect to login
      if (!data.session && !window.location.hash.includes('type=recovery')) {
        navigate('/login');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passordene matcher ikke');
      return;
    }
    
    if (password.length < 6) {
      setError('Passordet må være minst 6 tegn');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast.success('Passordet ditt har blitt oppdatert');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Det oppstod en feil ved tilbakestilling av passordet');
    } finally {
      setIsLoading(false);
    }
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
            <CardTitle>Tilbakestill passord</CardTitle>
            <CardDescription>
              Vennligst skriv inn ditt nye passord
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Nytt passord</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bekreft nytt passord</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-[#9b87f5] hover:bg-[#8a76e5]" 
                disabled={isLoading}
              >
                {isLoading ? 'Lagrer...' : 'Sett nytt passord'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
