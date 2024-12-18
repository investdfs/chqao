import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateNewFormat, convertNewToOldFormat } from "@/utils/questionFormatConverter";

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
      
      // Processa cada linha como uma questão separada
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

      // Valida cada questão
      questionsArray.forEach((question, index) => {
        if (!validateNewFormat(question)) {
          throw new Error(`Questão ${index + 1} está em formato inválido`);
        }
      });

      // Converte e prepara as questões para inserção
      const questionsToInsert = questionsArray.map(question => ({
        ...convertNewToOldFormat(question),
        is_from_previous_exam: true,
        exam_year: parseInt(examYear),
        status: 'active'
      }));

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