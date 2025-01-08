import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Target, TrendingDown, TrendingUp } from "lucide-react";

interface TopicDifficulty {
  topic: string;
  subject: string;
  performance: number;
  totalQuestions: number;
}

const PREVIEW_DATA: TopicDifficulty[] = [
  {
    topic: "História do Brasil Império",
    subject: "História do Brasil",
    performance: 65.5,
    totalQuestions: 12
  },
  {
    topic: "Independência do Brasil",
    subject: "História do Brasil",
    performance: 58.3,
    totalQuestions: 8
  },
  {
    topic: "República Velha",
    subject: "História do Brasil",
    performance: 45.0,
    totalQuestions: 15
  }
];

const getDifficultyInfo = (performance: number) => {
  if (performance >= 80) return {
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: <TrendingUp className="h-4 w-4" />,
    label: "Bom desempenho"
  };
  if (performance >= 60) return {
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    icon: <Target className="h-4 w-4" />,
    label: "Precisa de atenção"
  };
  return {
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: <TrendingDown className="h-4 w-4" />,
    label: "Foco necessário"
  };
};

interface DifficultyTagsProps {
  userId?: string;
}

export const DifficultyTags = ({ userId }: DifficultyTagsProps) => {
  const isPreviewMode = userId === 'preview-user-id';

  const { data: topicDifficulties, isLoading } = useQuery({
    queryKey: ['topic-difficulties', userId],
    queryFn: async () => {
      if (!userId || isPreviewMode) {
        console.log("Usando dados de preview para dificuldades");
        return PREVIEW_DATA;
      }

      console.log("Buscando dificuldades por tópico para usuário:", userId);
      
      const { data, error } = await supabase
        .rpc('get_topic_recommendations', {
          student_id_param: userId
        });

      if (error) {
        console.error("Erro ao buscar dificuldades por tópico:", error);
        throw error;
      }

      return data.map((topic: any) => ({
        topic: topic.topic,
        subject: topic.subject,
        performance: topic.correct_percentage,
        totalQuestions: topic.total_questions
      }));
    },
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Análise por Tópicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Análise por Tópicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topicDifficulties?.map((topic) => {
            const difficultyInfo = getDifficultyInfo(topic.performance);
            return (
              <div
                key={topic.topic}
                className="p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50/80 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                    <p className="text-sm text-gray-500">{topic.subject}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${difficultyInfo.color} flex items-center gap-1`}
                  >
                    {difficultyInfo.icon}
                    {topic.performance.toFixed(1)}%
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{difficultyInfo.label}</span>
                  <span>{topic.totalQuestions} questões respondidas</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};