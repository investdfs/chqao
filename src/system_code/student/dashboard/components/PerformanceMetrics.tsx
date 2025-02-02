interface PerformanceMetricsProps {
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  percentage: number;
}

export const PerformanceMetrics = ({
  totalQuestions,
  totalCorrect,
  totalIncorrect,
  percentage
}: PerformanceMetricsProps) => {
  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold text-primary">
        {percentage}%
      </div>
      <div className="text-sm text-muted-foreground">
        {totalCorrect} corretas de {totalQuestions} questões
      </div>
      <div className="text-xs text-muted-foreground">
        {totalIncorrect} incorretas
      </div>
    </div>
  );
};