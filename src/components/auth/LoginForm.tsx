
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type LoginFormProps = {
  setActiveTab: (tab: string) => void;
};

const LoginForm = ({ setActiveTab }: LoginFormProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const result = await signIn(email, password);
    
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Det oppstod en feil ved innlogging');
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
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Passord</Label>
            <Link to="/forgot-password" className="text-xs text-[#9b87f5] hover:underline">
              Glemt passord?
            </Link>
          </div>
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
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          type="submit" 
          className="w-full bg-[#9b87f5] hover:bg-[#8a76e5]" 
          disabled={isLoading}
        >
          {isLoading ? 'Logger inn...' : 'Logg inn'}
        </Button>
        <div className="text-center w-full">
          <p className="text-sm text-gray-600">
            Ny bruker?{' '}
            <button
              type="button"
              className="text-[#9b87f5] hover:underline"
              onClick={() => setActiveTab('register')}
            >
              Registrer konto
            </button>
          </p>
        </div>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
