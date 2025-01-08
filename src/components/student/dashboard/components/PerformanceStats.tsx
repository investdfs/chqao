import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StudySession } from "@/types/database/study-sessions";

export const usePerformanceStats = (userId: string | null) => {
  return useQuery({
    queryKey: ['study-sessions', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("Aguardando ID do usuário...");
        return [];
      }

      console.log("Buscando sessões de estudo para usuário:", userId);
      
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sessões:', error);
        throw error;
      }

      console.log("Sessões encontradas:", sessions);
      return sessions as StudySession[];
    },
    enabled: !!userId
  });
};