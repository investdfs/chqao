import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { DifficultyCard } from "./components/DifficultyCard";
import { UnstudiedSubjects } from "./components/UnstudiedSubjects";
import { TopicDifficulty } from "./types";

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

interface DifficultyTagsProps {
  userId?: string;
}

export const DifficultyTags = ({ userId }: DifficultyTagsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
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
        return PREVIEW_DATA;
      }

      return data.map((topic: any) => ({
        topic: topic.topic,
        subject: topic.subject,
        performance: topic.correct_percentage,
        totalQuestions: topic.total_questions
      }));
    },
    enabled: true
  });

  const { data: allSubjects } = useQuery({
    queryKey: ['all-subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subject_structure')
        .select('subject')
        .eq('level', 1);

      if (error) {
        console.error("Erro ao buscar matérias:", error);
        return [];
      }

      return [...new Set(data.map(item => item.subject))];
    }
  });

  const studiedSubjects = new Set(topicDifficulties?.map(t => t.subject));
  const unstudiedSubjects = allSubjects?.filter(subject => !studiedSubjects.has(subject));

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Análise por Tópicos
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver todos
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topicDifficulties?.slice(0, 3).map((topic) => (
            <DifficultyCard key={topic.topic} topic={topic} />
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Análise Completa de Tópicos</DialogTitle>
            </DialogHeader>
            
            <UnstudiedSubjects subjects={unstudiedSubjects || []} />

            <div className="space-y-4">
              {topicDifficulties?.map((topic) => (
                <DifficultyCard key={topic.topic} topic={topic} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};