import { colors } from './colors';

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary.DEFAULT} 0%, ${colors.primary.dark} 100%)`,
  secondary: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
  success: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  error: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
} as const;