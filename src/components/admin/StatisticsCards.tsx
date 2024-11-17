import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Signal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StatisticsCardsProps {
  totalStudents: number;
  totalQuestions: number;
  onlineUsers: number;
}

export const StatisticsCards = ({ 
  totalStudents, 
  totalQuestions, 
  onlineUsers = 0,
}: StatisticsCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            Total de Alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{totalStudents}</div>
          <p className="text-gray-600">Alunos cadastrados</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            Questões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{totalQuestions}</div>
          <p className="text-gray-600">Questões cadastradas</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Signal className="h-5 w-5" />
            Usuários Online
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{onlineUsers}</div>
          <p className="text-gray-600">Atualmente ativos</p>
        </CardContent>
      </Card>
    </div>
  );
};