import { Badge } from "@/components/ui/badge";
import { TopicDifficulty } from "../types/difficulty-tags";
import { getDifficultyInfo } from "../utils/difficulty-utils";

interface TopicDifficultyItemProps {
  topic: TopicDifficulty;
}

export const TopicDifficultyItem = ({ topic }: TopicDifficultyItemProps) => {
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