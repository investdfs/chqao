import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { validateNewFormat, convertNewToOldFormat } from "@/utils/questionFormatConverter";
import { TablesInsert } from "@/integrations/supabase/types";

export const useJsonQuestions = () => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const validateQuestions = (input: string) => {
    try {
      const cleanInput = input.trim();
      console.log("Processando JSON:", cleanInput);
      
      const parsedData = JSON.parse(cleanInput);
      const questionsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      console.log("Validando array de questões:", questionsArray);
      
      questionsArray.forEach((q, index) => {
        if (!validateNewFormat(q)) {
          throw new Error(`Questão ${index + 1} está em formato inválido`);
        }
      });

      return questionsArray;
    } catch (error) {
      console.error("Erro ao validar questões:", error);
      if (error instanceof SyntaxError) {
        throw new Error("JSON inválido. Verifique a formatação.");
      }
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "JSON vazio",
        description: "Por favor, insira o JSON das questões.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Processando JSON de questões...");

    try {
      const validatedQuestions = validateQuestions(jsonInput);
      console.log("Questões validadas:", validatedQuestions);

      // Converte questões para o formato antigo e garante que todos os campos obrigatórios estejam presentes
      const questionsToInsert: TablesInsert<"questions">[] = validatedQuestions.map(q => {
        const convertedQuestion = convertNewToOldFormat(q);
        return {
          text: convertedQuestion.text,
          option_a: convertedQuestion.option_a,
          option_b: convertedQuestion.option_b,
          option_c: convertedQuestion.option_c,
          option_d: convertedQuestion.option_d,
          option_e: convertedQuestion.option_e,
          correct_answer: convertedQuestion.correct_answer,
          explanation: convertedQuestion.explanation,
          difficulty: convertedQuestion.difficulty,
          subject: q.subject || subject,
          topic: q.topic || topic,
          status: 'active',
          is_from_previous_exam: convertedQuestion.is_from_previous_exam,
          exam_year: convertedQuestion.exam_year,
          theme: convertedQuestion.theme,
          is_ai_generated: false
        };
      });

      console.log("Inserindo questões:", questionsToInsert);

      const { error } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (error) {
        throw error;
      }

      // Invalida o cache para atualizar as estatísticas
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });

      toast({
        title: "Sucesso!",
        description: `${questionsToInsert.length} questões inseridas com sucesso.`,
      });

      resetForm();
    } catch (error) {
      console.error("Erro ao processar questões:", error);
      toast({
        title: "Erro ao inserir questões",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOpen(false);
    setJsonInput("");
    setSubject("");
    setTopic("");
  };

  return {
    open,
    setOpen,
    jsonInput,
    setJsonInput,
    isLoading,
    subject,
    setSubject,
    topic,
    setTopic,
    handleSubmit,
    resetForm
  };
};