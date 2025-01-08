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

const getPerformanceIcon = (performance: number) => {
  if (performance >= 70) {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
  if (performance >= 50) {
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  }
  return <XCircle className="h-4 w-4 text-red-500" />;
};

const PREVIEW_DATA: DayPerformance[] = [
  {
    date: new Date(),
    performance: 85,
    questionsAnswered: 20
  },
  {
    date: new Date(Date.now() - 86400000),
    performance: 65,
    questionsAnswered: 15
  },
  {
    date: new Date(Date.now() - 172800000),
    performance: 45,
    questionsAnswered: 10
  }
];

interface StudyCalendarProps {
  userId?: string;
}

export const StudyCalendar = ({ userId }: StudyCalendarProps) => {
  const isPreviewMode = userId === 'preview-user-id';

  const { data: studyDays, isLoading } = useQuery({
    queryKey: ['study-calendar', userId],
    queryFn: async () => {
      if (!userId || isPreviewMode) {
        console.log("Usando dados de preview para calendário");
        return PREVIEW_DATA;
      }

      console.log("Buscando dados do calendário para usuário:", userId);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

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
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Erro ao buscar dados do calendário:", error);
        throw error;
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
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Estudos</CardTitle>
      </CardHeader>
      <CardContent>
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
                    {getPerformanceIcon(dayPerformance.performance)}
                  </div>
                </div>
              );
            }
          }}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};