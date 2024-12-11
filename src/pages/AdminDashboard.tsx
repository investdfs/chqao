import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatisticsCards } from "@/components/admin/StatisticsCards";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { StudentManager } from "@/components/admin/StudentManager";
import { AdminManager } from "@/components/admin/AdminManager";
import { SyncDatabaseButton } from "@/components/admin/SyncDatabaseButton";
import { QuestionImporter } from "@/components/admin/QuestionImporter";
import { InsertQuestionsButton } from "@/components/admin/questions/InsertQuestionsButton";
import { QuestionsTreeStats } from "@/components/admin/questions/QuestionsTreeStats";
import { SubjectsPanel } from "@/components/admin/statistics/SubjectsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const { data: sheetsData, isLoading, refetch } = useGoogleSheetsData();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      setOnlineUsers(Math.floor(Math.random() * 10) + 1);
    }, 20000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    refetch();
    setOnlineUsers(Math.floor(Math.random() * 10) + 1);
  }, [refetch]);

  const students = sheetsData?.users.filter(user => user.type === 'student') || [];

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-[1600px]">
        <div className="mb-8 flex justify-between items-center">
          <DashboardHeader />
          <SyncDatabaseButton onRefetch={refetch} />
        </div>
        
        <div className="mb-8">
          <StatisticsCards
            totalStudents={students.length}
            onlineUsers={onlineUsers}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <SubjectsPanel />
            </div>
          </div>
          
          <div className="lg:col-span-9 space-y-8">
            <Card className="overflow-hidden">
              <CardHeader className="bg-white">
                <CardTitle>Estatísticas de Questões</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <QuestionsTreeStats />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-white">
                <CardTitle>Gerenciamento de Administradores</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AdminManager />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-white">
                <CardTitle>Gerenciamento de Estudantes</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <StudentManager />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-white">
                <CardTitle>Importar Questões</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <QuestionImporter />
                <div className="mt-4">
                  <InsertQuestionsButton />
                </div>
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="bg-white rounded-lg overflow-hidden">
              <AccordionItem value="subjects" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-semibold">Gerenciar Matérias</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <SubjectManager />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;