import { create } from 'zustand';

interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
}

interface SessionStatsStore {
  stats: SessionStats;
  updateStats: (isCorrect: boolean) => void;
  resetStats: () => void;
}

export const useSessionStats = create<SessionStatsStore>((set) => ({
  stats: {
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0
  },
  updateStats: (isCorrect: boolean) => set((state) => ({
    stats: {
      totalQuestions: state.stats.totalQuestions + 1,
      correctAnswers: state.stats.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: state.stats.wrongAnswers + (isCorrect ? 0 : 1)
    }
  })),
  resetStats: () => set({
    stats: {
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    }
  })
}));