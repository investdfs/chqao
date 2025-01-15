import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface QuestionsStatsData {
  totalQuestions: number;
  previousExams: {
    total: number;
    questions: number;
  };
}

export const useQuestionsStats = () => {
  const [stats, setStats] = useState<QuestionsStatsData>({
    totalQuestions: 0,
    previousExams: {
      total: 0,
      questions: 0
    }
  });
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      console.log('Fetching questions statistics...');
      
      // Fetch total regular questions (only active)
      const { count: regularQuestionsCount, error: regularError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (regularError) {
        console.error('Error fetching regular questions:', regularError);
        throw regularError;
      }

      // Fetch previous exam questions count with retry logic
      const fetchExamStats = async (retryCount = 0) => {
        try {
          const { data: examStats, error: examError } = await supabase
            .from('previous_exams')
            .select(`
              id,
              previous_exam_questions (count)
            `);

          if (examError) {
            throw examError;
          }

          return {
            total: examStats?.length || 0,
            questions: examStats?.reduce((acc, exam) => 
              acc + (exam.previous_exam_questions?.length || 0), 0) || 0
          };
        } catch (error) {
          console.error(`Error fetching exam stats (attempt ${retryCount + 1}):`, error);
          if (retryCount < 2) { // Try up to 3 times
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return fetchExamStats(retryCount + 1);
          }
          throw error;
        }
      };

      const examStats = await fetchExamStats();

      const newStats = {
        totalQuestions: (regularQuestionsCount || 0) + examStats.questions,
        previousExams: examStats
      };

      console.log('Statistics updated:', newStats);
      setStats(newStats);
      
      return newStats;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  return {
    stats,
    fetchStats
  };
};