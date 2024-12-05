import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UseQuestionAnswerProps {
  questionId: number;
  studentId?: string;
}

export const useQuestionAnswer = ({ questionId, studentId }: UseQuestionAnswerProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const { toast } = useToast();

  const handleAnswer = async () => {
    if (!selectedAnswer || !studentId) {
      console.log("Resposta não selecionada ou studentId não fornecido:", {
        selectedAnswer,
        studentId,
      });
      return;
    }

    setHasAnswered(true);
    
    try {
      console.log("Tentando salvar resposta:", {
        questionId,
        selectedAnswer,
        studentId,
      });
      
      const { error } = await supabase
        .from('question_answers')
        .upsert({
          question_id: questionId.toString(), // Convertendo para string conforme exigido pelo Supabase
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
      }
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
      toast({
        title: "Erro ao salvar resposta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswer("");
    setHasAnswered(false);
  };

  return {
    selectedAnswer,
    setSelectedAnswer,
    hasAnswered,
    handleAnswer,
    handleReset
  };
};