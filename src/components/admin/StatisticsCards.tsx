import { useQueryClient } from "@tanstack/react-query";
import { StudentCard } from "./statistics/StudentCard";
import { QuestionsCard } from "./statistics/QuestionsCard";
import { PreviousExamsCard } from "./statistics/PreviousExamsCard";
import { useQuestionsStats } from "./statistics/questions/QuestionsStats";
import { useRealtimeSessions } from "./statistics/hooks/useRealtimeSessions";
import { useRealtimeQuestions } from "./statistics/hooks/useRealtimeQuestions";
import { useToast } from "@/components/ui/use-toast";

interface StatisticsCardsProps {
  totalStudents: number;
  onlineUsers: number;
}

export const StatisticsCards = ({ 
  totalStudents: initialTotalStudents,
  onlineUsers: initialOnlineUsers,
}: StatisticsCardsProps) => {
  const { stats, fetchStats } = useQuestionsStats();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Subscribe to query cache updates
  useQueryClient().getQueryCache().subscribe(() => {
    console.log('Query cache updated, refreshing statistics...');
    fetchStats().catch(error => {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    });
  });

  // Initialize real-time sessions tracking
  useRealtimeSessions();

  // Initialize real-time questions tracking
  useRealtimeQuestions(fetchStats);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-6">
        <StudentCard totalStudents={initialTotalStudents} />
        <QuestionsCard 
          totalQuestions={stats.totalQuestions} 
          stats={stats}
        />
        <PreviousExamsCard 
          totalExams={stats.previousExams.total}
          totalQuestions={stats.previousExams.questions}
          onReset={fetchStats}
        />
      </div>
    </div>
  );
};