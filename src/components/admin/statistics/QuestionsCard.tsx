import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface QuestionsCardProps {
  totalQuestions: number;
}

export const QuestionsCard = ({ totalQuestions }: QuestionsCardProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-3">
        <CardTitle className="flex items-center gap-2 text-primary text-sm">
          <BookOpen className="h-4 w-4" />
          Questões
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
        <p className="text-xs text-gray-600">Questões cadastradas</p>
      </CardContent>
    </Card>
  );
};