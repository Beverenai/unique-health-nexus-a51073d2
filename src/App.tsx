
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { seedHistoricalData } from '@/services/supabaseService';
import BottomNavigation from "./components/navigation/BottomNavigation";
import ScrollToTop from "./components/navigation/ScrollToTop";
import Index from "./pages/Index";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Insights from "./pages/Insights";
import IssueDetail from "./pages/IssueDetail";
import PriorityDetail from "./pages/PriorityDetail";
import NotFound from "./pages/NotFound";
import Onboarding from "./components/Onboarding";
import HealthSystemDetail from "./pages/HealthSystemDetail";
import MyPlan from "./pages/MyPlan";
import CheckIn from "./pages/CheckIn";
import DailyReport from "./pages/DailyReport";
import ScanProcess from "./pages/ScanProcess";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import FindingsPage from "./pages/FindingsPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Add debugging log
console.log('App loaded - using CustomTooltip for tooltips');

// Create a new QueryClient instance outside of component
const queryClient = new QueryClient();

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  return session ? <>{children}</> : <Navigate to="/login" />;
};

// App routes component
const AppRoutes = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { session } = useAuth();
  
  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    // Show onboarding if it hasn't been completed (no login check)
    if (!onboardingCompleted) {
      setShowOnboarding(true);
      
      // Also seed historical data for the demo
      seedHistoricalData();
    }
  }, []);

  return (
    <>
      <Toaster />
      <Sonner />
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      <div className="font-sans bg-gradient-to-b from-white to-[#F8F8FC]">
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow pb-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
              <Route path="/issue/:issueId" element={<ProtectedRoute><IssueDetail /></ProtectedRoute>} />
              <Route path="/priority/:priorityId" element={<ProtectedRoute><PriorityDetail /></ProtectedRoute>} />
              <Route path="/health-system/:systemId" element={<ProtectedRoute><HealthSystemDetail /></ProtectedRoute>} />
              <Route path="/my-plan" element={<ProtectedRoute><MyPlan /></ProtectedRoute>} />
              <Route path="/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
              <Route path="/daily-report" element={<ProtectedRoute><DailyReport /></ProtectedRoute>} />
              <Route path="/scan" element={<ProtectedRoute><ScanProcess /></ProtectedRoute>} />
              <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
              <Route path="/recipes/:recipeId" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
              <Route path="/findings" element={<ProtectedRoute><FindingsPage /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {session && <BottomNavigation />}
        </div>
      </div>
    </>
  );
};

// Main App component with all providers properly nested
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
