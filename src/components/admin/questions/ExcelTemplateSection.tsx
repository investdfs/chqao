import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { templateSubjects, getTemplateHeaders, getSampleQuestions } from '@/utils/excel/templateData';

export const ExcelTemplateSection = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      console.log("Iniciando geração do template Excel com questões de exemplo...");
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      const headers = getTemplateHeaders();
      const sampleQuestions = getSampleQuestions();

      // Create worksheet for each subject
      templateSubjects.forEach(subject => {
        console.log(`Criando aba para: ${subject}`);
        
        // Convert sample questions to rows
        const rows = sampleQuestions.map(q => [
          q.tema,
          q.assunto,
          q.questao,
          q.imagem,
          q.opcaoA,
          q.opcaoB,
          q.opcaoC,
          q.opcaoD,
          q.opcaoE,
          q.resposta,
          q.explicacao,
          q.dificuldade,
          q.concursoAnterior,
          q.ano,
          q.nome
        ]);

        // Create worksheet with headers and rows
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        // Set column widths
        ws['!cols'] = [
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

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, subject);
      });

      // Add instructions sheet
      const instructions = [
        ["Instruções para Preenchimento do Banco de Questões CHQAo"],
        [""],
        ["1. Cada aba representa uma matéria diferente do concurso"],
        ["2. Organize as questões por Tema e Assunto dentro de cada matéria"],
        ["3. Mantenha o formato exato das colunas ao adicionar suas questões"],
        ["4. A coluna 'Resposta Correta' deve conter apenas A, B, C, D ou E"],
        ["5. A coluna 'Dificuldade' deve ser preenchida com: Fácil, Médio ou Difícil"],
        ["6. O campo 'URL da Imagem' é opcional - deixe em branco se não houver imagem"],
        ["7. Para questões de concursos anteriores, marque 'Sim' e preencha o ano e nome"],
        ["8. Você pode adicionar quantas linhas quiser em cada aba"],
        ["9. Não modifique o cabeçalho das colunas"],
        [""],
        ["Observações Importantes:"],
        ["- Mantenha a linguagem formal militar"],
        ["- Verifique a precisão técnica das questões"],
        ["- Inclua explicações detalhadas para cada resposta"],
        ["- Classifique corretamente a dificuldade das questões"]
      ];

      const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
      wsInstructions['!cols'] = [{ wch: 80 }];
      XLSX.utils.book_append_sheet(wb, wsInstructions, "Instruções");

      // Download file
      console.log("Gerando arquivo para download...");
      XLSX.writeFile(wb, "modelo_questoes_chqao.xlsx");
      
      console.log("Download do template concluído com sucesso");
      toast({
        title: "Download iniciado",
        description: "O modelo de planilha com questões de exemplo está sendo baixado.",
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
        Baixar Modelo de Planilha com Exemplos
      </Button>
    </div>
  );
};