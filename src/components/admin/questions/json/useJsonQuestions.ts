import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useJsonQuestions = () => {
  const [questions, setQuestions] = useState("");
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

  const handleInsertQuestions = async () => {
    try {
      const validatedQuestions = validateQuestions(questions);
      console.log("Questões validadas:", validatedQuestions);

      // Prepara os dados para inserção, marcando questões com exam_year como provas anteriores
      const questionsWithMetadata = validatedQuestions.map(q => ({
        ...q,
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

      setQuestions("");
    } catch (error) {
      console.error("Erro ao processar questões:", error);
      toast({
        title: "Erro ao inserir questões",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  return {
    questions,
    setQuestions,
    handleInsertQuestions
  };
};