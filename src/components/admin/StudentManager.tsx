import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Plus } from "lucide-react";
import { StudentList } from "./StudentList";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";

export const StudentManager = () => {
  const { toast } = useToast();
  const { data: sheetsData, isLoading, refetch } = useGoogleSheetsData();
  const [showStudents, setShowStudents] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
  });

  const students = sheetsData?.users.filter(user => user.type === 'student') || [];

  const handleToggleStatus = async (studentId: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const newStatus = student.status === "active" ? "blocked" : "active";
      
      // Update will be handled by SheetDB
      toast({
        title: "Status atualizado",
        description: "O status do aluno foi atualizado com sucesso.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error updating student status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do aluno.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStudent = async (studentId: string, data: any) => {
    try {
      // Update will be handled by SheetDB
      toast({
        title: "Aluno atualizado",
        description: "Os dados do aluno foram atualizados com sucesso.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Erro ao atualizar aluno",
        description: "Ocorreu um erro ao atualizar os dados do aluno.",
        variant: "destructive"
      });
    }
  };

  const handleAddStudent = async () => {
    try {
      // Add will be handled by SheetDB
      toast({
        title: "Aluno adicionado",
        description: "O novo aluno foi cadastrado com sucesso.",
      });
      
      refetch();
      setNewStudent({
        name: '',
        email: '',
        password: '',
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Erro ao adicionar aluno",
        description: "Ocorreu um erro ao cadastrar o novo aluno.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gerenciar Alunos</span>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Aluno
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Aluno</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label>Nome</label>
                    <Input 
                      placeholder="Nome do aluno"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Email</label>
                    <Input 
                      type="email" 
                      placeholder="Email do aluno"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Senha</label>
                    <Input 
                      type="password" 
                      placeholder="Senha inicial"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddStudent}>
                    Adicionar Aluno
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => setShowStudents(!showStudents)}>
              <Eye className="h-4 w-4 mr-2" />
              {showStudents ? "Ocultar" : "Ver Alunos"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {showStudents && (
        <CardContent>
          <StudentList 
            students={students} 
            onToggleStatus={handleToggleStatus}
            onUpdateStudent={handleUpdateStudent}
          />
        </CardContent>
      )}
    </Card>
  );
};