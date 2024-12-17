import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useQuestionBulkUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateQuestionsSubject = async (questionIds: string[], subject: string) => {
    if (!questionIds.length) return;

    console.log("Atualizando matéria das questões:", questionIds, "para", subject);

    // Determina o tema baseado na matéria
    const theme = ['Língua Portuguesa', 'Geografia do Brasil', 'História do Brasil'].includes(subject)
      ? 'Conhecimentos Gerais'
      : 'Conhecimentos Profissionais';

    try {
      const { error } = await supabase
        .from('questions')
        .update({ 
          subject,
          theme
        })
        .in('id', questionIds);

      if (error) throw error;

      // Invalida todas as queries relacionadas a questões
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['questions-tree-stats'] });
      queryClient.invalidateQueries({ queryKey: ['subjects-stats'] });

      toast({
        title: "Questões atualizadas",
        description: `${questionIds.length} questões foram atualizadas com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error("Erro ao atualizar questões:", error);
      toast({
        title: "Erro ao atualizar questões",
        description: "Não foi possível atualizar as questões selecionadas.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    updateQuestionsSubject
  };
};