import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface QuestionCount {
  subject: string;
  theme: string | null;
  count: number;
}

export const QuestionsStats = () => {
  const { data: questionStats, isLoading } = useQuery({
    queryKey: ['questions-stats'],
    queryFn: async () => {
      console.log('Fetching questions statistics...');
      const { data, error } = await supabase
        .from('questions')
        .select('subject, theme, count(*)')
        .group('subject, theme');

      if (error) {
        console.error('Error fetching questions stats:', error);
        throw error;
      }

      console.log('Questions statistics:', data);
      return data as QuestionCount[];
    }
  });

  if (isLoading) {
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

  // Agrupar por matéria
  const statsBySubject = questionStats?.reduce((acc, curr) => {
    if (!acc[curr.subject]) {
      acc[curr.subject] = {
        total: 0,
        themes: {}
      };
    }
    acc[curr.subject].total += Number(curr.count);
    if (curr.theme) {
      acc[curr.subject].themes[curr.theme] = Number(curr.count);
    }
    return acc;
  }, {} as Record<string, { total: number; themes: Record<string, number> }>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Questões</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statsBySubject && Object.entries(statsBySubject).map(([subject, data]) => (
            <div key={subject} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{subject}</h3>
                <span className="text-muted-foreground">
                  Total: {data.total} questões
                </span>
              </div>
              {Object.entries(data.themes).length > 0 && (
                <div className="pl-4 space-y-1">
                  {Object.entries(data.themes).map(([theme, count]) => (
                    <div key={theme} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{theme}</span>
                      <span>{count} questões</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};