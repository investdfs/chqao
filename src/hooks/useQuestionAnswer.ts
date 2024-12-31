import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseQuestionAnswerProps {
  questionId: string;
  studentId?: string;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
}

export const useQuestionAnswer = ({ 
  questionId, 
  studentId,
  onAnswerSubmitted 
}: UseQuestionAnswerProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswer = async () => {
    if (!selectedAnswer || hasAnswered) return;

    try {
      if (studentId) {
        const { error } = await supabase
          .from("question_answers")
          .upsert(
            {
              question_id: questionId,
              student_id: studentId,
              selected_option: selectedAnswer,
            },
            {
              onConflict: "question_id,student_id",
            }
          );

        if (error) {
          console.error("Erro ao salvar resposta:", error);
          throw error;
        }
      }

      setHasAnswered(true);
      
      // Notifica o componente pai sobre a resposta
      if (onAnswerSubmitted) {
        const isCorrect = selectedAnswer === 'A'; // Aqui você deve comparar com a resposta correta real
        onAnswerSubmitted(isCorrect);
      }
    } catch (error) {
      console.error("Erro ao processar resposta:", error);
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
    handleReset,
  };
};