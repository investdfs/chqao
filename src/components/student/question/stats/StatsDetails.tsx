import { Progress } from "@/components/ui/progress";

interface StatsDetailsProps {
  data: Array<{
    option: string;
    count: number;
  }>;
  correctAnswer: string;
  totalAnswers: number;
}

export const StatsDetails = ({ data, correctAnswer, totalAnswers }: StatsDetailsProps) => {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.option} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              Alternativa {item.option}
              {item.option === correctAnswer && (
                <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                  Correta
                </span>
              )}
            </span>
            <span className="text-muted-foreground">
              {((item.count / totalAnswers) * 100).toFixed(1)}% ({item.count} respostas)
            </span>
          </div>
          <Progress
            value={(item.count / totalAnswers) * 100}
            className={item.option === correctAnswer ? "bg-success/20" : ""}
          />
        </div>
      ))}
      <div className="mt-4 text-sm text-muted-foreground">
        Total de respostas: {totalAnswers}
      </div>
    </div>
  );
};