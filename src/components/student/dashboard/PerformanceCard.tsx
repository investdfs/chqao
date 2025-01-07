import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PerformanceHistoryDialog } from "./PerformanceHistoryDialog";
import { StudySession } from "@/types/database/study-sessions";

interface PerformanceCardProps {
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
}

export const PerformanceCard = ({ 
  correctAnswers = 0, 
  incorrectAnswers = 0, 
  percentage = 0 
}: PerformanceCardProps) => {
  // Fetch study sessions history with real-time updates
  const { data: history = [] } = useQuery<StudySession[]>({
    queryKey: ['performance-history'],
    queryFn: async () => {
      console.log("Fetching performance history");
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching performance history:', error);
        return [];
      }

      console.log("Performance history fetched:", data);
      return data;
    },
    // Enable real-time updates
    refetchInterval: 5000,
    refetchOnWindowFocus: true
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">DESEMPENHO</CardTitle>
        <ChartBar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-success">{correctAnswers} Acertos</span>
          <span className="text-error">{incorrectAnswers} Erros</span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="text-2xl font-bold text-center">{percentage}%</div>
        <div className="text-center mt-2">
          <PerformanceHistoryDialog history={history} />
        </div>
      </CardContent>
    </Card>
  );
};