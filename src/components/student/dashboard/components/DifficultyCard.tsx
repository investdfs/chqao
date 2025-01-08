import { Badge } from "@/components/ui/badge";
import { Brain, TrendingDown, TrendingUp, Target } from "lucide-react";
import { TopicDifficulty } from "../types";

interface DifficultyCardProps {
  topic: TopicDifficulty;
}

export const DifficultyCard = ({ topic }: DifficultyCardProps) => {
  const getDifficultyInfo = (performance: number) => {
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

  const difficultyInfo = getDifficultyInfo(topic.performance);

  return (
    <div className="p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50/80 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <h4 className="font-medium text-gray-900">{topic.topic}</h4>
          <p className="text-sm text-gray-500">{topic.subject}</p>
        </div>
        <Badge
          variant="secondary"
          className={`${difficultyInfo.color} flex items-center gap-1`}
        >
          {difficultyInfo.icon}
          {topic.performance.toFixed(1)}%
        </Badge>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
        <span>{difficultyInfo.label}</span>
        <span>{topic.totalQuestions} questões respondidas</span>
      </div>
    </div>
  );
};