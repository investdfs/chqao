import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionFilters } from "@/types/questions/importer";

export const useQuestionImporterQueries = () => {
  const { toast } = useToast();

  const fetchQuestions = async (filters: QuestionFilters) => {
    try {
      console.log("Buscando questões com filtros:", filters);

      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.selectedSubject) {
        console.log("Filtrando por matéria:", filters.selectedSubject);
        query = query.eq('subject', filters.selectedSubject);
      }

      if (filters.selectedTopic) {
        console.log("Filtrando por tópico:", filters.selectedTopic);
        query = query.eq('topic', filters.selectedTopic);
      }

      if (filters.selectedTheme) {
        console.log("Filtrando por tema:", filters.selectedTheme);
        query = query.eq('theme', filters.selectedTheme);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log("Questões encontradas:", data?.length);
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro ao carregar questões",
        description: "Não foi possível carregar as questões. Tente novamente.",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchThemesSubjectsAndTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('subject_structure')
        .select('*')
        .order('name');

      if (error) throw error;

      console.log("Estrutura de matérias carregada:", data?.length, "itens");
      return data || [];
    } catch (error) {
      console.error("Erro ao carregar estrutura de matérias:", error);
      toast({
        title: "Erro ao carregar estrutura",
        description: "Não foi possível carregar a estrutura de matérias.",
        variant: "destructive",
      });
      return [];
    }
  };

  const handleResetDatabase = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      toast({
        title: "Banco resetado com sucesso",
        description: "Todas as questões foram removidas.",
      });

      return true;
    } catch (error) {
      console.error("Erro ao resetar banco:", error);
      toast({
        title: "Erro ao resetar banco",
        description: "Não foi possível resetar o banco de questões.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchQuestions,
    fetchThemesSubjectsAndTopics,
    handleResetDatabase,
  };
};