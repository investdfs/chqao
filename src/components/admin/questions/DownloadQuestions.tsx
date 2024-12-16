import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

export const DownloadQuestions = () => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      console.log('Iniciando download das questões...');
      toast({
        title: "Download iniciado",
        description: "Preparando arquivo de questões...",
      });

      // Buscar questões regulares
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Formatar questões para exportação
      const formattedQuestions = questions.map(q => ({
        theme: q.theme || 'História do Brasil',
        subject_matter: q.subject_matter || '',
        text: q.text,
        image_url: q.image_url || '',
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        option_e: q.option_e,
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'Médio',
        is_from_previous_exam: q.is_from_previous_exam ? 'Sim' : 'Não',
        exam_year: q.exam_year || '',
        exam_name: '',
        status: q.status || 'active'
      }));

      // Criar workbook e worksheet
      const workbook = XLSX.utils.book_new();
      
      // Adicionar aba de instruções
      const instructions = [
        ["Instruções para Importação de Questões"],
        [""],
        ["1. Não modifique a estrutura ou os nomes das colunas"],
        ["2. O campo 'theme' deve ser uma das seguintes opções:"],
        ["   - Língua Portuguesa"],
        ["   - Geografia do Brasil"],
        ["   - História do Brasil"],
        ["   - Estatuto dos Militares"],
        ["   - Licitações e Contratos"],
        ["   - Regulamento de Administração do Exército (RAE)"],
        ["   - Direito Militar e Sindicância no Âmbito do Exército Brasileiro"],
        ["   - Código Penal Militar"],
        ["   - Código de Processo Penal Militar"],
        [""],
        ["3. O campo 'difficulty' deve ser: Fácil, Médio ou Difícil"],
        ["4. O campo 'correct_answer' deve ser apenas: A, B, C, D ou E"],
        ["5. O campo 'is_from_previous_exam' deve ser: Sim ou Não"],
        ["6. O campo 'status' deve ser: active ou inactive"],
        ["7. URLs de imagens devem ser links válidos e acessíveis"],
      ];

      const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, wsInstructions, "Instruções");

      // Adicionar aba com as questões
      const wsQuestions = XLSX.utils.json_to_sheet(formattedQuestions);

      // Configurar largura das colunas
      wsQuestions['!cols'] = [
        { wch: 30 },  // theme
        { wch: 30 },  // subject_matter
        { wch: 50 },  // text
        { wch: 30 },  // image_url
        { wch: 30 },  // option_a
        { wch: 30 },  // option_b
        { wch: 30 },  // option_c
        { wch: 30 },  // option_d
        { wch: 30 },  // option_e
        { wch: 15 },  // correct_answer
        { wch: 50 },  // explanation
        { wch: 15 },  // difficulty
        { wch: 15 },  // is_from_previous_exam
        { wch: 15 },  // exam_year
        { wch: 30 },  // exam_name
        { wch: 15 },  // status
      ];
      
      XLSX.utils.book_append_sheet(workbook, wsQuestions, "Questões");
      
      // Download do arquivo
      XLSX.writeFile(workbook, "banco_questoes.xlsx");
      
      console.log('Download concluído com sucesso!');
      toast({
        title: "Download concluído",
        description: "O arquivo foi baixado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao baixar questões:', error);
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao baixar as questões.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Download Questões
    </Button>
  );
};