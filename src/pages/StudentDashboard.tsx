import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StudyTimeCard } from "@/components/student/dashboard/StudyTimeCard";
import { PerformanceCard } from "@/components/student/dashboard/PerformanceCard";
import { SyllabusProgressCard } from "@/components/student/dashboard/SyllabusProgressCard";
import { StudyConsistency } from "@/components/student/dashboard/StudyConsistency";
import { SubjectsPanel } from "@/components/student/dashboard/SubjectsPanel";
import { WeeklyGoals } from "@/components/student/dashboard/WeeklyGoals";
import { WeeklyStudyChart } from "@/components/student/dashboard/WeeklyStudyChart";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch session data
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login');
        return null;
      }
      return session;
    },
  });

  // Fetch study statistics
  const { data: studyStats } = useQuery({
    queryKey: ['studyStats', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_study_stats', {
          student_id_param: session.user.id
        });

      if (error) {
        console.error('Error fetching study stats:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar estatísticas",
          description: "Não foi possível carregar suas estatísticas de estudo.",
        });
        return null;
      }

      return data[0];
    },
    enabled: !!session?.user?.id,
  });

  // Fetch syllabus progress
  const { data: syllabusProgress } = useQuery({
    queryKey: ['syllabusProgress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_syllabus_progress', {
          student_id_param: session.user.id
        });

      if (error) {
        console.error('Error fetching syllabus progress:', error);
        return null;
      }

      return data[0];
    },
    enabled: !!session?.user?.id,
  });

  // Fetch weekly study data
  const { data: weeklyStudyData } = useQuery({
    queryKey: ['weeklyStudyData', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_weekly_study_data', {
          student_id_param: session.user.id
        });

      if (error) {
        console.error('Error fetching weekly study data:', error);
        return null;
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch performance data
  const { data: performanceData } = useQuery({
    queryKey: ['studentPerformance', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_student_performance', {
          student_id_param: session.user.id
        });

      if (error) {
        console.error('Error fetching performance:', error);
        return null;
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const subjects = performanceData?.map(subject => ({
    name: subject.subject,
    studyTime: "10h06min", // This should come from the backend
    correctAnswers: Number(subject.correct_answers),
    incorrectAnswers: Number(subject.questions_answered - subject.correct_answers),
    totalQuestions: Number(subject.questions_answered),
    performance: (Number(subject.correct_answers) / Number(subject.questions_answered)) * 100 || 0,
  })) || [];

  const totalCorrect = subjects.reduce((sum, subject) => sum + subject.correctAnswers, 0);
  const totalQuestions = subjects.reduce((sum, subject) => sum + subject.totalQuestions, 0);
  const performancePercentage = (totalCorrect / totalQuestions) * 100 || 0;

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
            studied: Math.random() > 0.3, // This should come from the backend
          }))}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SubjectsPanel subjects={subjects} />
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
            <WeeklyStudyChart
              data={weeklyStudyData?.map(day => ({
                day: day.study_day,
                questions: Number(day.question_count),
                time: Number(day.study_time) / 3600, // Convert seconds to hours
              })) || []}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;