import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Check, ChartLine, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Subject {
  name: string;
  studyTime: string;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  performance: number;
}

interface SubjectsPanelProps {
  subjects: Subject[];
}

export const SubjectsPanel = ({ subjects }: SubjectsPanelProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">PAINEL</CardTitle>
        <Book className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-[2fr,1fr,repeat(4,auto)] gap-4 text-sm font-medium text-muted-foreground">
            <div>Disciplinas</div>
            <div>Tempo</div>
            <Check className="h-4 w-4" />
            <ChartLine className="h-4 w-4" />
            <Clock className="h-4 w-4" />
            <div>%</div>
          </div>
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr,1fr,repeat(4,auto)] gap-4 text-sm items-center"
            >
              <div>{subject.name}</div>
              <div>{subject.studyTime}</div>
              <div className="text-success">{subject.correctAnswers}</div>
              <div className="text-error">{subject.incorrectAnswers}</div>
              <div>{subject.totalQuestions}</div>
              <div className="w-12">
                <Progress value={subject.performance} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};