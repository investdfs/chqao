import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface QuestionsCardProps {
  totalQuestions: number;
}

export const QuestionsCard = ({ totalQuestions }: QuestionsCardProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-primary text-sm">
          <BookOpen className="h-4 w-4" />
          Questões
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
        <p className="text-xs text-gray-600">Questões cadastradas</p>
      </CardContent>
    </Card>
  );
};