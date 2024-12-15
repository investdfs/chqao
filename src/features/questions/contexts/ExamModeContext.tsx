import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExamModeContextData {
  isExamMode: boolean;
  toggleExamMode: () => void;
  examStartTime: Date | null;
  examAnswers: Record<string, string>;
  addAnswer: (questionId: string, answer: string) => void;
  resetExamMode: () => void;
}

const ExamModeContext = createContext<ExamModeContextData | undefined>(undefined);

export function ExamModeProvider({ children }: { children: ReactNode }) {
  const [isExamMode, setIsExamMode] = useState(false);
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});

  const toggleExamMode = () => {
    if (!isExamMode) {
      setExamStartTime(new Date());
      setExamAnswers({});
    }
    setIsExamMode(!isExamMode);
  };

  const addAnswer = (questionId: string, answer: string) => {
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const resetExamMode = () => {
    setIsExamMode(false);
    setExamStartTime(null);
    setExamAnswers({});
  };

  return (
    <ExamModeContext.Provider value={{
      isExamMode,
      toggleExamMode,
      examStartTime,
      examAnswers,
      addAnswer,
      resetExamMode
    }}>
      {children}
    </ExamModeContext.Provider>
  );
}

export function useExamMode() {
  const context = useContext(ExamModeContext);
  if (context === undefined) {
    throw new Error('useExamMode must be used within a ExamModeProvider');
  }
  return context;
}