
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type RegisterFormProps = {
  setActiveTab: (tab: string) => void;
};

const RegisterForm = ({ setActiveTab }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!firstName || !lastName) {
      setError('Vennligst fyll ut alle feltene');
      setIsLoading(false);
      return;
    }
    
    const result = await signUp(email, password, firstName, lastName);
    
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Det oppstod en feil ved registrering');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Fornavn</Label>
            <Input 
              id="firstName" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Etternavn</Label>
            <Input 
              id="lastName" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="registerEmail">E-post</Label>
          <Input 
            id="registerEmail" 
            type="email" 
            placeholder="din@epost.no" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registerPassword">Passord</Label>
          <div className="relative">
            <Input 
              id="registerPassword" 
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
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          type="submit" 
          className="w-full bg-[#9b87f5] hover:bg-[#8a76e5]" 
          disabled={isLoading}
        >
          {isLoading ? 'Registrerer...' : 'Registrer'}
        </Button>
        <div className="text-center w-full">
          <p className="text-sm text-gray-600">
            Har du allerede en konto?{' '}
            <button
              type="button"
              className="text-[#9b87f5] hover:underline"
              onClick={() => setActiveTab('login')}
            >
              Logg inn
            </button>
          </p>
        </div>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
