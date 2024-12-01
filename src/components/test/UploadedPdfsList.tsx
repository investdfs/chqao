import { useQuery } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { SubjectSelect } from "./upload/SubjectSelect";
import { PdfList } from "./upload/PdfList";

type UploadedPdf = {
  id: string;
  filename: string;
  subject: string | null;
  file_path: string;
  times_used: number;
  theme: string | null;
};

interface Props {
  onSelectPdf: (pdf: UploadedPdf) => void;
}

export const UploadedPdfsList = ({ onSelectPdf }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const { toast } = useToast();
  
  const { data: pdfs, isLoading, refetch } = useQuery({
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo PDF.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedSubject) {
      toast({
        title: "Matéria não selecionada",
        description: "Por favor, selecione uma matéria para o PDF.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log('Iniciando upload do PDF:', file.name);
      
      const filePath = `${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('pdf_uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: pdfInsertError } = await supabase
        .from('uploaded_pdfs')
        .insert([{
          filename: file.name,
          file_path: filePath,
          subject: selectedSubject
        }]);

      if (pdfInsertError) throw pdfInsertError;

      toast({
        title: "Upload concluído",
        description: "O PDF foi enviado com sucesso.",
      });

      refetch();
      if (event.target) {
        event.target.value = '';
      }

    } catch (error) {
      console.error('Erro ao fazer upload do PDF:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar o arquivo.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

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
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="space-y-4">
            <SubjectSelect 
              type="subject" 
              value={selectedSubject} 
              onValueChange={setSelectedSubject} 
            />

            <div className="text-center">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="pdf-upload"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="pdf-upload"
                className={`cursor-pointer flex flex-col items-center space-y-2 ${
                  isUploading ? "opacity-50" : ""
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enviando arquivo...</span>
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
          </div>
        </div>

        <PdfList pdfs={pdfs || []} onSelectPdf={onSelectPdf} />
      </CardContent>
    </Card>
  );
};