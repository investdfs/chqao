import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PerformanceHistoryDialog } from "./PerformanceHistoryDialog";
import { StudySession } from "@/types/database/study-sessions";
import { useEffect } from "react";

interface PerformanceCardProps {
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
}

export const PerformanceCard = ({ 
  correctAnswers: initialCorrect = 0, 
  incorrectAnswers: initialIncorrect = 0, 
  percentage: initialPercentage = 0 
}: PerformanceCardProps) => {
  // Fetch study sessions history with real-time updates
  const { data: history = [], refetch } = useQuery({
    queryKey: ['performance-history'],
    queryFn: async () => {
      console.log("Buscando histórico de desempenho");
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        console.log("Usuário não autenticado");
        return [];
      }

      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('student_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar histórico de desempenho:', error);
        return [];
      }

      console.log("Histórico de desempenho carregado:", data);
      return data;
    },
    enabled: true,
    refetchInterval: 5000,
    refetchOnWindowFocus: true
  });

  // Set up real-time subscription for study sessions updates
  useEffect(() => {
    const channel = supabase
      .channel('study-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'study_sessions'
        },
        (payload) => {
          console.log('Mudança detectada em study_sessions:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Calcula o desempenho total incluindo o histórico
  const totalCorrect = history.reduce((sum, session) => sum + session.correct_answers, initialCorrect);
  const totalIncorrect = history.reduce((sum, session) => sum + session.incorrect_answers, initialIncorrect);
  const totalAnswers = totalCorrect + totalIncorrect;
  const totalPercentage = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  console.log("Desempenho calculado:", {
    totalCorrect,
    totalIncorrect,
    totalPercentage,
    historyLength: history.length
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">DESEMPENHO</CardTitle>
        <ChartBar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-success">{totalCorrect} Acertos</span>
          <span className="text-error">{totalIncorrect} Erros</span>
        </div>
        <Progress value={totalPercentage} className="h-2" />
        <div className="text-2xl font-bold text-center">{totalPercentage}%</div>
        <div className="text-center mt-2">
          <PerformanceHistoryDialog history={history} />
        </div>
      </CardContent>
    </Card>
  );
};