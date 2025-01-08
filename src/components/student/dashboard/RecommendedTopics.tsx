import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopicRecommendation {
  topic: string;
  subject: string;
  correct_percentage: number;
  total_questions: number;
}

export const RecommendedTopics = ({ userId }: { userId?: string }) => {
  const navigate = useNavigate();

  const { data: recommendations } = useQuery({
    queryKey: ['topic-recommendations', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log("Buscando recomendações de tópicos para:", userId);
      
      const { data, error } = await supabase
        .rpc('get_topic_recommendations', {
          student_id_param: userId
        }) as { data: TopicRecommendation[] | null, error: any };

      if (error) {
        console.error('Erro ao buscar recomendações:', error);
        return [];
      }

      console.log("Recomendações encontradas:", data);
      return data || [];
    },
    enabled: !!userId
  });

  const handleTopicSelect = (subject: string) => {
    navigate("/question-practice", { 
      state: { 
        selectedSubject: subject,
        prioritizeErrors: true 
      } 
    });
  };

  if (!recommendations?.length) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Tópicos Recomendados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div 
              key={rec.topic} 
              className="p-4 rounded-lg bg-muted/50 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{rec.topic}</h4>
                  <p className="text-sm text-muted-foreground">{rec.subject}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTopicSelect(rec.subject)}
                >
                  Praticar
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {rec.correct_percentage.toFixed(1)}%
                </span> de aproveitamento em {rec.total_questions} questões
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};