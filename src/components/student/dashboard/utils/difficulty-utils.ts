export const PREVIEW_DATA = [
  {
    topic: "História do Brasil Império",
    subject: "História do Brasil",
    performance: 65.5,
    totalQuestions: 12
  },
  {
    topic: "Independência do Brasil",
    subject: "História do Brasil",
    performance: 58.3,
    totalQuestions: 8
  },
  {
    topic: "República Velha",
    subject: "História do Brasil",
    performance: 45.0,
    totalQuestions: 15
  }
];

export const getDifficultyInfo = (performance: number) => {
  if (performance >= 80) return {
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    iconType: 'trending-up' as const,
    label: "Bom desempenho"
  };
  if (performance >= 60) return {
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    iconType: 'target' as const,
    label: "Precisa de atenção"
  };
  return {
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    iconType: 'trending-down' as const,
    label: "Foco necessário"
  };
};