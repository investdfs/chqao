import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AnswerCount {
  option_letter: string;
  count: number;
}

export const useQuestionStats = (questionId: string) => {
  const { data: answerCounts, isLoading } = useQuery({
    queryKey: ["question-stats", questionId],
    queryFn: async () => {
      console.log("Buscando contagem de respostas para questão:", questionId);
      const { data, error } = await supabase
        .rpc("get_answer_counts", { question_id: questionId });

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        throw error;
      }

      console.log("Contagem de respostas:", data);
      return data as AnswerCount[];
    },
  });

  const totalAnswers = answerCounts?.reduce((sum, item) => sum + Number(item.count), 0) || 0;

  const chartData = answerCounts?.map(item => ({
    option: item.option_letter,
    count: item.count,
  })) || [];

  return {
    answerCounts,
    isLoading,
    totalAnswers,
    chartData
  };
};