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
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="gradient-text">Progresso por Matéria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {subjects.length > 0 ? (
            subjects.map((subject) => {
              const percentage = (subject.correctAnswers / subject.questionsAnswered) * 100 || 0;
              return (
                <div key={subject.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.correctAnswers}/{subject.questionsAnswered} questões
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2 transition-all duration-300"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {percentage.toFixed(0)}% de aproveitamento
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Nenhuma questão respondida ainda
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};