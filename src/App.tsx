import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import QuestionPractice from "./pages/QuestionPractice";
import TestDashboard from "./pages/TestDashboard";
import PreviousExams from "./pages/PreviousExams";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Dados mockados para preview (mantidos para compatibilidade)
const previewUser = {
  id: 'preview-user-id',
  email: 'preview@example.com',
  name: 'Usuário Preview',
  status: 'active'
};

const App: React.FC = () => {
  const { authRequired } = useAuthStore();
  console.log("App renderizando, autenticação requerida:", authRequired);

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
              element={!authRequired ? <Navigate to="/student-dashboard" replace /> : <Register />} 
            />
            <Route 
              path="/login" 
              element={!authRequired ? <Navigate to="/student-dashboard" replace /> : <Login />} 
            />
            <Route
              path="/student-dashboard"
              element={
                authRequired ? (
                  <Navigate to="/login" replace />
                ) : (
                  <StudentDashboard previewUser={previewUser} />
                )
              }
            />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/question-practice"
              element={<QuestionPractice previewUser={previewUser} />}
            />
            <Route
              path="/test-dashboard"
              element={
                authRequired ? (
                  <Navigate to="/login" replace />
                ) : (
                  <TestDashboard previewUser={previewUser} />
                )
              }
            />
            <Route
              path="/previous-exams"
              element={
                authRequired ? (
                  <Navigate to="/login" replace />
                ) : (
                  <PreviousExams previewUser={previewUser} />
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