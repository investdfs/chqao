import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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

// Dados mockados para preview (mantidos para compatibilidade)
const previewUser = {
  id: 'preview-user-id',
  email: 'preview@example.com',
  name: 'Usuário Preview',
  status: 'active'
};

const App: React.FC = () => {
  console.log("App renderizando em modo público");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/student-dashboard"
              element={<StudentDashboard previewUser={previewUser} />}
            />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/question-practice"
              element={<QuestionPractice previewUser={previewUser} />}
            />
            <Route
              path="/test-dashboard"
              element={<TestDashboard previewUser={previewUser} />}
            />
            <Route
              path="/previous-exams"
              element={<PreviousExams previewUser={previewUser} />}
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;