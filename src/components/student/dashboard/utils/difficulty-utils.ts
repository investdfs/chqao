import { TrendingUp, Target, TrendingDown } from "lucide-react";

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
    icon: <TrendingUp className="h-4 w-4" />,
    label: "Bom desempenho"
  };
  if (performance >= 60) return {
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    icon: <Target className="h-4 w-4" />,
    label: "Precisa de atenção"
  };
  return {
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: <TrendingDown className="h-4 w-4" />,
    label: "Foco necessário"
  };
};