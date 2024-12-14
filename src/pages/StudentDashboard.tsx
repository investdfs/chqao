import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StudyTimeCard } from "@/components/student/dashboard/StudyTimeCard";
import { PerformanceCard } from "@/components/student/dashboard/PerformanceCard";
import { SyllabusProgressCard } from "@/components/student/dashboard/SyllabusProgressCard";
import { StudyConsistency } from "@/components/student/dashboard/StudyConsistency";
import { SubjectsPanel } from "@/components/student/dashboard/SubjectsPanel";
import { WeeklyGoals } from "@/components/student/dashboard/WeeklyGoals";
import { WeeklyStudyChart } from "@/components/student/dashboard/WeeklyStudyChart";
import { useStudentStats } from "@/components/student/dashboard/hooks/useStudentStats";
import { useStudentPerformance } from "@/components/student/dashboard/hooks/useStudentPerformance";

interface PreviewUser {
  id: string;
  email: string;
  name: string;
  status: string;
}

interface StudentDashboardProps {
  previewUser?: PreviewUser;
}

const StudentDashboard = ({ previewUser }: StudentDashboardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Se estiver em preview, use os dados mockados
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

  // Mock data for preview mode
  const previewData = {
    studyStats: {
      total_study_time: '10h',
      consecutive_study_days: 5,
      weekly_study_hours: 20,
      weekly_questions_target: 250,
      weekly_questions_completed: 150
    },
    syllabusProgress: {
      completed_topics: 15,
      pending_topics: 25,
      progress_percentage: 37.5
    },
    weeklyStudyData: Array.from({ length: 7 }, (_, i) => ({
      study_day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      question_count: Math.floor(Math.random() * 50),
      study_time: '2h'
    })),
    performance: {
      totalCorrect: 75,
      totalQuestions: 100,
      performancePercentage: 75
    }
  };

  const userId = previewUser?.id || session?.user?.id;
  const isPreviewMode = !!previewUser;

  // Use mock data in preview mode, otherwise use real data
  const { 
    studyStats = isPreviewMode ? previewData.studyStats : undefined, 
    syllabusProgress = isPreviewMode ? previewData.syllabusProgress : undefined, 
    weeklyStudyData = isPreviewMode ? previewData.weeklyStudyData : undefined 
  } = useStudentStats(isPreviewMode ? undefined : userId);

  const { 
    totalCorrect = isPreviewMode ? previewData.performance.totalCorrect : 0,
    totalQuestions = isPreviewMode ? previewData.performance.totalQuestions : 0,
    performancePercentage = isPreviewMode ? previewData.performance.performancePercentage : 0
  } = useStudentPerformance(isPreviewMode ? undefined : userId);

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

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
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
          studyDays={Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            studied: Math.random() > 0.3,
          }))}
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
      </main>
    </div>
  );
};

export default StudentDashboard;