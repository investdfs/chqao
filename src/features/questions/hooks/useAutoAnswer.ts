import { create } from 'zustand';

interface AutoAnswerStore {
  isAutoAnswerEnabled: boolean;
  toggleAutoAnswer: () => void;
}

export const useAutoAnswer = create<AutoAnswerStore>((set) => ({
  isAutoAnswerEnabled: false,
  toggleAutoAnswer: () => set((state) => ({ isAutoAnswerEnabled: !state.isAutoAnswerEnabled })),
}));