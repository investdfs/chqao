import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Link as LinkIcon } from "lucide-react";
import { GenerationForm } from './upload/GenerationForm';
import { SubjectSelect } from './upload/SubjectSelect';
import { UrlImportDialog } from './upload/UrlImportDialog';
import { usePdfUpload } from './upload/usePdfUpload';

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
  const {
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
  } = usePdfUpload(selectedPdf, onPdfSelect);

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
          hasFile={!!selectedPdf}
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