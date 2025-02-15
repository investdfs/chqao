
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StudyRecommendation {
  subject: string;
  currentHours: number;
  recommendedHours: number;
  questionsPerDay: number;
  status: 'danger' | 'warning' | 'success';
}

const PREVIEW_DATA: StudyRecommendation[] = [
  {
    subject: "História do Brasil",
    currentHours: 2,
    recommendedHours: 6,
    questionsPerDay: 20,
    status: 'warning'
  },
  {
    subject: "Geografia",
    currentHours: 1,
    recommendedHours: 4,
    questionsPerDay: 15,
    status: 'danger'
  },
  {
    subject: "Direito Constitucional",
    currentHours: 5,
    recommendedHours: 4,
    questionsPerDay: 10,
    status: 'success'
  }
];

export const usePerformanceData = (userId?: string) => {
  return useQuery({
    queryKey: ['performance-data', userId],
    queryFn: async () => {
      if (!userId || userId === 'preview-user-id') {
        console.log("Usando dados de preview para recomendações de estudo");
        return PREVIEW_DATA;
      }

      const { data, error } = await supabase
        .rpc('get_student_performance', {
          student_id_param: userId
        });

      if (error) {
        console.error('Erro ao buscar dados de performance:', error);
        return [];
      }

      console.log("Dados de performance obtidos:", data);
      return data;
    },
    enabled: !!userId
  });
};
