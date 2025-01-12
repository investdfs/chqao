import { useToast } from "@/components/ui/use-toast";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";

export const useQuestionImporterQueries = () => {
  const { toast } = useToast();

  const fetchThemesSubjectsAndTopics = async () => {
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      console.log("Buscando temas, matérias e assuntos únicos...");
      const { data: structureData, error } = await supabase
        .from("subject_structure")
        .select("theme, subject, topic")
        .throwOnError();

      if (error) throw error;

      const uniqueThemes = [...new Set(structureData.map((q) => q.theme).filter(Boolean))];
      const uniqueSubjects = [...new Set(structureData.map((q) => q.subject))];
      const uniqueTopics = [...new Set(structureData.map((q) => q.topic).filter(Boolean))];

      return { uniqueThemes, uniqueSubjects, uniqueTopics };
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao carregar os filtros. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchQuestions = async (filters: {
    searchTerm: string;
    selectedTheme: string;
    selectedSubject: string;
    selectedTopic: string;
  }) => {
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return null;
      }

      console.log("Buscando questões do banco com filtros:", filters);
      let query = supabase
        .from("questions")
        .select()
        .throwOnError();

      if (filters.searchTerm !== "all") {
        switch (filters.searchTerm) {
          case "hidden":
            query = query.eq("status", "hidden");
            break;
          case "exam":
            query = query.eq("is_from_previous_exam", true);
            break;
          case "new":
            query = query.neq("status", "hidden")
              .neq("status", "deleted")
              .eq("is_from_previous_exam", false);
            break;
        }
      }

      // Só adiciona os filtros se eles não estiverem vazios
      if (filters.selectedTheme && filters.selectedTheme.trim()) {
        console.log("Aplicando filtro de tema:", filters.selectedTheme);
        query = query.eq("theme", filters.selectedTheme);
      }
      
      if (filters.selectedSubject && filters.selectedSubject.trim()) {
        console.log("Aplicando filtro de matéria:", filters.selectedSubject);
        query = query.eq("subject", filters.selectedSubject);
      }
      
      if (filters.selectedTopic && filters.selectedTopic.trim()) {
        console.log("Aplicando filtro de tópico:", filters.selectedTopic);
        query = query.eq("topic", filters.selectedTopic);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      console.log(`Encontradas ${data?.length || 0} questões com os filtros aplicados`);
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro ao carregar questões",
        description: "Ocorreu um erro ao carregar as questões. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleResetDatabase = async () => {
    try {
      console.log("Iniciando reset do banco de questões...");
      const { error } = await supabase
        .from("questions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      toast({
        title: "Banco resetado",
        description: "Todas as questões foram removidas com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Erro ao resetar banco:", error);
      toast({
        title: "Erro ao resetar",
        description: "Não foi possível resetar o banco de questões.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchThemesSubjectsAndTopics,
    fetchQuestions,
    handleResetDatabase,
  };
};