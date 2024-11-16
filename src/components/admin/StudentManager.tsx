import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Plus, RefreshCw } from "lucide-react";
import { StudentList } from "./StudentList";

export const StudentManager = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [showStudents, setShowStudents] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'free'
  });

  const handleToggleStatus = (studentId: number) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, status: student.status === "active" ? "blocked" : "active" }
          : student
      )
    );

    toast({
      title: "Status atualizado",
      description: "O status do aluno foi atualizado com sucesso.",
    });
  };

  const handleAddStudent = () => {
    const newStudentData = {
      id: Date.now(),
      ...newStudent,
      status: "active"
    };
    
    const updatedStudents = [...students, newStudentData];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    
    toast({
      title: "Aluno adicionado",
      description: "O novo aluno foi cadastrado com sucesso.",
    });
  };

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
                  <div className="space-y-2">
                    <label>Plano</label>
                    <Select 
                      value={newStudent.plan}
                      onValueChange={(value) => setNewStudent({...newStudent, plan: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleAddStudent}>
                    Adicionar Aluno
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => {
              const savedStudents = localStorage.getItem('students');
              if (savedStudents) {
                setStudents(JSON.parse(savedStudents));
              }
              toast({
                title: "Lista atualizada",
                description: "A lista de alunos foi atualizada com sucesso.",
              });
            }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Lista
            </Button>
            <Button onClick={() => setShowStudents(!showStudents)}>
              <Eye className="h-4 w-4 mr-2" />
              {showStudents ? "Ocultar" : "Ver Alunos"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {showStudents && (
        <CardContent>
          <StudentList students={students} onToggleStatus={handleToggleStatus} />
        </CardContent>
      )}
    </Card>
  );
};