import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatisticsCards } from "@/components/admin/StatisticsCards";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { StudentManager } from "@/components/admin/StudentManager";
import { AdminManager } from "@/components/admin/AdminManager";
import { SyncDatabaseButton } from "@/components/admin/SyncDatabaseButton";
import { QuestionImporter } from "@/components/admin/QuestionImporter";
import { QuestionsTreeStats } from "@/components/admin/questions/QuestionsTreeStats";
import { DetailedStatsPanel } from "@/components/admin/statistics/DetailedStatsPanel";
import { AuthToggleCard } from "@/components/admin/AuthToggleCard";
import { SubjectsDialog } from "@/components/admin/statistics/SubjectsDialog";
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
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex items-center justify-center">
        <div className="animate-pulse text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#221F26] to-[#1A1F2C]">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="space-y-6">
          <DashboardHeader />
          
          <div className="flex justify-end items-center gap-2">
            <SubjectsDialog />
            <SyncDatabaseButton />
          </div>
        </div>
        
        <StatisticsCards
          totalStudents={students.length}
          onlineUsers={onlineUsers}
        />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-6">
            <DetailedStatsPanel />
            
            <div className="grid md:grid-cols-2 gap-6">
              <AuthToggleCard />
              <QuestionsTreeStats />
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <AdminManager />
                <StudentManager />
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Importar Questões</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionImporter />
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="subjects" className="bg-white/5 border-white/10 rounded-lg">
                <AccordionTrigger className="text-lg font-semibold px-4 text-white">
                  Gerenciar Matérias
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <SubjectManager />
                  </div>
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