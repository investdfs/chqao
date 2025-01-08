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
      <div className="text-sm text-muted-foreground">Total de questões</div>
      <div className="text-2xl font-bold">{totalQuestions}</div>
      <div className="flex justify-between text-sm">
        <span className="text-success">Acertos: {totalCorrect}</span>
        <span className="text-error">Erros: {totalIncorrect}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-center text-sm text-muted-foreground">
        Aproveitamento: {percentage}%
      </div>
    </div>
  );
};