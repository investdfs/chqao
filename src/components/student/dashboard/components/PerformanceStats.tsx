import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const PREVIEW_DATA = [
  { correct_answers: 15, incorrect_answers: 5, percentage: 75, created_at: new Date().toISOString() },
  { correct_answers: 12, incorrect_answers: 8, percentage: 60, created_at: new Date(Date.now() - 86400000).toISOString() },
  { correct_answers: 18, incorrect_answers: 2, percentage: 90, created_at: new Date(Date.now() - 172800000).toISOString() }
];

export const usePerformanceStats = (userId: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['study-sessions', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("Modo preview ou usuário não autenticado, retornando dados de exemplo");
        return PREVIEW_DATA;
      }

      console.log("Buscando sessões de estudo para usuário:", userId);
      
      try {
        const { data: sessions, error } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('student_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar sessões:', error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar sessões",
            description: "Não foi possível carregar seu histórico de sessões."
          });
          return [];
        }

        console.log("Sessões encontradas:", sessions);
        return sessions;
      } catch (error) {
        console.error('Erro inesperado ao buscar sessões:', error);
        return [];
      }
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000
  });
};