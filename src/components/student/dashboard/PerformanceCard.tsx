import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PerformanceHistoryDialog } from "./PerformanceHistoryDialog";
import { StudySession } from "@/types/database/study-sessions";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // First, get the current user
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

  // Fetch study sessions history with real-time updates
  const { data: history = [], refetch } = useQuery({
    queryKey: ['performance-history', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("Aguardando ID do usuário...");
        return [];
      }

      console.log("Buscando histórico de desempenho para usuário:", userId);
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar histórico de desempenho:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar histórico",
          description: "Não foi possível carregar seu histórico de desempenho."
        });
        return [];
      }

      console.log("Histórico de desempenho carregado:", data);
      return data;
    },
    enabled: !!userId, // Only run query when we have a userId
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    retry: 3
  });

  // Set up real-time subscription for study sessions updates
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
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log("Limpando subscription de study_sessions");
      supabase.removeChannel(channel);
    };
  }, [userId, refetch]);

  // Calcula o desempenho total incluindo o histórico
  const totalCorrect = history.reduce((sum, session) => sum + session.correct_answers, initialCorrect);
  const totalIncorrect = history.reduce((sum, session) => sum + session.incorrect_answers, initialIncorrect);
  const totalAnswers = totalCorrect + totalIncorrect;
  const totalPercentage = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  console.log("Desempenho calculado:", {
    userId,
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