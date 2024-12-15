import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
      // Remove possíveis caracteres inválidos
      const cleanInput = input.trim();
      console.log("Processando JSON:", cleanInput);
      
      const parsedData = JSON.parse(cleanInput);
      
      // Se for um objeto único, converte para array
      const questionsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      console.log("Questões convertidas para array:", questionsArray);
      
      // Valida cada questão
      questionsArray.forEach((q, index) => {
        const requiredFields = [
          'text', 'option_a', 'option_b', 'option_c', 
          'option_d', 'option_e', 'correct_answer', 'subject'
        ];

        requiredFields.forEach(field => {
          if (!q[field]) {
            throw new Error(`Campo obrigatório '${field}' ausente na questão ${index + 1}`);
          }
        });

        // Valida o exam_year se presente
        if (q.exam_year && !Number.isInteger(q.exam_year)) {
          throw new Error(`Campo 'exam_year' deve ser um número inteiro na questão ${index + 1}`);
        }
      });

      return questionsArray;
    } catch (error) {
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

      // Prepara os dados para inserção
      const questionsWithMetadata = validatedQuestions.map(q => ({
        ...q,
        subject: q.subject || subject,
        topic: q.topic || topic,
        difficulty: q.difficulty || 'Médio',
        is_from_previous_exam: q.exam_year ? true : false, // Marca como prova anterior se tiver exam_year
        status: 'active'
      }));

      console.log("Inserindo questões:", questionsWithMetadata);

      const { error } = await supabase
        .from('questions')
        .insert(questionsWithMetadata);

      if (error) {
        console.error("Erro ao inserir questões:", error);
        throw error;
      }

      // Invalida o cache para atualizar as estatísticas
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });

      toast({
        title: "Sucesso!",
        description: `${questionsWithMetadata.length} questões inseridas com sucesso.`,
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