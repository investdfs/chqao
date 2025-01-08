import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopicDifficulty } from "./types/difficulty-tags";

export const DifficultyTags = ({ userId }: { userId?: string }) => {
  const { data: topicDifficulties, isLoading, isError } = useQuery({
    queryKey: ['topic-recommendations', userId],
    queryFn: async () => {
      console.log("Buscando recomendações de tópicos para:", userId);
      
      if (!userId) {
        console.log("Usuário não autenticado, retornando dados de preview");
        return [];
      }

      const { data, error } = await supabase
        .rpc('get_topic_recommendations', {
          student_id_param: userId
        });

      if (error) {
        console.error("Erro ao buscar recomendações:", error);
        throw error;
      }

      console.log("Recomendações encontradas:", data);
      return data;
    },
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-sm font-medium">TÓPICOS PARA REVISAR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-gray-500">Carregando recomendações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-sm font-medium">TÓPICOS PARA REVISAR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-red-500">Erro ao carregar recomendações</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-sm font-medium">TÓPICOS PARA REVISAR</CardTitle>
      </CardHeader>
      <CardContent>
        {topicDifficulties && topicDifficulties.length > 0 ? (
          <div className="space-y-4">
            {topicDifficulties.map((topic, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium text-sm">{topic.topic}</p>
                <p className="text-xs text-gray-500">{topic.subject}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium">
                    {topic.performance.toFixed(1)}% de acertos
                  </span>
                  <span className="text-xs text-gray-500">
                    {topic.totalQuestions} questões
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-gray-500">
              Nenhuma recomendação disponível no momento
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};