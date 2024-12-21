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
      console.log('Iniciando busca de estatísticas...');
      
      // Buscar total de questões regulares (apenas ativas)
      const { count: regularQuestionsCount, error: regularError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (regularError) {
        console.error('Erro ao buscar questões regulares:', regularError);
        toast({
          title: "Erro ao carregar estatísticas",
          description: "Não foi possível carregar as questões regulares.",
          variant: "destructive"
        });
        return;
      }

      console.log(`Total de questões regulares encontradas: ${regularQuestionsCount}`);

      // Buscar provas anteriores
      const { data: exams, error: examsError } = await supabase
        .from('previous_exams')
        .select('id');

      if (examsError) {
        console.error('Erro ao buscar provas:', examsError);
        toast({
          title: "Erro ao carregar provas",
          description: "Não foi possível carregar as provas anteriores.",
          variant: "destructive"
        });
        return;
      }

      const totalExams = exams?.length || 0;
      console.log(`Total de provas anteriores encontradas: ${totalExams}`);

      // Buscar questões de provas anteriores
      let examQuestionsCount = 0;
      if (totalExams > 0) {
        const examIds = exams.map(exam => exam.id);
        const { count, error: questionsError } = await supabase
          .from('previous_exam_questions')
          .select('*', { count: 'exact', head: true })
          .in('exam_id', examIds);

        if (questionsError) {
          console.error('Erro ao buscar questões de provas:', questionsError);
          toast({
            title: "Erro ao carregar questões",
            description: "Não foi possível carregar as questões das provas.",
            variant: "destructive"
          });
          return;
        }

        examQuestionsCount = count || 0;
        console.log(`Total de questões de provas encontradas: ${examQuestionsCount}`);
      }

      const newStats = {
        totalQuestions: (regularQuestionsCount || 0) + examQuestionsCount,
        previousExams: {
          total: totalExams,
          questions: examQuestionsCount
        }
      };

      console.log('Estatísticas atualizadas:', newStats);
      setStats(newStats);
      
      toast({
        title: "Estatísticas atualizadas",
        description: "Os dados foram carregados com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Ocorreu um erro ao carregar os dados. Tente novamente.",
        variant: "destructive"
      });
      // Manter as estatísticas anteriores em caso de erro
      setStats(prev => prev);
    }
  }, [toast]);

  return {
    stats,
    fetchStats
  };
};