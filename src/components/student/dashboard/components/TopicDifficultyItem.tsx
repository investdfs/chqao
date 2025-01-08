import { Badge } from "@/components/ui/badge";
import { TopicDifficulty } from "../types/difficulty-tags";
import { getDifficultyInfo } from "../utils/difficulty-utils";
import { TrendingUp, Target, TrendingDown } from "lucide-react";

const getIcon = (iconType: 'trending-up' | 'target' | 'trending-down') => {
  switch (iconType) {
    case 'trending-up':
      return <TrendingUp className="h-4 w-4" />;
    case 'target':
      return <Target className="h-4 w-4" />;
    case 'trending-down':
      return <TrendingDown className="h-4 w-4" />;
  }
};

export const TopicDifficultyItem = ({ topic }: { topic: TopicDifficulty }) => {
  const difficultyInfo = getDifficultyInfo(topic.performance);

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{topic.topic}</p>
        <p className="text-sm text-muted-foreground">{topic.subject}</p>
      </div>
      <Badge
        variant="secondary"
        className={`flex items-center gap-1 ${difficultyInfo.color}`}
      >
        {getIcon(difficultyInfo.iconType)}
        {topic.performance.toFixed(1)}%
      </Badge>
    </div>
  );
};