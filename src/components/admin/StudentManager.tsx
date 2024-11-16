import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Plus, RefreshCw } from "lucide-react";

// Mock data - Em uma aplicação real, viria do banco de dados
const initialStudents = [
  { 
    id: 1, 
    name: "João Silva", 
    email: "joao@email.com", 
    password: "123456",
    status: "active",
    plan: "free" 
  },
  { 
    id: 2, 
    name: "Maria Santos", 
    email: "maria@email.com", 
    password: "654321",
    status: "blocked",
    plan: "paid" 
  },
];

export const StudentManager = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState(initialStudents);
  const [showStudents, setShowStudents] = useState(false);

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

  const handleRefreshList = () => {
    // Em uma aplicação real, isso faria uma nova chamada à API
    toast({
      title: "Lista atualizada",
      description: "A lista de alunos foi atualizada com sucesso.",
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
                    <Input placeholder="Nome do aluno" />
                  </div>
                  <div className="space-y-2">
                    <label>Email</label>
                    <Input type="email" placeholder="Email do aluno" />
                  </div>
                  <div className="space-y-2">
                    <label>Senha</label>
                    <Input type="password" placeholder="Senha inicial" />
                  </div>
                  <div className="space-y-2">
                    <label>Plano</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={() => {
                    toast({
                      title: "Aluno adicionado",
                      description: "O novo aluno foi cadastrado com sucesso.",
                    });
                  }}>
                    Adicionar Aluno
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleRefreshList}>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Senha</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.password}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.plan === "paid" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {student.plan === "paid" ? "Pago" : "Free"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {student.status === "active" ? "Ativo" : "Bloqueado"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(student.id)}
                      >
                        {student.status === "active" ? "Bloquear" : "Ativar"}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Dados do Aluno</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label>Nome</label>
                              <Input defaultValue={student.name} />
                            </div>
                            <div className="space-y-2">
                              <label>Email</label>
                              <Input defaultValue={student.email} />
                            </div>
                            <div className="space-y-2">
                              <label>Nova Senha</label>
                              <Input type="password" placeholder="Digite a nova senha" />
                            </div>
                            <div className="space-y-2">
                              <label>Plano</label>
                              <Select defaultValue={student.plan}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="free">Free</SelectItem>
                                  <SelectItem value="paid">Pago</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button className="w-full" onClick={() => {
                              toast({
                                title: "Dados atualizados",
                                description: "Os dados do aluno foram atualizados com sucesso.",
                              });
                            }}>
                              Salvar Alterações
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};