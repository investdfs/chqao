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
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center gap-2">
          <DashboardHeader />
          <div className="flex items-center gap-2">
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
            <AuthToggleCard />
            <QuestionsTreeStats />
            <AdminManager />
            <StudentManager />

            <Card>
              <CardHeader>
                <CardTitle>Importar Questões</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionImporter />
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="subjects" className="bg-white">
                <AccordionTrigger className="text-lg font-semibold px-4">
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