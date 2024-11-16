import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Upload, Users, BookOpen, BarChart2, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [showStudents, setShowStudents] = useState(false);

  // Mock data - In a real app, this would come from your database
  const students = [
    { id: 1, name: "João Silva", email: "joao@email.com", status: "active" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", status: "blocked" },
  ];

  const handleAddSubject = () => {
    if (newSubject) {
      // Here you would add the subject to your database
      toast({
        title: "Matéria adicionada",
        description: `A matéria ${newSubject} foi adicionada com sucesso.`,
      });
      setNewSubject("");
    }
  };

  const handleAddTopic = () => {
    if (selectedSubject && newTopic) {
      // Here you would add the topic to your database
      toast({
        title: "Tópico adicionado",
        description: `O tópico ${newTopic} foi adicionado à matéria ${selectedSubject}.`,
      });
      setNewTopic("");
    }
  };

  const handleDownloadTemplate = () => {
    // Here you would generate and download the template file
    toast({
      title: "Download iniciado",
      description: "O modelo de planilha está sendo baixado.",
    });
  };

  const handleToggleStudentStatus = (studentId: number) => {
    // Here you would update the student's status in your database
    toast({
      title: "Status atualizado",
      description: "O status do aluno foi atualizado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-primary">CHQAO - Painel Administrativo</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Sair
          </Button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total de Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{students.length}</div>
              <p className="text-gray-600">Alunos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Questões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">150</div>
              <p className="text-gray-600">Questões no banco</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Taxa de Aproveitamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">78%</div>
              <p className="text-gray-600">Média geral dos alunos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Matérias e Tópicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Nome da nova matéria"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <Button className="w-full" onClick={handleAddSubject}>
                  Adicionar Matéria
                </Button>
              </div>

              <div className="space-y-2">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Nome do novo tópico"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                />
                <Button className="w-full" onClick={handleAddTopic}>
                  Adicionar Tópico
                </Button>
              </div>
            </CardContent>
          </Card>

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