export const keyframes = {
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
} as const;

export const animations = {
  'fade-up': 'fade-up 0.5s ease-out',
  'fade-down': 'fade-down 0.5s ease-out',
  'fade-in': 'fade-in 0.5s ease-out',
  'slide-in': 'slide-in 0.5s ease-out',
  'scale-in': 'scale-in 0.5s ease-out',
  'float': 'float 3s ease-in-out infinite',
  'pulse': 'pulse 2s ease-in-out infinite',
  'shimmer': 'shimmer 2s linear infinite',
} as const;