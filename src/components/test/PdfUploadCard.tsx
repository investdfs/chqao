import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
      setSelectedPdfPath(null); // Clear any selected existing PDF
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
        // Upload do arquivo para o Storage
        filePath = `${crypto.randomUUID()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('pdf_uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Registrar o PDF na tabela uploaded_pdfs
        const { error: pdfInsertError } = await supabase
          .from('uploaded_pdfs')
          .insert([{
            filename: file.name,
            file_path: filePath
          }]);

        if (pdfInsertError) throw pdfInsertError;
      } else if (selectedPdfPath) {
        // Atualizar o contador de uso do PDF
        const { error: updateError } = await supabase
          .from('uploaded_pdfs')
          .update({ times_used: supabase.sql`times_used + 1` })
          .eq('file_path', selectedPdfPath);

        if (updateError) throw updateError;
      }

      // Criar registro inicial
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

      // Chamar Edge Function para processar o PDF
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
    <Card>
      <CardHeader>
        <CardTitle>Gerar Questões com IA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            id="pdf-upload"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <label
            htmlFor="pdf-upload"
            className={`cursor-pointer flex flex-col items-center space-y-2 ${
              isProcessing ? "opacity-50" : ""
            }`}
          >
            {file ? (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>{file.name}</span>
              </div>
            ) : selectedPdfPath ? (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>PDF selecionado da lista</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Clique para fazer upload ou arraste um arquivo PDF
                </span>
              </>
            )}
          </label>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="questionCount">Quantidade de Questões</Label>
            <Input
              id="questionCount"
              type="number"
              min="1"
              max="50"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              placeholder="Número de questões a serem geradas"
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instruções Específicas</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instruções específicas para a geração das questões (opcional)"
              className="min-h-[100px]"
              disabled={isProcessing}
            />
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={(!file && !selectedPdfPath) || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processando...</span>
            </div>
          ) : (
            "Iniciar Geração"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};