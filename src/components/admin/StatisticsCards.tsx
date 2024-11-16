import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart2 } from "lucide-react";

interface StatisticsCardsProps {
  totalStudents: number;
  totalQuestions: number;
  averagePerformance: number;
}

export const StatisticsCards = ({ totalStudents, totalQuestions, averagePerformance }: StatisticsCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Total de Alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{totalStudents}</div>
          <p className="text-gray-600">Alunos cadastrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Questões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{totalQuestions}</div>
          <p className="text-gray-600">Questões cadastradas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Taxa de Aproveitamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{averagePerformance}%</div>
          <p className="text-gray-600">Média geral dos alunos</p>
        </CardContent>
      </Card>
    </div>
  );
};