import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Plus } from "lucide-react";
import { StudentList } from "./StudentList";
import { useStudentManager } from "./manager/useStudentManager";
import { AddStudentForm } from "./manager/AddStudentForm";

export const StudentManager = () => {
  const {
    showStudents,
    setShowStudents,
    newStudent,
    setNewStudent,
    students,
    isLoading,
    handleToggleStatus,
    handleUpdateStudent,
    handleAddStudent
  } = useStudentManager();

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
                <AddStudentForm
                  newStudent={newStudent}
                  onStudentChange={(field, value) => 
                    setNewStudent(prev => ({ ...prev, [field]: value }))
                  }
                  onSubmit={handleAddStudent}
                />
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