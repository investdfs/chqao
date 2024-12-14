import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { StudyTimeCard } from "@/components/student/dashboard/StudyTimeCard";
import { PerformanceCard } from "@/components/student/dashboard/PerformanceCard";
import { SyllabusProgressCard } from "@/components/student/dashboard/SyllabusProgressCard";
import { StudyConsistency } from "@/components/student/dashboard/StudyConsistency";
import { SubjectsPanel } from "@/components/student/dashboard/SubjectsPanel";
import { WeeklyGoals } from "@/components/student/dashboard/WeeklyGoals";
import { WeeklyStudyChart } from "@/components/student/dashboard/WeeklyStudyChart";

const PreviewDashboard = () => {
  const navigate = useNavigate();

  // Mock data for preview mode
  const mockData = {
    studyStats: {
      total_study_time: "2h 30min",
      consecutive_study_days: 5,
      weekly_study_hours: 12,
      weekly_questions_target: 250,
      weekly_questions_completed: 175,
    },
    performance: {
      totalCorrect: 85,
      totalQuestions: 100,
      performancePercentage: 85,
    },
    syllabusProgress: {
      completed_topics: 15,
      pending_topics: 25,
      progress_percentage: 37.5,
    },
    weeklyStudyData: [
      { study_day: "Seg", question_count: 35, study_time: "1h 45min" },
      { study_day: "Ter", question_count: 42, study_time: "2h 10min" },
      { study_day: "Qua", question_count: 28, study_time: "1h 25min" },
      { study_day: "Qui", question_count: 45, study_time: "2h 15min" },
      { study_day: "Sex", question_count: 38, study_time: "1h 55min" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">
            CHQAO - Estude Praticando (Modo Preview)
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
          <StudyTimeCard totalTime={mockData.studyStats.total_study_time} />
          <PerformanceCard
            correctAnswers={mockData.performance.totalCorrect}
            incorrectAnswers={mockData.performance.totalQuestions - mockData.performance.totalCorrect}
            percentage={Math.round(mockData.performance.performancePercentage)}
          />
          <SyllabusProgressCard
            completedTopics={mockData.syllabusProgress.completed_topics}
            pendingTopics={mockData.syllabusProgress.pending_topics}
            percentage={mockData.syllabusProgress.progress_percentage}
          />
        </div>

        <StudyConsistency
          consecutiveDays={mockData.studyStats.consecutive_study_days}
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
                current: mockData.studyStats.weekly_study_hours,
                target: 35,
                percentage: (mockData.studyStats.weekly_study_hours / 35) * 100,
              }}
              questions={{
                completed: mockData.studyStats.weekly_questions_completed,
                target: mockData.studyStats.weekly_questions_target,
                percentage: (mockData.studyStats.weekly_questions_completed / mockData.studyStats.weekly_questions_target) * 100,
              }}
            />
            <WeeklyStudyChart data={mockData.weeklyStudyData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreviewDashboard;