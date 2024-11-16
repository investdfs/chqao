import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  weeklyAccess = 0,
  newRegistrations = 0,
  topStudents = []
}: StatisticsCardsProps) => {
  const [showInfo, setShowInfo] = useState(false);

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

      <Card className="col-span-1 lg:col-span-3 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-primary">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Informações Gerais
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? (
                <>
                  Ocultar Informações
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Ver Informações
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {showInfo && (
          <CardContent className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-light p-4 rounded-lg">
                <p className="text-sm text-gray-600">Acessos na Semana</p>
                <p className="text-2xl font-bold text-primary">{weeklyAccess}</p>
              </div>
              <div className="bg-primary-light p-4 rounded-lg">
                <p className="text-sm text-gray-600">Novos Cadastros</p>
                <p className="text-2xl font-bold text-primary">{newRegistrations}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2 text-primary p-4 border-b">Ranking de Acessos</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-primary">Aluno</TableHead>
                    <TableHead className="text-right text-primary">Acessos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topStudents.map((student, index) => (
                    <TableRow key={index} className="hover:bg-primary-light">
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-right font-medium">{student.accessCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};