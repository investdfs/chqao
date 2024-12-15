import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useJsonImageQuestions = () => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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

    if (!imageUrl) {
      toast({
        title: "Imagem não selecionada",
        description: "Por favor, faça upload da imagem antes de continuar.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    console.log("Processando JSON de questões com imagem...");

    try {
      const questions = JSON.parse(jsonInput);
      const questionsWithMetadata = Array.isArray(questions) 
        ? questions.map(q => ({
            ...q,
            subject,
            topic,
            image_url: imageUrl,
            status: 'active'
          }))
        : [{
            ...questions,
            subject,
            topic,
            image_url: imageUrl,
            status: 'active'
          }];

      const { error } = await supabase
        .from('questions')
        .insert(questionsWithMetadata);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Questões com imagem inseridas com sucesso.",
      });
      
      resetForm();
    } catch (error) {
      console.error("Erro ao processar JSON:", error);
      toast({
        title: "Erro ao processar JSON",
        description: "Verifique se o formato do JSON está correto.",
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
    setImageUrl("");
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
    imageUrl,
    setImageUrl,
    handleSubmit,
    resetForm
  };
};