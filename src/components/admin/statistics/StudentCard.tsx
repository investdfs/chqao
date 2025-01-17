import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminManager } from "../AdminManager";
import { StudentManager } from "../StudentManager";

interface StudentCardProps {
  totalStudents: number;
  totalAdmins?: number;
}

export const StudentCard = ({ totalStudents, totalAdmins = 0 }: StudentCardProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-3">
        <CardTitle className="flex items-center gap-2 text-primary text-sm">
          <Users className="h-4 w-4" />
          Total de Usuários
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-4">
        <div>
          <div className="text-2xl font-bold text-primary">{totalStudents}</div>
          <p className="text-xs text-gray-600">Alunos cadastrados</p>
        </div>
        
        <div>
          <div className="text-xl font-bold text-secondary">{totalAdmins}</div>
          <p className="text-xs text-gray-600">Administradores</p>
        </div>

        <div className="flex flex-col gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Gerenciar Alunos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gerenciamento de Alunos</DialogTitle>
              </DialogHeader>
              <StudentManager />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Gerenciar Admins
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gerenciamento de Administradores</DialogTitle>
              </DialogHeader>
              <AdminManager />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};