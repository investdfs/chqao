import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DayContentProps } from "react-day-picker";

interface DayPerformance {
  date: Date;
  performance: number;
  questionsAnswered: number;
}

export const StudyCalendar = ({ userId }: { userId?: string }) => {
  const { data: studyDays, isLoading } = useQuery({
    queryKey: ['study-calendar', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("Usuário não autenticado, retornando dados vazios");
        return [];
      }

      console.log("Buscando dados do calendário para usuário:", userId);
      
      const { data: answers, error } = await supabase
        .from('question_answers')
        .select(`
          created_at,
          questions!inner (
            correct_answer
          ),
          selected_option
        `)
        .eq('student_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      if (error) {
        console.error("Erro ao buscar dados do calendário:", error);
        return [];
      }

      if (!answers || answers.length === 0) {
        console.log("Nenhum dado encontrado para o usuário");
        return [];
      }

      const dailyPerformance = answers.reduce((acc: Record<string, DayPerformance>, answer) => {
        const date = format(new Date(answer.created_at), 'yyyy-MM-dd');
        
        if (!acc[date]) {
          acc[date] = {
            date: new Date(date),
            performance: 0,
            questionsAnswered: 0
          };
        }
        
        const isCorrect = answer.selected_option === answer.questions.correct_answer;
        acc[date].questionsAnswered++;
        acc[date].performance = (acc[date].performance * (acc[date].questionsAnswered - 1) + (isCorrect ? 100 : 0)) / acc[date].questionsAnswered;
        
        return acc;
      }, {});

      console.log("Dados processados:", Object.values(dailyPerformance));
      return Object.values(dailyPerformance);
    },
    enabled: !!userId
  });

  const modifiers = {
    highlight: studyDays?.map(day => day.date) || []
  };

  const modifiersStyles = {
    highlight: {
      border: '2px solid var(--primary)',
      borderRadius: '50%'
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendário de Estudos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Calendário de Estudos</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Calendar
          mode="single"
          selected={new Date()}
          locale={ptBR}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: ({ date }: DayContentProps) => {
              const dayPerformance = studyDays?.find(
                d => d.date.toDateString() === date.toDateString()
              );

              if (!dayPerformance) {
                return <div className="relative w-full h-full flex items-center justify-center">
                  {date.getDate()}
                </div>;
              }

              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <span>{date.getDate()}</span>
                  <div className="absolute bottom-0 right-0">
                    {dayPerformance.performance >= 70 ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : dayPerformance.performance >= 50 ? (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    ) : (
                      <XCircle className="h-4 w-4 text-error" />
                    )}
                  </div>
                </div>
              );
            }
          }}
          className="w-full h-full"
        />
      </CardContent>
    </Card>
  );
};