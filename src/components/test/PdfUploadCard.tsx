import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UploadArea } from './upload/UploadArea';
import { GenerationForm } from './upload/GenerationForm';
import { AvailablePdfsList } from './upload/AvailablePdfsList';

export const PdfUploadCard = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedPdfPath, setSelectedPdfPath] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState("5");
  const [instructions, setInstructions] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setSelectedPdfPath(null);
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo PDF.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!file && !selectedPdfPath) return;

    try {
      setIsProcessing(true);
      let filePath = selectedPdfPath;

      if (file) {
        console.log('Iniciando upload do PDF:', file.name);
        filePath = `${crypto.randomUUID()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('pdf_uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: pdfInsertError } = await supabase
          .from('uploaded_pdfs')
          .insert([{
            filename: file.name,
            file_path: filePath
          }]);

        if (pdfInsertError) throw pdfInsertError;
      } else if (selectedPdfPath) {
        const { error: updateError } = await supabase.rpc('increment_pdf_usage', {
          pdf_path: selectedPdfPath
        });

        if (updateError) throw updateError;
      }

      const { data: generation, error: insertError } = await supabase
        .from('ai_question_generations')
        .insert([{ 
          content: filePath,
          metadata: { 
            originalName: file?.name,
            fileSize: file?.size,
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
          filePath: filePath,
          questionCount: parseInt(questionCount),
          customInstructions: instructions
        }
      });

      if (functionError) throw functionError;

      toast({
        title: "Processamento iniciado",
        description: "O PDF está sendo processado. Aguarde a conclusão.",
      });

      setFile(null);
      setSelectedPdfPath(null);
      setInstructions("");
      if (document.querySelector<HTMLInputElement>('#pdf-upload')) {
        (document.querySelector<HTMLInputElement>('#pdf-upload')!).value = '';
      }

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
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Gerar Questões com IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UploadArea
            file={file}
            selectedPdfPath={selectedPdfPath}
            isProcessing={isProcessing}
            onFileChange={handleFileChange}
          />
          <GenerationForm
            questionCount={questionCount}
            instructions={instructions}
            isProcessing={isProcessing}
            hasFile={!!(file || selectedPdfPath)}
            onQuestionCountChange={setQuestionCount}
            onInstructionsChange={setInstructions}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      <AvailablePdfsList onSelectPdf={(path) => {
        setSelectedPdfPath(path);
        setFile(null);
        if (document.querySelector<HTMLInputElement>('#pdf-upload')) {
          (document.querySelector<HTMLInputElement>('#pdf-upload')!).value = '';
        }
      }} />
    </div>
  );
};