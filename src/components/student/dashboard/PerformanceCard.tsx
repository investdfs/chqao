import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { usePerformanceStats } from "./components/PerformanceStats";
import { PerformanceChart } from "./components/PerformanceChart";
import { PerformanceMetrics } from "./components/PerformanceMetrics";

export const PerformanceCard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get the current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao obter usuário:', error);
        return;
      }
      if (user) {
        console.log("Usuário autenticado:", user.id);
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const { data: studySessions = [] } = usePerformanceStats(userId);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    console.log("Configurando subscription para study_sessions do usuário:", userId);
    
    const channel = supabase
      .channel('study-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'study_sessions',
          filter: `student_id=eq.${userId}`
        },
        (payload) => {
          console.log('Mudança detectada em study_sessions:', payload);
          queryClient.invalidateQueries({ queryKey: ['study-sessions', userId] });
        }
      )
      .subscribe();

    return () => {
      console.log("Limpando subscription de study_sessions");
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  // Calculate totals
  const totalCorrect = studySessions.reduce((sum, session) => sum + session.correct_answers, 0);
  const totalIncorrect = studySessions.reduce((sum, session) => sum + session.incorrect_answers, 0);
  const totalQuestions = totalCorrect + totalIncorrect;
  const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">RESUMO DE TODAS AS SESSÕES</CardTitle>
        <ChartBar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <PerformanceMetrics
            totalQuestions={totalQuestions}
            totalCorrect={totalCorrect}
            totalIncorrect={totalIncorrect}
            percentage={percentage}
          />
          <PerformanceChart
            totalCorrect={totalCorrect}
            totalIncorrect={totalIncorrect}
          />
        </div>

        <div className="text-xs text-center text-muted-foreground">
          Dados acumulados de todas as suas sessões de estudo
        </div>
      </CardContent>
    </Card>
  );
};