import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UseQuestionAnswerProps {
  questionId: string;
  studentId?: string;
}

export const useQuestionAnswer = ({ questionId, studentId }: UseQuestionAnswerProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const { toast } = useToast();

  const handleAnswer = useCallback(async () => {
    if (!selectedAnswer) {
      console.log("Nenhuma resposta selecionada");
      return;
    }

    setIsAnswering(true);

    try {
      // Verificar se é modo preview ou se não há studentId válido
      if (!studentId || studentId === "00000000-0000-0000-0000-000000000000") {
        console.log("Modo preview: mostrando resposta sem salvar no banco");
        setHasAnswered(true);
        return;
      }

      console.log("Tentando salvar resposta:", {
        questionId,
        selectedAnswer,
        studentId,
      });

      // Primeiro verifica se já existe uma resposta
      const { data: existingAnswer } = await supabase
        .from('question_answers')
        .select()
        .eq('question_id', questionId)
        .eq('student_id', studentId)
        .single();

      if (existingAnswer) {
        // Se existe, atualiza
        const { error: updateError } = await supabase
          .from('question_answers')
          .update({ selected_option: selectedAnswer })
          .eq('question_id', questionId)
          .eq('student_id', studentId);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Se não existe, insere
        const { error: insertError } = await supabase
          .from('question_answers')
          .insert({
            question_id: questionId,
            selected_option: selectedAnswer,
            student_id: studentId
          });

        if (insertError) {
          throw insertError;
        }
      }

      console.log("Resposta salva com sucesso!");
      setHasAnswered(true);

    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
      toast({
        title: "Erro ao salvar resposta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnswering(false);
    }
  }, [questionId, selectedAnswer, studentId, toast]);

  const handleReset = useCallback(() => {
    setSelectedAnswer("");
    setHasAnswered(false);
    setIsAnswering(false);
  }, []);

  return {
    selectedAnswer,
    setSelectedAnswer,
    hasAnswered,
    handleAnswer,
    handleReset,
    isAnswering
  };
};