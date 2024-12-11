import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SelectedPdf = {
  id: string;
  filename: string;
  file_path: string;
  subject: string | null;
  theme: string | null;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const usePdfUpload = (
  selectedPdf: SelectedPdf | null,
  onPdfSelect: (pdf: SelectedPdf | null) => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionCount, setQuestionCount] = useState("5");
  const [instructions, setInstructions] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [showUrlImport, setShowUrlImport] = useState(false);
  const { toast } = useToast();

  const handleRemovePdf = () => {
    console.log('Removendo PDF do gerador:', selectedPdf?.filename);
    onPdfSelect(null);
    toast({
      title: "PDF removido",
      description: "O PDF foi removido do gerador de questões.",
    });
  };

  const processWithRetry = async (generationId: string, requestData: any) => {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Tentativa ${attempt} de ${maxRetries} de processar o PDF...`);
        
        const { error: functionError } = await supabase.functions.invoke('process-pdf', {
          body: requestData
        });

        if (!functionError) {
          console.log('Processamento iniciado com sucesso');
          return null;
        }

        if (functionError.message.includes('Too Many Requests') || 
            functionError.message.includes('Failed to fetch') ||
            functionError.message.includes('Limite de tentativas excedido')) {
          
          if (attempt < maxRetries) {
            const waitTime = baseDelay * Math.pow(2, attempt - 1);
            console.log(`Aguardando ${waitTime}ms antes da próxima tentativa...`);
            
            toast({
              title: "Processamento em andamento",
              description: `Tentativa ${attempt} de ${maxRetries}. Aguarde...`,
            });
            
            await delay(waitTime);
            continue;
          }
        }

        throw functionError;
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
      }
    }

    throw new Error('Todas as tentativas falharam');
  };

  const handleSubmit = async () => {
    if (!selectedPdf) {
      toast({
        title: "Nenhum PDF selecionado",
        description: "Por favor, selecione um PDF da lista antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedSubject) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione a matéria antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Iniciando processamento do PDF:', selectedPdf.filename);

      const { error: updateError } = await supabase.rpc('increment_pdf_usage', {
        pdf_path: selectedPdf.file_path
      });

      if (updateError) throw updateError;

      const themeValue = selectedTheme && selectedTheme !== "none" ? selectedTheme : null;

      const { data: generation, error: insertError } = await supabase
        .from('ai_question_generations')
        .insert([{ 
          content: selectedPdf.file_path,
          metadata: { 
            originalName: selectedPdf.filename,
            questionCount: parseInt(questionCount),
            customInstructions: instructions,
            subject: selectedSubject,
            theme: themeValue
          }
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      await processWithRetry(generation.id, {
        generationId: generation.id,
        filePath: selectedPdf.file_path,
        questionCount: parseInt(questionCount),
        customInstructions: instructions,
        subject: selectedSubject,
        theme: themeValue
      });

      toast({
        title: "Processamento iniciado",
        description: "O PDF está sendo processado. Aguarde a conclusão.",
      });

      onPdfSelect(null);
      setInstructions("");
      setSelectedSubject("");
      setSelectedTheme("");

    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      
      let errorMessage = "Ocorreu um erro durante o processamento. ";
      
      if (error.message.includes('Too Many Requests') || 
          error.message.includes('Limite de tentativas excedido')) {
        errorMessage += "O serviço está temporariamente sobrecarregado. Por favor, aguarde alguns minutos e tente novamente.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage += "Problema de conexão detectado. Verifique sua internet e tente novamente.";
      } else {
        errorMessage += "Tente novamente mais tarde.";
      }

      toast({
        title: "Erro ao processar PDF",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    questionCount,
    instructions,
    selectedSubject,
    selectedTheme,
    showUrlImport,
    setQuestionCount,
    setInstructions,
    setSelectedSubject,
    setSelectedTheme,
    setShowUrlImport,
    handleRemovePdf,
    handleSubmit
  };
};