import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

const PREVIEW_DATA = [
  { month: 'Ago', averagePercentage: 65 },
  { month: 'Set', averagePercentage: 70 },
  { month: 'Out', averagePercentage: 68 },
  { month: 'Nov', averagePercentage: 75 },
  { month: 'Dez', averagePercentage: 78 },
  { month: 'Jan', averagePercentage: 82 },
];

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const usePerformanceData = (userId?: string) => {
  const isPreviewMode = userId && !isValidUUID(userId);

  return useQuery({
    queryKey: ['monthly-performance', userId],
    queryFn: async () => {
      if (!userId || isPreviewMode) {
        console.log("Usando dados de preview para evolução mensal");
        return PREVIEW_DATA;
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