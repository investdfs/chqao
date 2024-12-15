import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useJsonQuestions = () => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const { toast } = useToast();

  const validateInputs = () => {
    if (!subject || !topic) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione a matéria e o tópico antes de continuar.",
        variant: "destructive",
      });
      return false;
    }

    if (!jsonInput.trim()) {
      toast({
        title: "JSON vazio",
        description: "Por favor, insira o JSON das questões.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const parseAndValidateJSON = (input: string) => {
    try {
      // Remove possíveis caracteres inválidos
      const cleanInput = input.trim();
      const parsedData = JSON.parse(cleanInput);
      
      // Se for um objeto único, converte para array
      const questionsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // Valida cada questão
      questionsArray.forEach((q, index) => {
        const requiredFields = [
          'text', 'option_a', 'option_b', 'option_c', 
          'option_d', 'option_e', 'correct_answer'
        ];
        
        requiredFields.forEach(field => {
          if (!q[field]) {
            throw new Error(`Campo obrigatório '${field}' ausente na questão ${index + 1}`);
          }
        });
      });

      return questionsArray;
    } catch (error) {
      console.error("Erro ao processar JSON:", error);
      throw new Error(error.message || "Formato JSON inválido");
    }
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    console.log("Processando JSON de questões...");

    try {
      const questions = parseAndValidateJSON(jsonInput);
      console.log("Questões validadas:", questions);

      const questionsWithMetadata = questions.map(q => ({
        ...q,
        subject: q.subject || subject,
        topic: q.topic || topic,
        status: 'active',
        is_from_previous_exam: q.is_from_previous_exam || false,
        exam_year: q.exam_year || null,
        difficulty: q.difficulty || 'Médio'
      }));

      const { error } = await supabase
        .from('questions')
        .insert(questionsWithMetadata);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${questions.length} questão(ões) inserida(s) com sucesso.`,
      });
      
      resetForm();
    } catch (error) {
      console.error("Erro ao processar JSON:", error);
      toast({
        title: "Erro ao processar JSON",
        description: error.message || "Verifique se o formato do JSON está correto.",
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