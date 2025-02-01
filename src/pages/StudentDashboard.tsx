import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/student/dashboard/DashboardHeader";
import { StudyTimeCard } from "@/components/student/dashboard/StudyTimeCard";
import { PerformanceCard } from "@/components/student/dashboard/PerformanceCard";
import { WeeklyGoals } from "@/components/student/dashboard/WeeklyGoals";
import { StudyStreak } from "@/components/student/dashboard/StudyStreak";
import { ProductiveHours } from "@/components/student/dashboard/ProductiveHours";
import { useStudentStats } from "@/components/student/dashboard/hooks/useStudentStats";
import { useStudentPerformance } from "@/components/student/dashboard/hooks/useStudentPerformance";
import { SubjectSelectionDialog } from "@/components/student/dialogs/SubjectSelectionDialog";
import { ExamSelectionDialog } from "@/components/student/dialogs/ExamSelectionDialog";
import { StudyModeSelector } from "@/components/student/dashboard/StudyModeSelector";
import { RecommendedTopics } from "@/components/student/dashboard/RecommendedTopics";
import { PerformanceEvolutionCard } from "@/components/student/dashboard/PerformanceEvolutionCard";
import { StudyCalendar } from "@/components/student/dashboard/StudyCalendar";
import { DifficultyTags } from "@/components/student/dashboard/DifficultyTags";

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

  const userId = session?.user?.id;
  const isPreviewMode = !!previewUser;

  const { data: performanceData } = useStudentPerformance(isPreviewMode ? 'preview-user-id' : userId);

  const previewData = {
    studyStats: {
      total_study_time: '10h',
      consecutive_study_days: 5,
      weekly_study_hours: 20,
      weekly_questions_target: 250,
      weekly_questions_completed: 150
    },
    weeklyStudyData: Array.from({ length: 7 }, (_, i) => ({
      study_day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      question_count: Math.floor(Math.random() * 50),
      study_time: '2h'
    }))
  };

  const { 
    studyStats = isPreviewMode ? previewData.studyStats : undefined, 
    weeklyStudyData = isPreviewMode ? previewData.weeklyStudyData : undefined 
  } = useStudentStats(isPreviewMode ? undefined : userId);

  const handleSubjectSelect = (subject: string) => {
    setSubjectDialogOpen(false);
    console.log("Selected subject:", subject);
    navigate("/question-practice?subject=" + encodeURIComponent(subject));
  };

  const handleExamSelect = (year: number) => {
    setExamDialogOpen(false);
    console.log("Selected exam year:", year);
    navigate("/previous-exams", { state: { selectedYear: year } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <StudyModeSelector 
          onPracticeClick={() => setSubjectDialogOpen(true)}
          onExamClick={() => setExamDialogOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StudyTimeCard totalTime={studyStats?.total_study_time || "0h"} />
          <PerformanceCard />
          <StudyStreak />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StudyCalendar userId={userId} />
          <DifficultyTags userId={userId} />
        </div>

        <PerformanceEvolutionCard userId={userId} />

        <RecommendedTopics userId={userId} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
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
          </div>
          <ProductiveHours />
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