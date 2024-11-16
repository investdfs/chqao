import { useState } from "react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatisticsCards } from "@/components/admin/StatisticsCards";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [showStudents, setShowStudents] = useState(false);

  // Mock data - Em uma aplicação real, viria do banco de dados
  const students = [
    { id: 1, name: "João Silva", email: "joao@email.com", status: "active" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", status: "blocked" },
  ];

  const handleDownloadTemplate = () => {
    toast({
      title: "Download iniciado",
      description: "O modelo de planilha está sendo baixado.",
    });
  };

  const handleToggleStudentStatus = (studentId: number) => {
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

              <Button className="w-full flex items-center gap-2" onClick={handleDownloadTemplate}>
                <Download className="h-4 w-4" />
                Baixar Modelo de Planilha
              </Button>

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
              <Button onClick={() => setShowStudents(!showStudents)}>
                {showStudents ? "Ocultar Alunos" : "Ver Alunos"}
              </Button>
            </CardTitle>
          </CardHeader>
          {showStudents && (
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
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