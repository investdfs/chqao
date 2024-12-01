import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GenerationForm } from './upload/GenerationForm';
import { Button } from "@/components/ui/button";
import { X, Link as LinkIcon } from "lucide-react";
import { SubjectSelect } from './upload/SubjectSelect';
import { UrlImportDialog } from './upload/UrlImportDialog';

type SelectedPdf = {
  id: string;
  filename: string;
  file_path: string;
  subject: string | null;
  theme: string | null;
};

interface PdfUploadCardProps {
  selectedPdf: SelectedPdf | null;
  onPdfSelect: (pdf: SelectedPdf | null) => void;
}

export const PdfUploadCard = ({ selectedPdf, onPdfSelect }: PdfUploadCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionCount, setQuestionCount] = useState("5");
  const [instructions, setInstructions] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [showUrlImport, setShowUrlImport] = useState(false);
  const { toast } = useToast();

  console.log('PdfUploadCard - Selected PDF:', selectedPdf);

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerar Questões com IA</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowUrlImport(true)}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Importar via URL
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedPdf ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">PDF selecionado:</p>
                <p className="text-sm text-gray-600">{selectedPdf.filename}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePdf}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Remover PDF
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Selecione um PDF da lista ao lado para gerar questões
          </p>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Matéria</label>
            <SubjectSelect
              type="subject"
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tema</label>
            <SubjectSelect
              type="theme"
              value={selectedTheme}
              onValueChange={setSelectedTheme}
              subjectFilter={selectedSubject}
            />
          </div>
        </div>

        <GenerationForm
          questionCount={questionCount}
          instructions={instructions}
          isProcessing={isProcessing}
          hasFile={!!selectedPdf && !!selectedSubject && !!selectedTheme}
          onQuestionCountChange={setQuestionCount}
          onInstructionsChange={setInstructions}
          onSubmit={handleSubmit}
        />

        <UrlImportDialog
          open={showUrlImport}
          onOpenChange={setShowUrlImport}
        />
      </CardContent>
    </Card>
  );
};