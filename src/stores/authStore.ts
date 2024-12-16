import { create } from 'zustand';

interface AuthState {
  authRequired: boolean;
  toggleAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Inicializa com autenticação desativada
  authRequired: false,
  
  toggleAuth: () => set((state) => ({ 
    authRequired: !state.authRequired 
  })),
}));