import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useQuestionPractice } from '@/hooks/useQuestionPractice';

interface Question {
  id: string;
  text: string;
  subject?: string;
  topic?: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  explanation: string;
}

interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
}

interface QuestionContextData {
  currentQuestionIndex: number;
  studentData: any;
  questions: any[];
  isLoadingStudent: boolean;
  isLoadingQuestions: boolean;
  error: Error | null;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  currentQuestion: Question | null;
  selectedExamYear?: number;
  setSelectedExamYear: (year: number) => void;
  sessionStats: SessionStats;
  updateSessionStats: (isCorrect: boolean) => void;
  resetSessionStats: () => void;
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

  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0
  });

  const updateSessionStats = (isCorrect: boolean) => {
    setSessionStats(prev => ({
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1)
    }));
  };

  const resetSessionStats = () => {
    setSessionStats({
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    });
  };

  const currentQuestion = questions?.[currentQuestionIndex] ? {
    id: questions[currentQuestionIndex].id,
    text: questions[currentQuestionIndex].text,
    subject: questions[currentQuestionIndex].subject,
    topic: questions[currentQuestionIndex].topic || undefined,
    options: [
      { id: "A", text: questions[currentQuestionIndex].option_a },
      { id: "B", text: questions[currentQuestionIndex].option_b },
      { id: "C", text: questions[currentQuestionIndex].option_c },
      { id: "D", text: questions[currentQuestionIndex].option_d },
      { id: "E", text: questions[currentQuestionIndex].option_e },
    ],
    correctAnswer: questions[currentQuestionIndex].correct_answer,
    explanation: questions[currentQuestionIndex].explanation || "",
  } : null;

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
        setSelectedExamYear,
        sessionStats,
        updateSessionStats,
        resetSessionStats
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