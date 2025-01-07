import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PieChart, Pie, Cell } from "recharts";

export const PerformanceCard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Primeiro, get the current user
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

  // Buscar dados de todas as sessões de estudo do usuário
  const { data: studySessions = [], isLoading } = useQuery({
    queryKey: ['study-sessions', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("Aguardando ID do usuário...");
        return [];
      }

      console.log("Buscando sessões de estudo para usuário:", userId);
      
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sessões:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar sessões",
          description: "Não foi possível carregar seu histórico de sessões."
        });
        return [];
      }

      console.log("Sessões encontradas:", sessions);
      return sessions;
    },
    enabled: !!userId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 // Refetch a cada 1 segundo
  });

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

  // Calcular totais
  const totalCorrect = studySessions.reduce((sum, session) => sum + session.correct_answers, 0);
  const totalIncorrect = studySessions.reduce((sum, session) => sum + session.incorrect_answers, 0);
  const totalQuestions = totalCorrect + totalIncorrect;
  const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Configurar dados para o gráfico
  const pieData = [
    { name: "Acertos", value: totalCorrect, color: "#10B981" },
    { name: "Erros", value: totalIncorrect, color: "#EF4444" }
  ];

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">RESUMO DE TODAS AS SESSÕES</CardTitle>
        <ChartBar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total de questões</div>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <div className="flex justify-between text-sm">
              <span className="text-success">Acertos: {totalCorrect}</span>
              <span className="text-error">Erros: {totalIncorrect}</span>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              Aproveitamento: {percentage}%
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <div style={{ width: 100, height: 100 }}>
              <PieChart width={100} height={100}>
                <Pie
                  data={pieData}
                  cx={50}
                  cy={50}
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          Dados acumulados de todas as suas sessões de estudo
        </div>
      </CardContent>
    </Card>
  );
};