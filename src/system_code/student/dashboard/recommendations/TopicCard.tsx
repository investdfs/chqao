import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TopicCardProps {
  topic: string;
  subject: string;
  correctPercentage: number;
  totalQuestions: number;
  onPractice: (subject: string) => void;
}

export const TopicCard = ({
  topic,
  subject,
  correctPercentage,
  totalQuestions,
  onPractice
}: TopicCardProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">{topic}</h4>
          <p className="text-sm text-muted-foreground">{subject}</p>
        </div>
        <Progress value={correctPercentage} className="h-2" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {correctPercentage.toFixed(1)}% de acertos em {totalQuestions} questões
          </span>
          <Button size="sm" onClick={() => onPractice(subject)}>
            Praticar
          </Button>
        </div>
      </div>
    </Card>
  );
};