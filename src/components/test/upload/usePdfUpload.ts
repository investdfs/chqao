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

    if (!selectedSubject || !selectedTheme) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione a matéria e o tema antes de continuar.",
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

      const { data: generation, error: insertError } = await supabase
        .from('ai_question_generations')
        .insert([{ 
          content: selectedPdf.file_path,
          metadata: { 
            originalName: selectedPdf.filename,
            questionCount: parseInt(questionCount),
            customInstructions: instructions,
            subject: selectedSubject,
            theme: selectedTheme
          }
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      const { error: functionError } = await supabase.functions.invoke('process-pdf', {
        body: { 
          generationId: generation.id,
          filePath: selectedPdf.file_path,
          questionCount: parseInt(questionCount),
          customInstructions: instructions,
          subject: selectedSubject,
          theme: selectedTheme
        }
      });

      if (functionError) throw functionError;

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
      toast({
        title: "Erro ao processar PDF",
        description: "Ocorreu um erro durante o processamento.",
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