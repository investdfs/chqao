import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, Clock } from "lucide-react";

interface PerformanceMetricsProps {
  correctAnswers: number;
  totalQuestions: number;
  studyTime: string;
  averageTime: string;
}

export const PerformanceMetrics = ({
  correctAnswers,
  totalQuestions,
  studyTime,
  averageTime,
}: PerformanceMetricsProps) => {
  const correctPercentage = (correctAnswers / totalQuestions) * 100 || 0;
  const incorrectPercentage = 100 - correctPercentage;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Acertos</CardTitle>
          <Check className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{correctPercentage.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">
            Você acertou {correctAnswers} questões!
          </p>
          <Progress value={correctPercentage} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Erros</CardTitle>
          <X className="h-4 w-4 text-error" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-error">{incorrectPercentage.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">
            Você errou {totalQuestions - correctAnswers} questões
          </p>
          <Progress value={incorrectPercentage} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo de estudo total</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studyTime}</div>
          <p className="text-xs text-muted-foreground">
            Continue praticando diariamente!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo médio por questão</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageTime}</div>
          <p className="text-xs text-muted-foreground">
            Mantenha um ritmo constante
          </p>
        </CardContent>
      </Card>
    </div>
  );
};