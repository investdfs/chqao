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

// Componente de proteção de rota simplificado
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Em modo preview, renderiza diretamente o conteúdo
  if (isPreviewMode) {
    console.log("Modo preview ativo: bypass de autenticação");
    return <>{children}</>;
  }

  // Em modo normal, verifica autenticação
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Aguarda verificação inicial
  if (isAuthenticated === null) {
    return null; // ou um componente de loading
  }

  // Redireciona se não estiver autenticado
  if (!isAuthenticated) {
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
                isPreviewMode ? (
                  <StudentDashboard previewUser={previewUser} />
                ) : (
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                )
              }
            />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/question-practice"
              element={
                isPreviewMode ? (
                  <QuestionPractice previewUser={previewUser} />
                ) : (
                  <ProtectedRoute>
                    <QuestionPractice />
                  </ProtectedRoute>
                )
              }
            />
            <Route
              path="/test-dashboard"
              element={
                isPreviewMode ? (
                  <TestDashboard previewUser={previewUser} />
                ) : (
                  <ProtectedRoute>
                    <TestDashboard />
                  </ProtectedRoute>
                )
              }
            />
            <Route
              path="/previous-exams"
              element={
                isPreviewMode ? (
                  <PreviousExams previewUser={previewUser} />
                ) : (
                  <ProtectedRoute>
                    <PreviousExams />
                  </ProtectedRoute>
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;