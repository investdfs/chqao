import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatisticsCards } from "@/components/admin/StatisticsCards";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { StudentManager } from "@/components/admin/StudentManager";
import { AdminManager } from "@/components/admin/AdminManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download } from "lucide-react";
import { downloadExcelTemplate } from "@/utils/excelUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const { data: sheetsData, isLoading, refetch } = useGoogleSheetsData();
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Refresh data every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      // Simulating online users count (replace with actual implementation)
      setOnlineUsers(Math.floor(Math.random() * 10) + 1);
    }, 20000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Initial data fetch
  useEffect(() => {
    refetch();
    setOnlineUsers(Math.floor(Math.random() * 10) + 1);
  }, [refetch]);

  const students = sheetsData?.users.filter(user => user.type === 'student') || [];
  const questions = sheetsData?.questions || [];

  // Mock data for top students (replace with actual data)
  const mockTopStudents = [
    { name: "João Silva", accessCount: 25 },
    { name: "Maria Santos", accessCount: 20 },
    { name: "Pedro Oliveira", accessCount: 15 },
  ];

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />
        
        <StatisticsCards
          totalStudents={students.length}
          totalQuestions={questions.length}
          weeklyAccess={150}
          newRegistrations={5}
          onlineUsers={onlineUsers}
          topStudents={mockTopStudents}
        />

        <AdminManager />
        
        <StudentManager />

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="general-info">
            <AccordionTrigger className="text-lg font-semibold">
              Informações Gerais
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <SubjectManager />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="import-questions">
            <AccordionTrigger className="text-lg font-semibold">
              Importar Questões
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
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
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default AdminDashboard;