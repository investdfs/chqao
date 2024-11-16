import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StatisticsCardsProps {
  totalStudents: number;
  totalQuestions: number;
  weeklyAccess: number;
  newRegistrations: number;
  topStudents: Array<{
    name: string;
    accessCount: number;
  }>;
}

export const StatisticsCards = ({ 
  totalStudents, 
  totalQuestions, 
  weeklyAccess,
  newRegistrations,
  topStudents 
}: StatisticsCardsProps) => {
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

      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Acessos na Semana</p>
              <p className="text-2xl font-bold text-blue-600">{weeklyAccess}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Novos Cadastros</p>
              <p className="text-2xl font-bold text-green-600">{newRegistrations}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Ranking de Acessos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-right">Acessos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-right">{student.accessCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};