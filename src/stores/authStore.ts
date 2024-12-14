import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  authRequired: boolean;
  toggleAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authRequired: false,
      toggleAuth: () => set((state) => ({ authRequired: !state.authRequired })),
    }),
    {
      name: 'auth-storage',
    }
  )
);