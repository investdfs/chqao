import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const usePerformanceStats = (userId: string | null) => {
  const { toast } = useToast();

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
        toast({
          variant: "destructive",
          title: "Erro ao carregar sessões",
          description: "Não foi possível carregar seu histórico de sessões."
        });
        return [];
      }

      console.log("Sessões encontradas:", sessions);
      return sessions;
    },
    enabled: !!userId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000
  });
};