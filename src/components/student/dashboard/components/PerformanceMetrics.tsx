import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acertos</CardTitle>
            <Check className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{totalCorrect}</div>
            <Progress value={(totalCorrect / totalQuestions) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <X className="h-4 w-4 text-error" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-error">{totalIncorrect}</div>
            <Progress value={(totalIncorrect / totalQuestions) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <div className="text-sm text-muted-foreground">Total de questões</div>
        <div className="text-2xl font-bold">{totalQuestions}</div>
        <Progress value={percentage} className="mt-2" />
        <div className="text-sm text-muted-foreground mt-1">
          Aproveitamento: {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};