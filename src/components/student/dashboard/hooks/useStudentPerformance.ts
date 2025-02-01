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

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const fetchPerformanceData = async (userId: string): Promise<PerformanceData> => {
  console.log("Buscando dados de performance para usuário:", userId);

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
    throw error;
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
};

export const useStudentPerformance = (userId?: string) => {
  return useQuery({
    queryKey: ['student-performance', userId],
    queryFn: async () => {
      if (!userId || userId === 'preview-user-id' || !isValidUUID(userId)) {
        console.log("Modo preview ou UUID inválido - retornando dados de preview para performance");
        return PREVIEW_DATA;
      }

      try {
        return await fetchPerformanceData(userId);
      } catch (error) {
        console.error('Erro ao processar performance:', error);
        return PREVIEW_DATA;
      }
    },
    enabled: true
  });
};