import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatisticsCards } from "@/components/admin/StatisticsCards";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { StudentManager } from "@/components/admin/StudentManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download } from "lucide-react";
import { downloadExcelTemplate } from "@/utils/excelUtils";

// Mock data - Em uma aplicação real, viria do banco de dados
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

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />
        
        <StatisticsCards
          totalStudents={2}
          totalQuestions={questions.length}
          averagePerformance={78}
        />

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
                onClick={downloadExcelTemplate}
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
              <input
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    // Handle file upload
                  }
                }}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
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

        <StudentManager />
      </div>
    </div>
  );
};

export default AdminDashboard;
