import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatisticsCards } from "@/components/admin/StatisticsCards";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { StudentManager } from "@/components/admin/StudentManager";
import { AdminManager } from "@/components/admin/AdminManager";
import { SyncDatabaseButton } from "@/components/admin/SyncDatabaseButton";
import { QuestionImporter } from "@/components/admin/QuestionImporter";
import { InsertQuestionsButton } from "@/components/admin/questions/InsertQuestionsButton";
import { QuestionsTreeStats } from "@/components/admin/questions/QuestionsTreeStats";
import { SubjectsDialog } from "@/components/admin/statistics/SubjectsDialog";
import { AuthToggleCard } from "@/components/admin/AuthToggleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

const AdminDashboard = () => {
  const { data: sheetsData, isLoading, refetch } = useGoogleSheetsData();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [showSubjectsDialog, setShowSubjectsDialog] = useState(false);

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
        <div className="flex justify-between items-center">
          <DashboardHeader />
          <div className="flex gap-2">
            <Button
              onClick={() => setShowSubjectsDialog(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <BookOpen className="h-4 w-4" />
              QUESTÕES POR MATÉRIA
            </Button>
            <SyncDatabaseButton />
          </div>
        </div>
        
        <StatisticsCards
          totalStudents={students.length}
          onlineUsers={onlineUsers}
        />

        <div className="grid grid-cols-12 gap-6">          
          <div className="col-span-12 space-y-6">
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
                <div className="mt-4">
                  <InsertQuestionsButton />
                </div>
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
      <SubjectsDialog open={showSubjectsDialog} onOpenChange={setShowSubjectsDialog} />
    </div>
  );
};

export default AdminDashboard;