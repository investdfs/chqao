import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

interface QuestionCount {
  subject: string;
  theme: string;
  topic: string;
  count: number;
}

export const QuestionsStats = () => {
  const { data: questionStats, isLoading } = useQuery({
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

  // Group data by subject and theme
  const groupedStats = questionStats?.reduce((acc, stat) => {
    if (!acc[stat.subject]) {
      acc[stat.subject] = {};
    }
    if (!acc[stat.subject][stat.theme]) {
      acc[stat.subject][stat.theme] = [];
    }
    acc[stat.subject][stat.theme].push(stat);
    return acc;
  }, {} as Record<string, Record<string, QuestionCount[]>>);

  // Calculate totals
  const calculateTotals = (stats: QuestionCount[]) => {
    return stats.reduce((sum, stat) => sum + Number(stat.count), 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Questões</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {groupedStats && Object.entries(groupedStats).map(([subject, themes]) => (
            <AccordionItem key={subject} value={subject}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                  <span>{subject}</span>
                  <span className="text-muted-foreground text-sm">
                    {Object.values(themes).reduce((sum, topics) => sum + calculateTotals(topics), 0)} questões
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {Object.entries(themes).map(([theme, topics]) => (
                    <div key={theme} className="pl-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{theme}</h4>
                        <span className="text-muted-foreground text-sm">
                          {calculateTotals(topics)} questões
                        </span>
                      </div>
                      <div className="space-y-1 pl-4">
                        {topics.map((topic) => (
                          <div key={topic.topic} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{topic.topic}</span>
                            <span>{topic.count} questões</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};