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
  const { toast } = useToast();

  const handleAnswer = useCallback(async () => {
    if (!selectedAnswer) {
      console.log("Nenhuma resposta selecionada");
      return;
    }

    console.log("Tentando salvar resposta:", {
      questionId,
      selectedAnswer,
      studentId,
    });
    
    // Se não houver studentId válido ou for o ID padrão, apenas mostra a resposta
    if (!studentId || studentId === "00000000-0000-0000-0000-000000000000") {
      console.log("Modo preview: mostrando resposta sem salvar no banco");
      setHasAnswered(true);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('question_answers')
        .upsert({
          question_id: questionId,
          selected_option: selectedAnswer,
          student_id: studentId
        }, {
          onConflict: 'question_id,student_id'
        });

      if (error) {
        console.error("Erro ao salvar resposta:", error);
        toast({
          title: "Erro ao salvar resposta",
          description: "Não foi possível salvar sua resposta. Tente novamente.",
          variant: "destructive",
        });
      } else {
        console.log("Resposta salva com sucesso!");
        setHasAnswered(true);
      }
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
      toast({
        title: "Erro ao salvar resposta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [questionId, selectedAnswer, studentId, toast]);

  const handleReset = useCallback(() => {
    setSelectedAnswer("");
    setHasAnswered(false);
  }, []);

  return {
    selectedAnswer,
    setSelectedAnswer,
    hasAnswered,
    handleAnswer,
    handleReset
  };
};