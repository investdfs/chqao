import { useQueryClient } from "@tanstack/react-query";
import { StudentCard } from "./statistics/StudentCard";
import { QuestionsCard } from "./statistics/QuestionsCard";
import { PreviousExamsCard } from "./statistics/PreviousExamsCard";
import { useQuestionsStats } from "./statistics/questions/QuestionsStats";
import { useRealtimeSessions } from "./statistics/hooks/useRealtimeSessions";
import { useRealtimeQuestions } from "./statistics/hooks/useRealtimeQuestions";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useCallback } from "react";
import { debounce } from "lodash";

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

  // Debounce the fetchStats function to prevent rapid consecutive calls
  const debouncedFetchStats = useCallback(
    debounce(async () => {
      console.log('Debounced fetch stats called');
      try {
        await fetchStats();
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: "Erro ao atualizar estatísticas",
          description: "Tente novamente mais tarde",
          variant: "destructive"
        });
      }
    }, 1000),
    [fetchStats, toast]
  );

  // Subscribe to query cache updates with cleanup
  useEffect(() => {
    console.log('Setting up query cache subscription...');
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      console.log('Query cache updated, triggering debounced refresh...');
      debouncedFetchStats();
    });

    return () => {
      console.log('Cleaning up query cache subscription...');
      unsubscribe();
      debouncedFetchStats.cancel();
    };
  }, [queryClient, debouncedFetchStats]);

  // Initialize real-time sessions tracking
  useRealtimeSessions();

  // Initialize real-time questions tracking
  useRealtimeQuestions(debouncedFetchStats);

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
          onReset={debouncedFetchStats}
        />
      </div>
    </div>
  );
};