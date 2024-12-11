import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

export const DownloadQuestions = () => {
  const handleDownload = async () => {
    try {
      console.log('Iniciando download das questões...');

      // Buscar questões regulares
      const { data: regularQuestions, error: regularError } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true });

      if (regularError) throw regularError;

      // Buscar questões de provas anteriores
      const { data: examQuestions, error: examError } = await supabase
        .from('previous_exam_questions')
        .select(`
          *,
          previous_exams (
            year,
            name
          )
        `)
        .order('created_at', { ascending: true });

      if (examError) throw examError;

      // Preparar dados para exportação
      const regularQuestionsFormatted = regularQuestions.map(q => ({
        ...q,
        question_type: 'regular'
      }));

      const examQuestionsFormatted = examQuestions.map(q => ({
        ...q,
        question_type: 'exam',
        exam_year: q.previous_exams?.year,
        exam_name: q.previous_exams?.name
      }));

      const allQuestions = [...regularQuestionsFormatted, ...examQuestionsFormatted];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(allQuestions);
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Questões");
      
      XLSX.writeFile(workbook, "questoes.xlsx");
      
      console.log('Download concluído com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar questões:', error);
    }
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Download Questões
    </Button>
  );
};