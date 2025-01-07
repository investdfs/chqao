import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PerformanceHistoryDialog } from "./PerformanceHistoryDialog";
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

  // Fetch question answers history
  const { data: performance = { totalCorrect: 0, totalIncorrect: 0, percentage: 0 } } = useQuery({
    queryKey: ['question-performance', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("Aguardando ID do usuário...");
        return { totalCorrect: 0, totalIncorrect: 0, percentage: 0 };
      }

      console.log("Buscando histórico de respostas para usuário:", userId);
      
      const { data: answers, error } = await supabase
        .from('question_answers')
        .select(`
          *,
          questions!inner (
            correct_answer
          )
        `)
        .eq('student_id', userId);

      if (error) {
        console.error('Erro ao buscar histórico de respostas:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar histórico",
          description: "Não foi possível carregar seu histórico de desempenho."
        });
        return { totalCorrect: 0, totalIncorrect: 0, percentage: 0 };
      }

      const correctAnswers = answers.filter(
        answer => answer.selected_option === answer.questions.correct_answer
      ).length;

      const totalAnswers = answers.length;
      const incorrectAnswers = totalAnswers - correctAnswers;
      const percentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

      console.log("Desempenho calculado:", {
        userId,
        correctAnswers,
        incorrectAnswers,
        percentage,
        totalAnswers
      });

      return {
        totalCorrect: correctAnswers,
        totalIncorrect: incorrectAnswers,
        percentage
      };
    },
    enabled: !!userId,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    retry: 3
  });

  // Set up real-time subscription for question answers updates
  useEffect(() => {
    if (!userId) return;

    console.log("Configurando subscription para question_answers do usuário:", userId);
    
    const channel = supabase
      .channel('question-answers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'question_answers',
          filter: `student_id=eq.${userId}`
        },
        (payload) => {
          console.log('Mudança detectada em question_answers:', payload);
          // A mudança foi detectada, o useQuery irá refetch automaticamente
        }
      )
      .subscribe();

    return () => {
      console.log("Limpando subscription de question_answers");
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">DESEMPENHO GERAL</CardTitle>
        <ChartBar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-success">{performance.totalCorrect} Acertos</span>
          <span className="text-error">{performance.totalIncorrect} Erros</span>
        </div>
        <Progress value={performance.percentage} className="h-2" />
        <div className="text-2xl font-bold text-center">{performance.percentage}%</div>
        <div className="text-center mt-2">
          <PerformanceHistoryDialog history={[]} />
        </div>
      </CardContent>
    </Card>
  );
};