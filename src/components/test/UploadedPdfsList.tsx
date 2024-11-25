import { useQuery } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type UploadedPdf = {
  id: string;
  filename: string;
  subject: string | null;
  description: string | null;
  times_used: number;
  created_at: string;
};

interface Props {
  onSelectPdf: (pdf: UploadedPdf) => void;
}

export const UploadedPdfsList = ({ onSelectPdf }: Props) => {
  const { data: pdfs, isLoading } = useQuery({
    queryKey: ['uploaded-pdfs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('uploaded_pdfs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UploadedPdf[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDFs Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
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
                      {pdf.subject ? `Matéria: ${pdf.subject}` : 'Sem matéria definida'} • 
                      Usado {pdf.times_used} {pdf.times_used === 1 ? 'vez' : 'vezes'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => onSelectPdf(pdf)}
                >
                  Usar PDF
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};