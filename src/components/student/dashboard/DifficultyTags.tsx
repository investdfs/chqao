import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { TopicDifficultyItem } from "./components/TopicDifficultyItem";
import { DifficultyTagsProps, TopicDifficulty } from "./types/difficulty-tags";
import { PREVIEW_DATA } from "./utils/difficulty-utils";

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

  const { data: allSubjects } = useQuery({
    queryKey: ['all-subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subject_structure')
        .select('subject')
        .then(result => {
          // Get unique subjects using Set
          const subjects = new Set(result.data?.map(item => item.subject));
          return Array.from(subjects);
        });

      if (error) throw error;
      return data;
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
          {topicDifficulties?.slice(0, 3).map((topic: TopicDifficulty) => (
            <TopicDifficultyItem key={topic.topic} topic={topic} />
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Análise Completa de Tópicos</DialogTitle>
            </DialogHeader>
            
            {unstudiedSubjects && unstudiedSubjects.length > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-medium">Matérias ainda não estudadas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unstudiedSubjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant="secondary"
                      className="bg-amber-100 text-amber-800"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {topicDifficulties?.map((topic: TopicDifficulty) => (
                <TopicDifficultyItem key={topic.topic} topic={topic} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};