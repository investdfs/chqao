import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HourlyPerformance {
  hour: string;
  questionsAnswered: number;
  correctAnswers: number;
  percentage: number;
}

const PREVIEW_DATA: HourlyPerformance[] = [
  { hour: "9:00", questionsAnswered: 10, correctAnswers: 8, percentage: 80 },
  { hour: "14:00", questionsAnswered: 15, correctAnswers: 12, percentage: 80 },
  { hour: "19:00", questionsAnswered: 8, correctAnswers: 6, percentage: 75 }
];

export const ProductiveHours = () => {
  const { data: hourlyStats } = useQuery({
    queryKey: ['hourly-performance'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        console.log("Modo preview ou usuário não autenticado, retornando dados de exemplo");
        return PREVIEW_DATA;
      }

      console.log("Buscando estatísticas por hora para usuário:", userId);
      
      const { data, error } = await supabase
        .from('question_answers')
        .select(`
          id,
          created_at,
          selected_option,
          questions!inner (
            correct_answer
          )
        `)
        .eq('student_id', userId);

      if (error) {
        console.error('Erro ao buscar respostas:', error);
        return [];
      }

      // Processar dados por hora
      const hourlyData: Record<string, { total: number; correct: number }> = {};
      
      data.forEach(answer => {
        const hour = new Date(answer.created_at).getHours();
        const hourKey = `${hour}:00`;
        
        if (!hourlyData[hourKey]) {
          hourlyData[hourKey] = { total: 0, correct: 0 };
        }
        
        hourlyData[hourKey].total++;
        if (answer.selected_option === answer.questions.correct_answer) {
          hourlyData[hourKey].correct++;
        }
      });

      // Converter para array e calcular percentagens
      const formattedData: HourlyPerformance[] = Object.entries(hourlyData)
        .map(([hour, stats]) => ({
          hour,
          questionsAnswered: stats.total,
          correctAnswers: stats.correct,
          percentage: (stats.correct / stats.total) * 100
        }))
        .sort((a, b) => {
          const hourA = parseInt(a.hour);
          const hourB = parseInt(b.hour);
          return hourA - hourB;
        });

      console.log("Estatísticas processadas:", formattedData);
      return formattedData;
    }
  });

  const getBestHour = () => {
    if (!hourlyStats?.length) return null;
    
    return hourlyStats.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    );
  };

  const bestHour = getBestHour();

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-sm font-medium">HORÁRIOS MAIS PRODUTIVOS</CardTitle>
      </CardHeader>
      <CardContent>
        {hourlyStats?.length ? (
          <>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour"
                    label={{ 
                      value: 'Hora do dia',
                      position: 'insideBottom',
                      offset: -5
                    }}
                  />
                  <YAxis
                    label={{
                      value: 'Taxa de Acerto (%)',
                      angle: -90,
                      position: 'insideLeft'
                    }}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="percentage" 
                    fill="#8884d8"
                    name="Taxa de Acerto"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {bestHour && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>
                  Seu melhor horário de estudo é às{' '}
                  <span className="font-semibold text-primary">
                    {bestHour.hour}
                  </span>
                  {' '}com{' '}
                  <span className="font-semibold text-primary">
                    {bestHour.percentage.toFixed(1)}%
                  </span>
                  {' '}de aproveitamento
                </p>
                <p className="mt-1">
                  ({bestHour.correctAnswers} acertos em {bestHour.questionsAnswered} questões)
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            Responda algumas questões para ver suas estatísticas
          </div>
        )}
      </CardContent>
    </Card>
  );
};