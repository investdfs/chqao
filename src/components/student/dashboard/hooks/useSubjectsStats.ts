import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubjectsStats = () => {
  return useQuery({
    queryKey: ['subjectsStats'],
    queryFn: async () => {
      console.log("Buscando estatísticas das matérias...");
      
      const { data, error } = await supabase
        .from('questions')
        .select('subject')
        .is('topic', null);

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        throw error;
      }

      // Agrupar por matéria e contar
      const stats = data.reduce((acc: Record<string, number>, curr) => {
        acc[curr.subject] = (acc[curr.subject] || 0) + 1;
        return acc;
      }, {});

      console.log("Estatísticas encontradas:", stats);
      
      return Object.entries(stats).map(([subject, count]) => ({
        subject,
        questionCount: count
      }));
    }
  });
};