import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const PdfUploadCard = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo PDF.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      console.log('Iniciando upload do PDF:', file.name);

      // Upload do arquivo para o Storage
      const filePath = `${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('pdf_uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Criar registro inicial
      const { data: generation, error: insertError } = await supabase
        .from('ai_question_generations')
        .insert([{ 
          content: filePath,
          metadata: { 
            originalName: file.name,
            fileSize: file.size
          }
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Chamar Edge Function para processar o PDF
      const { error: functionError } = await supabase.functions.invoke('process-pdf', {
        body: { 
          generationId: generation.id,
          filePath: filePath
        }
      });

      if (functionError) throw functionError;

      toast({
        title: "Processamento iniciado",
        description: "O PDF está sendo processado. Aguarde a conclusão.",
      });

      setFile(null);
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
      <CardContent className="space-y-4">
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
        <Button 
          onClick={handleSubmit}
          disabled={!file || isProcessing}
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