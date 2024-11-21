import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';

export const ExcelTemplateSection = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      console.log("Iniciando geração do template Excel...");
      
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Define headers
      const headers = [
        "Matéria",
        "Tema",
        "Assunto",
        "Questão",
        "URL da Imagem",
        "Opção A",
        "Opção B",
        "Opção C",
        "Opção D",
        "Opção E",
        "Resposta Correta",
        "Explicação",
        "Dificuldade",
        "Questão de Concurso Anterior?",
        "Ano do Concurso",
        "Nome do Concurso"
      ];

      // Example rows
      const exampleRows = [
        [
          "Língua Portuguesa",
          "Interpretação de Texto",
          "Figuras de Linguagem",
          "Exemplo de questão de português...",
          "",
          "Alternativa A",
          "Alternativa B",
          "Alternativa C",
          "Alternativa D",
          "Alternativa E",
          "A",
          "Explicação da resposta correta",
          "Médio",
          "Não",
          "",
          ""
        ],
        [
          "História do Brasil",
          "Brasil Colônia",
          "Período Colonial",
          "Exemplo de questão de história...",
          "",
          "Alternativa A",
          "Alternativa B",
          "Alternativa C",
          "Alternativa D",
          "Alternativa E",
          "B",
          "Explicação da resposta correta",
          "Fácil",
          "Sim",
          "2023",
          "Concurso X"
        ]
      ];

      // Create worksheet with headers and example rows
      const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows]);
      
      // Set column widths
      const colWidths = [
        { wch: 30 },  // Matéria
        { wch: 25 },  // Tema
        { wch: 25 },  // Assunto
        { wch: 50 },  // Questão
        { wch: 30 },  // URL da Imagem
        { wch: 20 },  // Opção A
        { wch: 20 },  // Opção B
        { wch: 20 },  // Opção C
        { wch: 20 },  // Opção D
        { wch: 20 },  // Opção E
        { wch: 15 },  // Resposta Correta
        { wch: 50 },  // Explicação
        { wch: 15 },  // Dificuldade
        { wch: 15 },  // Questão de Concurso
        { wch: 15 },  // Ano
        { wch: 25 }   // Nome do Concurso
      ];

      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Questões");

      // Download file
      console.log("Gerando arquivo para download...");
      XLSX.writeFile(wb, "modelo_questoes.xls");
      
      console.log("Download do template concluído com sucesso");
      toast({
        title: "Download iniciado",
        description: "O modelo de planilha está sendo baixado.",
      });
    } catch (error) {
      console.error('Erro ao gerar template:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o modelo de planilha. Tente novamente.",
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
          <li>Preencha as questões seguindo o formato do modelo</li>
          <li>Certifique-se de preencher a matéria corretamente para cada questão</li>
          <li>Não modifique as colunas ou sua ordem</li>
          <li>Salve o arquivo e faça upload</li>
        </ol>
      </div>

      <Button 
        className="flex items-center gap-2 w-full sm:w-auto" 
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Baixar Modelo de Planilha
      </Button>
    </div>
  );
};