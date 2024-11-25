import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GenerationForm } from './upload/GenerationForm';

type SelectedPdf = {
  id: string;
  filename: string;
  file_path: string;
  subject: string | null;
};

interface PdfUploadCardProps {
  selectedPdf: SelectedPdf | null;
  onPdfSelect: (pdf: SelectedPdf | null) => void;
}

export const PdfUploadCard = ({ selectedPdf, onPdfSelect }: PdfUploadCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionCount, setQuestionCount] = useState("5");
  const [instructions, setInstructions] = useState("");
  const { toast } = useToast();

  console.log('PdfUploadCard - Selected PDF:', selectedPdf); // Debug log

  const handleSubmit = async () => {
    if (!selectedPdf) {
      toast({
        title: "Nenhum PDF selecionado",
        description: "Por favor, selecione um PDF da lista antes de continuar.",
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
            customInstructions: instructions
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
          customInstructions: instructions
        }
      });

      if (functionError) throw functionError;

      toast({
        title: "Processamento iniciado",
        description: "O PDF está sendo processado. Aguarde a conclusão.",
      });

      onPdfSelect(null);
      setInstructions("");

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerar Questões com IA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedPdf ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">PDF selecionado:</p>
            <p className="text-sm text-gray-600">{selectedPdf.filename}</p>
            <p className="text-sm text-gray-500">Matéria: {selectedPdf.subject || 'Não definida'}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Selecione um PDF da lista ao lado para gerar questões
          </p>
        )}

        <GenerationForm
          questionCount={questionCount}
          instructions={instructions}
          isProcessing={isProcessing}
          hasFile={!!selectedPdf}
          onQuestionCountChange={setQuestionCount}
          onInstructionsChange={setInstructions}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};