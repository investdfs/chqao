import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StudyTimeCard } from "@/components/student/dashboard/StudyTimeCard";
import { PerformanceCard } from "@/components/student/dashboard/PerformanceCard";
import { SyllabusProgressCard } from "@/components/student/dashboard/SyllabusProgressCard";
import { StudyConsistency } from "@/components/student/dashboard/StudyConsistency";
import { SubjectsPanel } from "@/components/student/dashboard/SubjectsPanel";
import { WeeklyGoals } from "@/components/student/dashboard/WeeklyGoals";
import { WeeklyStudyChart } from "@/components/student/dashboard/WeeklyStudyChart";
import { useStudentStats } from "@/components/student/dashboard/hooks/useStudentStats";
import { useStudentPerformance } from "@/components/student/dashboard/hooks/useStudentPerformance";
import { SubjectSelectionDialog } from "@/components/student/dialogs/SubjectSelectionDialog";
import { ExamSelectionDialog } from "@/components/student/dialogs/ExamSelectionDialog";
import { useToast } from "@/hooks/use-toast";

interface PreviewUser {
  id: string;
  email: string;
  name: string;
  status: string;
}

interface StudentDashboardProps {
  previewUser?: PreviewUser;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ previewUser }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [examDialogOpen, setExamDialogOpen] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      if (previewUser) {
        console.log("Usando dados de preview para sessão");
        return { user: previewUser };
      }
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login');
        return null;
      }
      return session;
    },
  });

  const userId = previewUser?.id || session?.user?.id;
  const isPreviewMode = !!previewUser;

  const { 
    studyStats, 
    syllabusProgress, 
    weeklyStudyData,
    loginDays = []
  } = useStudentStats(isPreviewMode ? undefined : userId);

  const { 
    totalCorrect,
    totalQuestions,
    performancePercentage
  } = useStudentPerformance(isPreviewMode ? undefined : userId);

  const handleSubjectSelect = (subject: string) => {
    setSubjectDialogOpen(false);
    console.log("Selected subject:", subject);
    navigate("/question-practice", { state: { selectedSubject: subject } });
  };

  const handleExamSelect = (year: number) => {
    setExamDialogOpen(false);
    console.log("Selected exam year:", year);
    navigate("/previous-exams", { state: { selectedYear: year } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">
            CHQAO - Estude Praticando
          </h1>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="hover:bg-primary-light/50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-primary rounded-xl shadow-lg p-8 mb-8 animate-fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Escolha seu modo de estudo
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setSubjectDialogOpen(true)}
              className="w-full sm:w-64 h-20 text-lg font-semibold bg-white hover:bg-gray-100 text-primary hover:text-primary-dark transition-all duration-300 flex items-center justify-center gap-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <BookOpen className="w-6 h-6" />
              Praticar Questões
            </Button>
            <Button
              onClick={() => setExamDialogOpen(true)}
              className="w-full sm:w-64 h-20 text-lg font-semibold bg-white hover:bg-gray-100 text-primary hover:text-primary-dark transition-all duration-300 flex items-center justify-center gap-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <History className="w-6 h-6" />
              Provas Anteriores
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StudyTimeCard totalTime={studyStats?.total_study_time || "0h"} />
          <PerformanceCard
            correctAnswers={totalCorrect}
            incorrectAnswers={totalQuestions - totalCorrect}
            percentage={Math.round(performancePercentage)}
          />
          <SyllabusProgressCard
            completedTopics={syllabusProgress?.completed_topics || 0}
            pendingTopics={syllabusProgress?.pending_topics || 0}
            percentage={Number(syllabusProgress?.progress_percentage) || 0}
          />
        </div>

        <StudyConsistency
          consecutiveDays={studyStats?.consecutive_study_days || 0}
          loginDays={loginDays}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SubjectsPanel />
          <div className="space-y-4">
            <WeeklyGoals
              studyHours={{
                current: Number(studyStats?.weekly_study_hours || 0),
                target: 35,
                percentage: (Number(studyStats?.weekly_study_hours || 0) / 35) * 100,
              }}
              questions={{
                completed: studyStats?.weekly_questions_completed || 0,
                target: studyStats?.weekly_questions_target || 250,
                percentage: ((studyStats?.weekly_questions_completed || 0) / (studyStats?.weekly_questions_target || 250)) * 100,
              }}
            />
            <WeeklyStudyChart data={weeklyStudyData || []} />
          </div>
        </div>
      </div>

      <SubjectSelectionDialog
        open={subjectDialogOpen}
        onOpenChange={setSubjectDialogOpen}
        onSubjectSelect={handleSubjectSelect}
      />

      <ExamSelectionDialog
        open={examDialogOpen}
        onOpenChange={setExamDialogOpen}
        onExamSelect={handleExamSelect}
      />
    </div>
  );
};

export default StudentDashboard;