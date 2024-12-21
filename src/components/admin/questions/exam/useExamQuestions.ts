import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateNewFormat, convertNewToOldFormat } from "@/utils/questionFormatConverter";
import type { Database } from "@/integrations/supabase/types";

type QuestionInsert = Database['public']['Tables']['questions']['Insert'];

export const useExamQuestions = () => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState("");
  const [examYear, setExamYear] = useState("");
  const { toast } = useToast();

  const handleInsertQuestions = async () => {
    if (!examYear || !questions.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o ano da prova e as questões.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Processando questões para inserção...");
      
      const questionsArray = questions
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            console.error("Erro ao fazer parse da linha:", line, e);
            throw new Error(`Erro ao processar linha: ${line}`);
          }
        });

      console.log("Questões parseadas:", questionsArray);

      questionsArray.forEach((question, index) => {
        if (!validateNewFormat(question)) {
          throw new Error(`Questão ${index + 1} está em formato inválido`);
        }
      });

      const questionsToInsert: QuestionInsert[] = questionsArray.map(question => {
        const convertedQuestion = convertNewToOldFormat(question);
        return {
          ...convertedQuestion,
          is_from_previous_exam: true,
          exam_year: parseInt(examYear),
          status: 'active',
          explanation: convertedQuestion.explanation || 'Sem explicação disponível', // Ensure explanation is always provided
          correct_answer: convertedQuestion.correct_answer,
          option_a: convertedQuestion.option_a,
          option_b: convertedQuestion.option_b,
          option_c: convertedQuestion.option_c,
          option_d: convertedQuestion.option_d,
          option_e: convertedQuestion.option_e,
          text: convertedQuestion.text,
          subject: convertedQuestion.subject
        };
      });

      console.log("Questões preparadas para inserção:", questionsToInsert);

      const { error } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${questionsToInsert.length} questões inseridas com sucesso.`,
      });

      setOpen(false);
      setQuestions("");
      setExamYear("");
    } catch (error) {
      console.error("Erro ao inserir questões:", error);
      toast({
        title: "Erro ao inserir questões",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  return {
    open,
    setOpen,
    questions,
    setQuestions,
    examYear,
    setExamYear,
    handleInsertQuestions
  };
};