import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

const getDifficultyColor = (performance: number) => {
  if (performance >= 80) return "bg-green-100 text-green-800 hover:bg-green-200";
  if (performance >= 60) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
  return "bg-red-100 text-red-800 hover:bg-red-200";
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
          <CardTitle>Tópicos por Dificuldade</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tópicos por Dificuldade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topicDifficulties?.map((topic) => (
            <Badge
              key={topic.topic}
              variant="secondary"
              className={`${getDifficultyColor(topic.performance)}`}
            >
              {topic.topic} ({topic.performance.toFixed(1)}%)
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};