import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SessionStats {
  created_at: string;
  questions: {
    correct_answer: string;
  };
  selected_option: string;
}

const PREVIEW_DATA: SessionStats[] = [
  {
    created_at: new Date().toISOString(),
    questions: {
      correct_answer: 'A'
    },
    selected_option: 'A'
  },
  {
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    questions: {
      correct_answer: 'B'
    },
    selected_option: 'C'
  }
];

export const useSessionStats = (studentId?: string) => {
  return useQuery({
    queryKey: ['session-stats', studentId],
    queryFn: async () => {
      // Se não houver studentId ou for preview-user-id, retornar dados de preview
      if (!studentId || studentId === 'preview-user-id') {
        console.log("Modo preview - retornando dados de preview para estatísticas");
        return PREVIEW_DATA;
      }

      console.log("Buscando estatísticas da sessão para estudante:", studentId);
      
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - 1); // última hora

      try {
        const { data, error } = await supabase
          .from('question_answers')
          .select(`
            created_at,
            questions!inner(
              correct_answer
            ),
            selected_option
          `)
          .eq('student_id', studentId)
          .gte('created_at', startTime.toISOString())
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Erro ao buscar estatísticas:', error);
          return [];
        }

        console.log("Estatísticas encontradas:", data);
        return data as SessionStats[];
      } catch (error) {
        console.error('Erro na query de estatísticas:', error);
        return [];
      }
    },
    enabled: true
  });
};