import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const isPreviewMode = window.location.hostname === 'preview.lovable.dev';

// Mock student data for preview mode
const previewStudentData = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'preview@example.com',
  name: 'Usuário Visitante',
  status: 'active'
};

const QuestionContext = createContext<any>(null);

export const useQuestion = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestion must be used within a QuestionProvider');
  }
  return context;
};

export const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch questions without requiring authentication
  const { data: questions, isLoading: isLoadingQuestions, error } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      console.log("Fetching questions...");
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('status', 'active')
        .order('created_at');

      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }
      
      console.log("Questions fetched successfully:", data?.length, "questions");
      return data;
    },
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        currentQuestionIndex,
        studentData: previewStudentData,
        questions,
        isLoadingQuestions,
        error,
        handleNextQuestion,
        handlePreviousQuestion,
        currentQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};