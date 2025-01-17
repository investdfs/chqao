import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { DifficultyCard } from "./components/DifficultyCard";
import { UnstudiedSubjects } from "./components/UnstudiedSubjects";
import { TopicDifficulty } from "./types";

const PREVIEW_DIFFICULTIES: TopicDifficulty[] = [
  {
    topic: "História do Brasil Império",
    subject: "História",
    performance: 65.5,
    totalQuestions: 12
  },
  {
    topic: "Geografia Física",
    subject: "Geografia",
    performance: 78.3,
    totalQuestions: 15
  },
  {
    topic: "Direito Constitucional",
    subject: "Direito",
    performance: 45.0,
    totalQuestions: 8
  }
];

export const DifficultyTags = ({ userId }: { userId?: string }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: topicDifficulties, isLoading } = useQuery({
    queryKey: ['topic-difficulties', userId],
    queryFn: async () => {
      if (!userId || userId === 'preview-user-id') {
        console.log("Modo preview ou usuário não autenticado, retornando dados de exemplo");
        return PREVIEW_DIFFICULTIES;
      }

      console.log("Buscando dificuldades por tópico para usuário:", userId);
      
      try {
        const { data, error } = await supabase
          .rpc('get_topic_recommendations', {
            student_id_param: userId
          });

        if (error) {
          console.error("Erro ao buscar dificuldades:", error);
          return [];
        }

        if (!data || data.length === 0) {
          console.log("Nenhum dado de dificuldade encontrado para o usuário");
          return [];
        }

        return data.map((topic: any) => ({
          topic: topic.topic,
          subject: topic.subject,
          performance: topic.correct_percentage,
          totalQuestions: topic.total_questions
        }));
      } catch (error) {
        console.error("Erro na query de dificuldades:", error);
        return [];
      }
    },
    enabled: true
  });

  const { data: allSubjects } = useQuery({
    queryKey: ['all-subjects'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('subject_structure')
          .select('subject')
          .eq('level', 1);

        if (error) {
          console.error("Erro ao buscar matérias:", error);
          return [];
        }

        const subjects = data.map(item => item.subject);
        return [...new Set(subjects)];
      } catch (error) {
        console.error("Erro na query de matérias:", error);
        return [];
      }
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
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-8 bg-gray-200 rounded-lg w-2/3" />
            <div className="h-8 bg-gray-200 rounded-lg w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topicDifficulties || topicDifficulties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Análise por Tópicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Você ainda não respondeu questões suficientes para gerar análises.
            Comece a praticar para ver suas estatísticas!
          </p>
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