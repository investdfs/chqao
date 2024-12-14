import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import PreviewDashboard from "./pages/PreviewDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import QuestionPractice from "./pages/QuestionPractice";
import TestDashboard from "./pages/TestDashboard";
import PreviousExams from "./pages/PreviousExams";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const isPreviewMode = window.location.hostname === 'preview.lovable.dev';

// Componente de proteção de rota que considera o modo preview
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Em modo preview, considera o usuário como autenticado
  if (isPreviewMode) {
    console.log("Preview mode: bypassing authentication check");
    return <>{children}</>;
  }

  // Verifica se há uma sessão ativa
  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error("Error checking session:", error);
      return null;
    }
  };

  const session = checkSession();
  
  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={
              isPreviewMode ? <Navigate to="/preview-dashboard" replace /> : <Register />
            } />
            <Route path="/login" element={
              isPreviewMode ? <Navigate to="/preview-dashboard" replace /> : <Login />
            } />
            <Route
              path="/student-dashboard"
              element={
                isPreviewMode ? (
                  <Navigate to="/preview-dashboard" replace />
                ) : (
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                )
              }
            />
            <Route
              path="/preview-dashboard"
              element={
                isPreviewMode ? <PreviewDashboard /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/question-practice"
              element={
                <ProtectedRoute>
                  <QuestionPractice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-dashboard"
              element={
                <ProtectedRoute>
                  <TestDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/previous-exams"
              element={
                <ProtectedRoute>
                  <PreviousExams />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;