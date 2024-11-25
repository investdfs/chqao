import React from 'react';
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  console.log('PdfList - Available PDFs:', pdfs); // Debug log

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
            <Button
              variant="outline"
              onClick={() => {
                console.log('Selecionando PDF:', pdf); // Debug log
                onSelectPdf(pdf);
              }}
            >
              Selecionar para Gerar Questões
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};