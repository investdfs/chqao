import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DayPerformance {
  date: Date;
  performance: number;
  questionsAnswered: number;
}

const getPerformanceColor = (performance: number) => {
  if (performance >= 80) return "bg-green-500";
  if (performance >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const getPerformanceIcon = (performance: number) => {
  if (performance >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (performance >= 60) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  return <XCircle className="h-4 w-4 text-red-500" />;
};

export const StudyCalendar = ({ userId }: { userId?: string }) => {
  const { data: studyDays, isLoading } = useQuery({
    queryKey: ['study-calendar', userId],
    queryFn: async () => {
      if (!userId) return [];

      console.log("Buscando dados do calendário para usuário:", userId);
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      
      const { data, error } = await supabase
        .from('question_answers')
        .select(`
          created_at,
          questions!inner (
            correct_answer
          )
        `)
        .eq('student_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Erro ao buscar dados do calendário:", error);
        throw error;
      }

      const performanceByDay = data.reduce((acc: Record<string, DayPerformance>, answer) => {
        const date = format(new Date(answer.created_at), 'yyyy-MM-dd');
        if (!acc[date]) {
          acc[date] = {
            date: new Date(date),
            performance: 0,
            questionsAnswered: 0
          };
        }
        
        const isCorrect = answer.questions.correct_answer === answer.selected_option;
        acc[date].questionsAnswered++;
        acc[date].performance = (acc[date].performance * (acc[date].questionsAnswered - 1) + (isCorrect ? 100 : 0)) / acc[date].questionsAnswered;
        
        return acc;
      }, {});

      return Object.values(performanceByDay);
    },
    enabled: !!userId
  });

  const modifiers = {
    studied: studyDays?.map(day => day.date) || [],
  };

  const modifiersStyles = {
    studied: { 
      backgroundColor: '#e5e7eb',
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
        <CardTitle className="flex items-center justify-between">
          <span>Calendário de Estudos</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Ótimo
            </Badge>
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Regular
            </Badge>
            <Badge variant="outline" className="gap-1">
              <XCircle className="h-4 w-4 text-red-500" />
              Precisa Melhorar
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={new Date()}
          locale={ptBR}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: ({ date }) => {
              const dayPerformance = studyDays?.find(
                d => d.date.toDateString() === date.toDateString()
              );

              if (!dayPerformance) return date.getDate();

              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <span>{date.getDate()}</span>
                  <div className="absolute bottom-0 right-0">
                    {getPerformanceIcon(dayPerformance.performance)}
                  </div>
                </div>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
};