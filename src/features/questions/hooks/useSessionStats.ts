import { useState, useCallback } from "react";

interface SessionStats {
  correctAnswers: number;
  totalAnswers: number;
  answerDistribution: Record<string, number>;
}

export const useSessionStats = () => {
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    correctAnswers: 0,
    totalAnswers: 0,
    answerDistribution: {},
  });

  const updateStats = useCallback((selectedAnswer: string, isCorrect: boolean) => {
    setSessionStats((prev) => ({
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalAnswers: prev.totalAnswers + 1,
      answerDistribution: {
        ...prev.answerDistribution,
        [selectedAnswer]: (prev.answerDistribution[selectedAnswer] || 0) + 1,
      },
    }));
  }, []);

  const resetStats = useCallback(() => {
    setSessionStats({
      correctAnswers: 0,
      totalAnswers: 0,
      answerDistribution: {},
    });
  }, []);

  return {
    sessionStats,
    updateStats,
    resetStats,
  };
};