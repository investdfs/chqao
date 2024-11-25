import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface AvailablePdfsListProps {
  onSelectPdf: (filePath: string) => void;
}

export const AvailablePdfsList = ({ onSelectPdf }: AvailablePdfsListProps) => {
  const { data: pdfs, isLoading } = useQuery({
    queryKey: ['available-pdfs'],
    queryFn: async () => {
      console.log('Fetching available PDFs...');
      const { data, error } = await supabase
        .from('uploaded_pdfs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching PDFs:', error);
        throw error;
      }

      console.log('Fetched PDFs:', data);
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PDFs Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDFs Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {pdfs && pdfs.length > 0 ? (
            <div className="space-y-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-medium">{pdf.filename}</p>
                      <p className="text-sm text-gray-500">
                        {pdf.subject ? `Matéria: ${pdf.subject}` : 'Sem matéria definida'} • 
                        Usado {pdf.times_used || 0} {pdf.times_used === 1 ? 'vez' : 'vezes'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => onSelectPdf(pdf.file_path)}
                  >
                    Usar PDF
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Nenhum PDF disponível no momento
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};