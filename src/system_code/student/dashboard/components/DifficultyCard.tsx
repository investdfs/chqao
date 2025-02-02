import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DifficultyCardProps {
  topic: {
    topic: string;
    subject: string;
    performance: number;
    totalQuestions: number;
  };
}

export const DifficultyCard = ({ topic }: DifficultyCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">{topic.topic}</h4>
          <span className="text-sm text-muted-foreground">{topic.subject}</span>
        </div>
        <Progress value={topic.performance} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{topic.performance.toFixed(1)}% de acertos</span>
          <span>{topic.totalQuestions} questões</span>
        </div>
      </div>
    </Card>
  );
};