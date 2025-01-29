import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PerformanceData {
  totalCorrect: number;
  totalQuestions: number;
  performancePercentage: number;
}

const PREVIEW_DATA: PerformanceData = {
  totalCorrect: 75,
  totalQuestions: 100,
  performancePercentage: 75
};

export const useStudentPerformance = (userId?: string) => {
  return useQuery({
    queryKey: ['student-performance', userId],
    queryFn: async () => {
      // Return preview data if no userId or in preview mode
      if (!userId || userId === 'preview-user-id') {
        console.log("Modo preview - retornando dados de preview para performance");
        return PREVIEW_DATA;
      }

      console.log("Buscando dados de performance para usuário:", userId);

      try {
        const { data: answers, error } = await supabase
          .from('question_answers')
          .select(`
            created_at,
            questions!inner(
              correct_answer
            ),
            selected_option
          `)
          .eq('student_id', userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Erro ao buscar performance:', error);
          return {
            totalCorrect: 0,
            totalQuestions: 0,
            performancePercentage: 0
          };
        }

        const totalQuestions = answers.length;
        const totalCorrect = answers.filter(
          answer => answer.selected_option === answer.questions.correct_answer
        ).length;

        const performancePercentage = totalQuestions > 0
          ? (totalCorrect / totalQuestions) * 100
          : 0;

        console.log("Dados de performance processados:", {
          totalCorrect,
          totalQuestions,
          performancePercentage
        });

        return {
          totalCorrect,
          totalQuestions,
          performancePercentage
        };
      } catch (error) {
        console.error('Erro ao processar performance:', error);
        return {
          totalCorrect: 0,
          totalQuestions: 0,
          performancePercentage: 0
        };
      }
    },
    enabled: true
  });
};