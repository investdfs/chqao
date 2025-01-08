import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export const PerformanceEvolutionCard = ({ userId }: { userId?: string }) => {
  const { data: monthlyPerformance = [], isLoading } = useQuery({
    queryKey: ['monthly-performance', userId],
    queryFn: async () => {
      if (!userId) return [];

      console.log("Buscando evolução mensal para usuário:", userId);

      // Buscar os últimos 6 meses de dados
      const endDate = new Date();
      const startDate = subMonths(endDate, 5); // 6 meses incluindo o atual

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

      // Agrupar por mês e calcular médias
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

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Evolução do Desempenho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyPerformance}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Aproveitamento']}
              />
              <Line
                type="monotone"
                dataKey="averagePercentage"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Média de aproveitamento mensal nos últimos 6 meses
        </p>
      </CardContent>
    </Card>
  );
};