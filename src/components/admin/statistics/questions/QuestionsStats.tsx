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

      // Fetch previous exam questions count
      const { count: examQuestionsCount, error: examError } = await supabase
        .from('previous_exam_questions')
        .select('*', { count: 'exact', head: true });

      if (examError) {
        console.error('Error fetching exam questions:', examError);
        throw examError;
      }

      // Fetch previous exams statistics
      const { data: examStats, error: examStatsError } = await supabase
        .from('previous_exams')
        .select('id, year')
        .order('year', { ascending: false });

      if (examStatsError) {
        console.error('Error fetching exam stats:', examStatsError);
        throw examStatsError;
      }

      const totalExams = examStats?.length || 0;

      const updatedStats = {
        totalQuestions: (regularQuestionsCount || 0) + (examQuestionsCount || 0),
        previousExams: {
          total: totalExams,
          questions: examQuestionsCount || 0
        }
      };

      console.log('Statistics updated:', updatedStats);
      setStats(updatedStats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    stats,
    fetchStats
  };
};