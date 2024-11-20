import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadExcelTemplate } from "@/utils/excelUtils";
import { useToast } from "@/components/ui/use-toast";

export const ExcelTemplateSection = () => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      await downloadExcelTemplate();
      toast({
        title: "Download iniciado",
        description: "O modelo de planilha está sendo baixado.",
      });
    } catch (error) {
      console.error('Erro ao baixar template:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o modelo de planilha.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <h3 className="font-medium">Instruções para importação:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Baixe o modelo de planilha clicando no botão abaixo</li>
          <li>Cada aba representa uma matéria diferente</li>
          <li>Preencha as questões seguindo o formato do modelo</li>
          <li>Não modifique as colunas ou sua ordem</li>
          <li>Salve o arquivo em formato .xlsx</li>
          <li>Faça upload do arquivo preenchido</li>
        </ol>
      </div>

      <Button 
        className="flex items-center gap-2" 
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Baixar Modelo de Planilha
      </Button>
    </div>
  );
};