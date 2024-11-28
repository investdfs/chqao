import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { processExcelFile } from "@/utils/excel/processExcel";
import { Progress } from "@/components/ui/progress";

export const FileUploadSection = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
        variant: "destructive",
      });
      return;
    }

    console.log("Iniciando upload do arquivo:", file.name);
    setIsUploading(true);
    setProgress(10);

    toast({
      title: "Processando arquivo",
      description: "Aguarde enquanto importamos as questões...",
    });

    try {
      setProgress(30);
      const insertedQuestions = await processExcelFile(file);
      setProgress(100);
      
      console.log("Questões processadas com sucesso:", insertedQuestions);

      toast({
        title: "Sucesso!",
        description: `${insertedQuestions.length} questões foram importadas com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro ao importar questões",
        description: error.message || "Verifique se o arquivo está no formato correto e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          id="file-upload"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex flex-col items-center space-y-2 ${
            isUploading ? "opacity-50" : ""
          }`}
        >
          {isUploading ? (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processando arquivo...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                Clique para fazer upload ou arraste um arquivo
              </span>
              <span className="text-xs text-gray-400">
                Suporta arquivos Excel (.xls, .xlsx)
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};