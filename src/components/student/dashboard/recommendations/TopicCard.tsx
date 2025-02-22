import { Button } from "@/components/ui/button";

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
    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{topic}</h4>
          <p className="text-sm text-muted-foreground">{subject}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPractice(subject)}
        >
          Praticar
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {correctPercentage.toFixed(1)}%
        </span> de aproveitamento em {totalQuestions} questões
      </div>
    </div>
  );
};