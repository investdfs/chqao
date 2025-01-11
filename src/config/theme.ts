export const colors = {
  primary: {
    DEFAULT: "#4b6542",
    hover: "#3d5235",
    light: "#e8ede6",
    dark: "#2a3a24",
    foreground: "#FFFFFF",
  },
  secondary: {
    DEFAULT: "#F3F4F6",
    foreground: "#1F2937",
    hover: "#E5E7EB",
  },
  success: {
    DEFAULT: "#10B981",
    light: "#ECFDF5",
  },
  error: {
    DEFAULT: "#EF4444",
    light: "#FEF2F2",
  },
  card: {
    DEFAULT: "#F3F4F6",
    hover: "#F9FAFB",
    glass: "rgba(243, 244, 246, 0.85)",
  },
  accent: {
    primary: "#4b6542",
    blue: "#3B82F6",
    pink: "#EC4899",
    orange: "#F97316",
    teal: "#14B8A6",
    yellow: "#FBBF24",
  },
} as const;

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary.DEFAULT} 0%, ${colors.primary.dark} 100%)`,
  secondary: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
  success: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  error: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
} as const;