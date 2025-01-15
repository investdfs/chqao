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
      
      // Buscar total de questões ativas
      const { count: activeQuestionsCount, error: activeError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (activeError) {
        console.error('Error fetching active questions:', activeError);
        throw activeError;
      }

      // Buscar questões de provas anteriores
      const { count: examQuestionsCount, error: examError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('is_from_previous_exam', true);

      if (examError) {
        console.error('Error fetching exam questions:', examError);
        throw examError;
      }

      // Buscar total de provas anteriores
      const { data: examStats, error: examStatsError } = await supabase
        .from('previous_exams')
        .select('id');

      if (examStatsError) {
        console.error('Error fetching exam stats:', examStatsError);
        throw examStatsError;
      }

      const updatedStats = {
        totalQuestions: activeQuestionsCount || 0,
        previousExams: {
          total: examStats?.length || 0,
          questions: examQuestionsCount || 0
        }
      };

      console.log('Statistics updated:', updatedStats);
      setStats(updatedStats);
      
      return updatedStats;
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