import React from 'react';
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UploadedPdf = {
  id: string;
  filename: string;
  subject: string | null;
  file_path: string;
  times_used: number;
};

interface PdfListProps {
  pdfs: UploadedPdf[];
  onSelectPdf: (pdf: UploadedPdf) => void;
}

export const PdfList = ({ pdfs, onSelectPdf }: PdfListProps) => {
  const { toast } = useToast();
  console.log('PdfList - Available PDFs:', pdfs); // Debug log

  const handleDelete = async (pdf: UploadedPdf) => {
    try {
      // First delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('pdf_uploads')
        .remove([pdf.file_path]);

      if (storageError) throw storageError;

      // Then delete the database record
      const { error: dbError } = await supabase
        .from('uploaded_pdfs')
        .delete()
        .eq('id', pdf.id);

      if (dbError) throw dbError;

      toast({
        title: "PDF excluído",
        description: "O arquivo foi removido com sucesso.",
      });

      // Refresh the page to update the list
      window.location.reload();

    } catch (error) {
      console.error('Erro ao excluir PDF:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o arquivo.",
        variant: "destructive"
      });
    }
  };

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {pdfs?.map((pdf) => (
          <div
            key={pdf.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-gray-400" />
              <div>
                <p className="font-medium">{pdf.filename}</p>
                <p className="text-sm text-gray-500">
                  Matéria: {pdf.subject || 'Não definida'} • 
                  Usado {pdf.times_used} {pdf.times_used === 1 ? 'vez' : 'vezes'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Selecionando PDF:', pdf); // Debug log
                  onSelectPdf(pdf);
                }}
              >
                Selecionar para Gerar Questões
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(pdf)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};