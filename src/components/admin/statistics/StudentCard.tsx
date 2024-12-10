import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface StudentCardProps {
  totalStudents: number;
}

export const StudentCard = ({ totalStudents }: StudentCardProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-primary text-sm">
          <Users className="h-4 w-4" />
          Total de Alunos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold text-primary">{totalStudents}</div>
        <p className="text-xs text-gray-600">Alunos cadastrados</p>
      </CardContent>
    </Card>
  );
};