import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isValidUUID } from "@/utils/validation";
import { PREVIEW_PERFORMANCE_DATA } from "@/constants/previewData";

interface PerformanceData {
  correctAnswers: number;
  totalQuestions: number;
  studyTime: string;
  averageTime: string;
}

const calculateStudyTime = (answers: any[]): string => {
  const totalMinutes = answers.length * 2; // Estimativa de 2 minutos por questão
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}min`;
};

const calculateAverageTime = (answers: any[]): string => {
  if (answers.length === 0) return "0min";
  const avgMinutes = 2; // Média estimada por questão
  return `${avgMinutes}min`;
};

export const useStudentPerformance = (userId?: string) => {
  return useQuery({
    queryKey: ['student-performance', userId],
    queryFn: async () => {
      console.log("Iniciando busca de performance para usuário:", userId);

      if (!userId || !isValidUUID(userId)) {
        console.log("Modo preview ou UUID inválido, retornando dados de exemplo");
        return PREVIEW_PERFORMANCE_DATA;
      }

      try {
        const { data: answers, error } = await supabase
          .from('question_answers')
          .select(`
            id,
            questions!inner(
              correct_answer
            ),
            selected_option
          `)
          .eq('student_id', userId);

        if (error) {
          console.error('Erro ao buscar respostas:', error);
          throw error;
        }

        const totalQuestions = answers.length;
        const correctAnswers = answers.filter(
          answer => answer.selected_option === answer.questions.correct_answer
        ).length;

        const studyTime = calculateStudyTime(answers);
        const averageTime = calculateAverageTime(answers);

        console.log("Performance calculada:", {
          correctAnswers,
          totalQuestions,
          studyTime,
          averageTime
        });

        return {
          correctAnswers,
          totalQuestions,
          studyTime,
          averageTime
        };
      } catch (error) {
        console.error('Erro ao processar performance:', error);
        return PREVIEW_PERFORMANCE_DATA;
      }
    },
    enabled: true
  });
};