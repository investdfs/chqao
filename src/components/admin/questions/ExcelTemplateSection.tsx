import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadExcelTemplate } from "@/utils/excelUtils";

export const ExcelTemplateSection = () => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <h3 className="font-medium">Instruções para importação:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Baixe o modelo de planilha clicando no botão abaixo</li>
          <li>Preencha as questões seguindo o formato do modelo</li>
          <li>Não modifique as colunas ou sua ordem</li>
          <li>Salve o arquivo em formato .xlsx ou .csv</li>
          <li>Faça upload do arquivo preenchido</li>
        </ol>
      </div>

      <Button className="flex items-center gap-2" onClick={downloadExcelTemplate}>
        <Download className="h-4 w-4" />
        Baixar Modelo de Planilha
      </Button>
    </div>
  );
};