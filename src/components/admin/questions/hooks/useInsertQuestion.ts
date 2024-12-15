import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface QuestionData {
  subject: string;
  topic: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  image_url: string;
}

export const useInsertQuestion = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [questionData, setQuestionData] = useState<QuestionData>({
    subject: "",
    topic: "",
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    option_e: "",
    correct_answer: "",
    explanation: "",
    image_url: ""
  });

  const handleInputChange = (field: string, value: string) => {
    console.log(`Atualizando campo ${field} com valor:`, value);
    setQuestionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateAlternatives = async () => {
    if (!questionData.text) {
      toast({
        title: "Erro",
        description: "Digite o texto da questão primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    console.log("Gerando alternativas para a questão:", questionData.text);

    try {
      const { data, error } = await supabase.functions.invoke('generate-alternatives', {
        body: { questionText: questionData.text }
      });

      if (error) throw error;

      console.log("Alternativas geradas:", data);
      
      if (data.alternatives) {
        setQuestionData(prev => ({
          ...prev,
          option_a: data.alternatives.a || prev.option_a,
          option_b: data.alternatives.b || prev.option_b,
          option_c: data.alternatives.c || prev.option_c,
          option_d: data.alternatives.d || prev.option_d,
          option_e: data.alternatives.e || prev.option_e,
        }));

        toast({
          title: "Sucesso",
          description: "Alternativas geradas com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar alternativas:", error);
      toast({
        title: "Erro ao gerar alternativas",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertQuestion = async () => {
    if (!questionData.subject || !questionData.topic || !questionData.text || !questionData.correct_answer) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios (matéria, tópico, texto da questão e resposta correta).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Inserindo questão:", questionData);

    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          ...questionData,
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Questão inserida com sucesso.",
      });
      
      resetForm();
    } catch (error) {
      console.error("Erro ao inserir questão:", error);
      toast({
        title: "Erro ao inserir questão",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOpen(false);
    setQuestionData({
      subject: "",
      topic: "",
      text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      option_e: "",
      correct_answer: "",
      explanation: "",
      image_url: ""
    });
  };

  return {
    open,
    setOpen,
    isLoading,
    isGenerating,
    questionData,
    handleInputChange,
    generateAlternatives,
    handleInsertQuestion,
    resetForm
  };
};