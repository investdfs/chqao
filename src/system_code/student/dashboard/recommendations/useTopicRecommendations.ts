
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TopicRecommendation {
  topic: string;
  subject: string;
  correct_percentage: number;
  total_questions: number;
}

const PREVIEW_DATA: TopicRecommendation[] = [
  {
    topic: "História do Brasil Império",
    subject: "História do Brasil",
    correct_percentage: 65.5,
    total_questions: 12
  },
  {
    topic: "Independência do Brasil",
    subject: "História do Brasil",
    correct_percentage: 58.3,
    total_questions: 8
  },
  {
    topic: "República Velha",
    subject: "História do Brasil",
    correct_percentage: 45.0,
    total_questions: 15
  }
];

export const useTopicRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: ['topic-recommendations', userId],
    queryFn: async () => {
      if (!userId || userId === 'preview-user-id') {
        console.log("Usando dados de preview para recomendações de tópicos");
        return PREVIEW_DATA;
      }

      console.log("Buscando recomendações de tópicos para:", userId);
      
      const { data, error } = await supabase
        .rpc('get_topic_recommendations', {
          student_id_param: userId
        });

      if (error) {
        console.error('Erro ao buscar recomendações:', error);
        return [];
      }

      console.log("Recomendações encontradas:", data);
      return data || [];
    },
    enabled: !!userId
  });
};
