
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // If already logged in, redirect to home
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <AuthLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Logg inn</TabsTrigger>
          <TabsTrigger value="register">Registrer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Logg inn</CardTitle>
              <CardDescription>
                Logg inn på kontoen din for å få tilgang til helsedataene dine.
              </CardDescription>
            </CardHeader>
            <LoginForm setActiveTab={setActiveTab} />
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Opprett konto</CardTitle>
              <CardDescription>
                Registrer deg for å få tilgang til en personlig helsedashbord.
              </CardDescription>
            </CardHeader>
            <RegisterForm setActiveTab={setActiveTab} />
          </Card>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Login;
