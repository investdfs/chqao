import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, ShieldCheck } from "lucide-react";
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
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Users className="h-5 w-5" />
          Usuários do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-medium">Alunos</span>
            </div>
            <div className="text-2xl font-bold text-primary">{totalStudents}</div>
            <p className="text-xs text-gray-600 mt-1">Cadastrados</p>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-secondary mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Admins</span>
            </div>
            <div className="text-2xl font-bold text-secondary">{totalAdmins}</div>
            <p className="text-xs text-gray-600 mt-1">Ativos</p>
          </div>
        </div>

        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-primary/5 hover:bg-primary/10 border-primary/20"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
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
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-secondary/5 hover:bg-secondary/10 border-secondary/20"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
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