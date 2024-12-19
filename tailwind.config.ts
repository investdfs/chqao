import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6B7280", // Cinza neutro
          hover: "#4B5563",
          light: "#F3F4F6",
          dark: "#374151",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E5E7EB",
          foreground: "#1F2937",
          hover: "#D1D5DB",
        },
        success: {
          DEFAULT: "#059669", // Verde mais suave
          light: "#D1FAE5",
        },
        error: {
          DEFAULT: "#DC2626", // Vermelho menos intenso
          light: "#FEE2E2",
        },
        card: {
          DEFAULT: "#FFFFFF",
          hover: "#F9FAFB",
          glass: "rgba(255, 255, 255, 0.8)",
        },
        accent: {
          purple: "#8B5CF6",
          blue: "#3B82F6",
          pink: "#EC4899",
          orange: "#F97316",
          teal: "#14B8A6",
          yellow: "#FBBF24",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)',
        'gradient-success': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        'gradient-error': 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-down': 'fade-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
