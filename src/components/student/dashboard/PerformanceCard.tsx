import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PerformanceCardProps {
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
}

export const PerformanceCard = ({ 
  correctAnswers = 0, 
  incorrectAnswers = 0, 
  percentage = 0 
}: PerformanceCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">DESEMPENHO</CardTitle>
        <ChartBar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-success">{correctAnswers} Acertos</span>
          <span className="text-error">{incorrectAnswers} Erros</span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="text-2xl font-bold text-center">{percentage}%</div>
      </CardContent>
    </Card>
  );
};