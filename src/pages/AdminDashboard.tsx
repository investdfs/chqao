import { useState } from "react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatisticsCards } from "@/components/admin/StatisticsCards";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Plus, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [showStudents, setShowStudents] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  // Mock data - Em uma aplicação real, viria do banco de dados
  const students = [
    { 
      id: 1, 
      name: "João Silva", 
      email: "joao@email.com", 
      password: "123456", // Em produção, isso seria criptografado
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

  const questions = [
    {
      id: 1,
      subject: "Matemática",
      topic: "Álgebra",
      question: "Quanto é 2 + 2?",
      correctAnswer: "4",
      difficulty: "Fácil"
    },
    // ... mais questões aqui
  ];

  const handleDownloadTemplate = () => {
    // Criar dados da planilha modelo
    const headers = ["Matéria", "Tópico", "Questão", "Resposta Correta", "Dificuldade"];
    const data = [
      ["Matemática", "Álgebra", "Quanto é 2 + 2?", "4", "Fácil"],
      ["Português", "Gramática", "O que é um substantivo?", "Palavra que nomeia seres", "Médio"]
    ];

    // Converter para CSV
    const csvContent = [
      headers.join(","),
      ...data.map(row => row.join(","))
    ].join("\n");

    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "modelo_questoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleStudentStatus = (studentId: number) => {
    // Em uma aplicação real, isso seria uma chamada à API
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          status: student.status === "active" ? "blocked" : "active"
        };
      }
      return student;
    });

    toast({
      title: "Status atualizado",
      description: "O status do aluno foi atualizado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />
        
        <StatisticsCards
          totalStudents={students.length}
          totalQuestions={150}
          averagePerformance={78}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <SubjectManager />

          <Card>
            <CardHeader>
              <CardTitle>Importar Questões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium">Instruções para importação:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Baixe o modelo de planilha clicando no botão abaixo</li>
                  <li>Preencha as questões seguindo o formato do modelo</li>
                  <li>Não modifique as colunas ou sua ordem</li>
                  <li>Salve o arquivo em formato .xlsx ou .csv</li>
                  <li>Faça upload do arquivo preenchido</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="w-full flex items-center gap-2" 
                  onClick={handleDownloadTemplate}
                >
                  <Download className="h-4 w-4" />
                  Baixar Modelo de Planilha
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Ver Questões
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Questões Cadastradas</DialogTitle>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matéria</TableHead>
                          <TableHead>Tópico</TableHead>
                          <TableHead>Questão</TableHead>
                          <TableHead>Resposta</TableHead>
                          <TableHead>Dificuldade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {questions.map((question) => (
                          <TableRow key={question.id}>
                            <TableCell>{question.subject}</TableCell>
                            <TableCell>{question.topic}</TableCell>
                            <TableCell>{question.question}</TableCell>
                            <TableCell>{question.correctAnswer}</TableCell>
                            <TableCell>{question.difficulty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      toast({
                        title: "Arquivo recebido",
                        description: "Processando arquivo de questões...",
                      });
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Clique para fazer upload ou arraste um arquivo
                  </span>
                  <span className="text-xs text-gray-400">
                    Suporta arquivos CSV e Excel
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

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
                <Button onClick={() => setShowStudents(!showStudents)}>
                  {showStudents ? "Ocultar Alunos" : "Ver Alunos"}
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
                            onClick={() => handleToggleStudentStatus(student.id)}
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
      </div>
    </div>
  );
};

export default AdminDashboard;