import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExamQuestion } from "./types";

export const useExamQuestions = () => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState("");
  const [examYear, setExamYear] = useState("");
  const [examName, setExamName] = useState("");
  const { toast } = useToast();

  const processQuestions = async (questionsText: string) => {
    try {
      // Transformar o texto em um array de objetos JSON
      const questionsArray = questionsText
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));

      console.log(`Processando ${questionsArray.length} questões...`);
      
      // Primeiro criar a prova
      const { data: examData, error: examError } = await supabase
        .from("previous_exams")
        .insert({
          year: parseInt(examYear),
          name: examName || `Prova ${examYear}`,
          description: `Prova do ano ${examYear}`
        })
        .select()
        .single();

      if (examError) throw examError;

      const processedQuestions = questionsArray.map((q: ExamQuestion) => ({
        exam_id: examData.id,
        text: q.text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        option_e: q.option_e,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "Gabarito Oficial",
        subject: q.subject,
        topic: q.topic,
        theme: q.theme
      }));

      return processedQuestions;
    } catch (error) {
      console.error("Erro ao processar JSON das questões:", error);
      throw new Error("Formato JSON inválido. Verifique se cada linha contém um objeto JSON válido.");
    }
  };

  const handleInsertQuestions = async () => {
    try {
      console.log("Processando questões de prova anterior...");
      const processedQuestions = await processQuestions(questions);

      if (processedQuestions.length === 0) {
        throw new Error("Nenhuma questão válida encontrada");
      }

      console.log(`Inserindo ${processedQuestions.length} questões...`);
      const { error } = await supabase
        .from("previous_exam_questions")
        .insert(processedQuestions)
        .select();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${processedQuestions.length} questões foram inseridas com sucesso.`,
      });
      
      setOpen(false);
      setQuestions("");
      setExamYear("");
      setExamName("");
    } catch (error) {
      console.error("Erro ao inserir questões:", error);
      toast({
        title: "Erro ao inserir questões",
        description: error.message || "Ocorreu um erro ao tentar inserir as questões. Tente novamente.",
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
    examName,
    setExamName,
    handleInsertQuestions
  };
};