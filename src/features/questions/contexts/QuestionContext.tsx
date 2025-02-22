
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

  // Obter o parâmetro subject da URL
  const searchParams = new URLSearchParams(window.location.search);
  const selectedSubject = searchParams.get('subject');

  // Fetch questions using the RPC function and filtering by subject
  const { data: questions, isLoading: isLoadingQuestions, error } = useQuery({
    queryKey: ['questions', selectedSubject], // Adicionar subject na queryKey
    queryFn: async () => {
      console.log("Buscando questões para matéria:", selectedSubject);
      
      if (!selectedSubject) {
        console.log("Nenhuma matéria selecionada, retornando array vazio");
        return [];
      }

      const { data, error } = await supabase
        .rpc('get_filtered_questions', {
          p_subject: selectedSubject
        });

      if (error) {
        console.error("Erro ao buscar questões:", error);
        throw error;
      }
      
      console.log("Questões retornadas:", data?.length || 0);
      return data;
    },
    enabled: !!selectedSubject, // Só executa a query se tiver uma matéria selecionada
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
