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

// Verifica se está em modo preview baseado no hostname
const isPreviewMode = window.location.hostname === 'preview.lovable.dev' || 
                     window.location.hostname.includes('lovableproject.com');

// Dados mockados para preview
const previewUser = {
  id: 'preview-user-id',
  email: 'preview@example.com',
  name: 'Usuário Preview',
  status: 'active'
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
}

// Componente de proteção de rota atualizado
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiresAuth = true }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isPreviewMode) {
          console.log("Modo preview ativo: bypass de autenticação");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        console.log("Verificando autenticação:", !!session);
        setIsAuthenticated(!!session);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // ou um componente de loading
  }

  if (requiresAuth && !isAuthenticated) {
    console.log("Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  console.log("App renderizando, modo preview:", isPreviewMode);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/register" 
              element={isPreviewMode ? <Navigate to="/student-dashboard" replace /> : <Register />} 
            />
            <Route 
              path="/login" 
              element={isPreviewMode ? <Navigate to="/student-dashboard" replace /> : <Login />} 
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard previewUser={isPreviewMode ? previewUser : undefined} />
                </ProtectedRoute>
              }
            />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/question-practice"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <QuestionPractice previewUser={isPreviewMode ? previewUser : undefined} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-dashboard"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <TestDashboard previewUser={isPreviewMode ? previewUser : undefined} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/previous-exams"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <PreviousExams previewUser={isPreviewMode ? previewUser : undefined} />
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