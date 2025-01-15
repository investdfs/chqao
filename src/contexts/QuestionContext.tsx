import React, { createContext, useContext, ReactNode } from 'react';
import { useQuestionPractice } from '@/hooks/useQuestionPractice';
import { Question } from '@/types/questions/common';

interface QuestionContextData {
  currentQuestionIndex: number;
  studentData: any;
  questions: Question[];
  isLoadingStudent: boolean;
  isLoadingQuestions: boolean;
  error: Error | null;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  currentQuestion: Question | null;
  selectedExamYear?: number;
  setSelectedExamYear: (year: number) => void;
}

const QuestionContext = createContext<QuestionContextData | undefined>(undefined);

export function QuestionProvider({ children }: { children: ReactNode }) {
  const {
    currentQuestionIndex,
    studentData,
    questions,
    isLoadingStudent,
    isLoadingQuestions,
    error,
    handleNextQuestion,
    handlePreviousQuestion,
    selectedExamYear,
    setSelectedExamYear
  } = useQuestionPractice();

  const currentQuestion = questions?.[currentQuestionIndex] || null;

  console.log("QuestionContext - Total de questões:", questions?.length);
  console.log("QuestionContext - Questão atual:", currentQuestionIndex + 1);

  return (
    <QuestionContext.Provider
      value={{
        currentQuestionIndex,
        studentData,
        questions,
        isLoadingStudent,
        isLoadingQuestions,
        error,
        handleNextQuestion,
        handlePreviousQuestion,
        currentQuestion,
        selectedExamYear,
        setSelectedExamYear
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestion() {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error('useQuestion must be used within a QuestionProvider');
  }
  return context;
}