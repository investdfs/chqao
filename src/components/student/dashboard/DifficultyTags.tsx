import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";

interface TopicDifficulty {
  topic: string;
  subject: string;
  performance: number;
  totalQuestions: number;
}

const getDifficultyColor = (performance: number) => {
  if (performance >= 80) return "bg-green-100 text-green-800 hover:bg-green-200";
  if (performance >= 60) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
  return "bg-red-100 text-red-800 hover:bg-red-200";
};

const getDifficultyIcon = (performance: number) => {
  if (performance >= 80) return <TrendingUp className="h-4 w-4" />;
  if (performance >= 60) return <AlertCircle className="h-4 w-4" />;
  return <TrendingDown className="h-4 w-4" />;
};

export const DifficultyTags = ({ userId }: { userId?: string }) => {
  const { data: topicDifficulties, isLoading } = useQuery({
    queryKey: ['topic-difficulties', userId],
    queryFn: async () => {
      if (!userId) return [];

      console.log("Buscando dificuldades por tópico para usuário:", userId);
      
      const { data: topicPerformance, error } = await supabase
        .rpc('get_topic_recommendations', {
          student_id_param: userId
        });

      if (error) {
        console.error("Erro ao buscar dificuldades por tópico:", error);
        throw error;
      }

      return topicPerformance.map((topic: any) => ({
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
        <div className="space-y-4">
          {topicDifficulties?.map((topic) => (
            <div key={topic.topic} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{topic.subject}</span>
                <Badge 
                  variant="outline"
                  className={`${getDifficultyColor(topic.performance)} flex items-center gap-1`}
                >
                  {getDifficultyIcon(topic.performance)}
                  {topic.topic}
                  <span className="ml-1">({Math.round(topic.performance)}%)</span>
                </Badge>
              </div>
            </div>
          ))}
          {(!topicDifficulties || topicDifficulties.length === 0) && (
            <p className="text-center text-muted-foreground">
              Responda mais questões para ver as dificuldades por tópico
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};