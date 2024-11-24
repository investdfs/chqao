import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface QuestionCount {
  subject: string;
  theme: string | null;
  count: number;
}

interface SubjectStructure {
  subject: string;
  theme: string;
}

export const QuestionsStats = () => {
  // Fetch question stats
  const { data: questionStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['questions-stats'],
    queryFn: async () => {
      console.log('Fetching questions statistics...');
      const { data, error } = await supabase
        .rpc('get_questions_stats');

      if (error) {
        console.error('Error fetching questions stats:', error);
        throw error;
      }

      console.log('Questions statistics:', data);
      return data as QuestionCount[];
    }
  });

  // Fetch subject structure for all possible subjects and themes
  const { data: subjectStructure, isLoading: isLoadingStructure } = useQuery({
    queryKey: ['subject-structure'],
    queryFn: async () => {
      console.log('Fetching subject structure...');
      const { data, error } = await supabase
        .from('subject_structure')
        .select('subject, theme')
        .order('subject, theme');

      if (error) {
        console.error('Error fetching subject structure:', error);
        throw error;
      }

      console.log('Subject structure:', data);
      return data as SubjectStructure[];
    }
  });

  if (isLoadingStats || isLoadingStructure) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Questões</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando estatísticas...</p>
        </CardContent>
      </Card>
    );
  }

  // Create a complete map of all subjects and themes with zero counts
  const completeStats = new Map<string, { total: number; themes: Map<string, number> }>();

  // Initialize with all possible subjects and themes from subject_structure
  subjectStructure?.forEach((item) => {
    if (!completeStats.has(item.subject)) {
      completeStats.set(item.subject, {
        total: 0,
        themes: new Map()
      });
    }
    completeStats.get(item.subject)!.themes.set(item.theme, 0);
  });

  // Update counts with actual question statistics
  questionStats?.forEach((stat) => {
    if (stat.theme && stat.subject) {
      const subjectStats = completeStats.get(stat.subject) || {
        total: 0,
        themes: new Map<string, number>()
      };
      
      subjectStats.total += Number(stat.count);
      subjectStats.themes.set(stat.theme, Number(stat.count));
      
      if (!completeStats.has(stat.subject)) {
        completeStats.set(stat.subject, subjectStats);
      }
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Questões</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from(completeStats.entries()).map(([subject, data]) => (
            <div key={subject} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{subject}</h3>
                <span className="text-muted-foreground">
                  Total: {data.total} questões
                </span>
              </div>
              <div className="pl-4 space-y-1">
                {Array.from(data.themes.entries()).map(([theme, count]) => (
                  <div key={theme} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{theme}</span>
                    <span>{count} questões</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};