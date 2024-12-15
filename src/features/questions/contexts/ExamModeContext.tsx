import React, { createContext, useContext, useState } from 'react';

interface ExamModeContextType {
  isExamMode: boolean;
  examStartTime: Date | null;
  examAnswers: Record<string, string>;
  setExamMode: (value: boolean) => void;
  toggleExamMode: () => void;  // Added this function type
  addAnswer: (questionId: string, answer: string) => void;
  resetExamMode: () => void;
}

const ExamModeContext = createContext<ExamModeContextType | undefined>(undefined);

export const ExamModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isExamMode, setIsExamMode] = useState(false);
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});

  const setExamMode = (value: boolean) => {
    setIsExamMode(value);
    if (value) {
      setExamStartTime(new Date());
      setExamAnswers({});
    } else {
      setExamStartTime(null);
      setExamAnswers({});
    }
  };

  const toggleExamMode = () => {  // Added this function implementation
    setExamMode(!isExamMode);
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
      examStartTime,
      examAnswers,
      setExamMode,
      toggleExamMode,  // Added this to the provider value
      addAnswer,
      resetExamMode
    }}>
      {children}
    </ExamModeContext.Provider>
  );
};

export const useExamMode = () => {
  const context = useContext(ExamModeContext);
  if (context === undefined) {
    throw new Error('useExamMode must be used within an ExamModeProvider');
  }
  return context;
};