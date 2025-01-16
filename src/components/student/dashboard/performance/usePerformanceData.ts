import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export const usePerformanceData = (userId?: string) => {
  return useQuery({
    queryKey: ['monthly-performance', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("ID do usuário não fornecido, retornando array vazio");
        return [];
      }

      console.log("Buscando evolução mensal para usuário:", userId);

      const endDate = new Date();
      const startDate = subMonths(endDate, 5);

      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('student_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (error) {
        console.error('Erro ao buscar sessões:', error);
        return [];
      }

      if (!sessions || sessions.length === 0) {
        console.log("Nenhuma sessão de estudo encontrada para o usuário");
        return [];
      }

      const monthlyData = sessions.reduce((acc: any[], session) => {
        const month = format(new Date(session.created_at), 'MMM', { locale: ptBR });
        const existingMonth = acc.find(item => item.month === month);

        if (existingMonth) {
          existingMonth.sessions += 1;
          existingMonth.totalPercentage += session.percentage;
          existingMonth.averagePercentage = existingMonth.totalPercentage / existingMonth.sessions;
        } else {
          acc.push({
            month,
            sessions: 1,
            totalPercentage: session.percentage,
            averagePercentage: session.percentage
          });
        }

        return acc;
      }, []);

      console.log("Dados mensais processados:", monthlyData);
      return monthlyData;
    },
    enabled: !!userId
  });
};