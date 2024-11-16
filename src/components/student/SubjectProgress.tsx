import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SubjectProgressProps {
  subjects: {
    name: string;
    questionsAnswered: number;
    correctAnswers: number;
  }[];
}

export const SubjectProgress = ({ subjects }: SubjectProgressProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Progresso por Matéria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject) => {
            const percentage = (subject.correctAnswers / subject.questionsAnswered) * 100 || 0;
            return (
              <div key={subject.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {subject.correctAnswers}/{subject.questionsAnswered} questões
                  </span>
                </div>
                <Progress value={percentage} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};