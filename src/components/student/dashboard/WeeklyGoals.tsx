import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeeklyGoalsProps {
  studyHours: {
    current: number;
    target: number;
    percentage: number;
  };
  questions: {
    completed: number;
    target: number;
    percentage: number;
  };
}

export const WeeklyGoals = ({ studyHours, questions }: WeeklyGoalsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">METAS DE ESTUDO SEMANAL</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Horas de Estudo</span>
            <span>{studyHours.current}/{studyHours.target}h</span>
          </div>
          <Progress value={studyHours.percentage} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Questões</span>
            <span>{questions.completed}/{questions.target}</span>
          </div>
          <Progress value={questions.percentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};