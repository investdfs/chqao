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

      // Determine the theme value - if "none" is selected or empty string, use null
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

      let retryCount = 0;
      const maxRetries = 3;
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          console.log(`Tentativa ${retryCount + 1} de ${maxRetries} de processar o PDF...`);
          
          const { error: functionError } = await supabase.functions.invoke('process-pdf', {
            body: { 
              generationId: generation.id,
              filePath: selectedPdf.file_path,
              questionCount: parseInt(questionCount),
              customInstructions: instructions,
              subject: selectedSubject,
              theme: themeValue
            }
          });

          if (functionError) {
            if (functionError.message.includes('Too Many Requests') || 
                functionError.message.includes('Limite de tentativas excedido')) {
              retryCount++;
              if (retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
                console.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                
                toast({
                  title: "Tentando novamente",
                  description: `Tentativa ${retryCount + 1} de ${maxRetries}...`,
                });
                
                continue;
              }
            }
            throw functionError;
          }

          success = true;
          toast({
            title: "Processamento iniciado",
            description: "O PDF está sendo processado. Aguarde a conclusão.",
          });

          onPdfSelect(null);
          setInstructions("");
          setSelectedSubject("");
          setSelectedTheme("");
          
        } catch (error) {
          console.error(`Erro na tentativa ${retryCount + 1}:`, error);
          if (retryCount === maxRetries - 1) {
            throw error;
          }
        }
      }

    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      toast({
        title: "Erro ao processar PDF",
        description: "O serviço está temporariamente sobrecarregado. Por favor, aguarde alguns minutos e tente novamente.",
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