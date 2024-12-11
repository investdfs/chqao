import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

export const DownloadQuestions = () => {
  const { toast } = useToast();

  const handleDownload = async () => {
    console.log("Iniciando download de todas as questões...");
    
    try {
      // Buscar questões regulares
      const { data: regularQuestions, error: regularError } = await supabase
        .from("questions")
        .select("*")
        .order('subject', { ascending: true });

      if (regularError) throw regularError;

      // Buscar questões de provas anteriores
      const { data: examQuestions, error: examError } = await supabase
        .from("previous_exam_questions")
        .select(`
          *,
          previous_exams (
            year,
            name
          )
        `)
        .order('subject', { ascending: true });

      if (examError) throw examError;

      // Mapear questões regulares para o formato da planilha
      const regularQuestionsForExcel = regularQuestions.map(question => ({
        "Matéria": question.subject,
        "Tema": question.theme || '',
        "Assunto": question.topic || '',
        "Questão": question.text,
        "URL da Imagem": question.image_url || '',
        "Opção A": question.option_a,
        "Opção B": question.option_b,
        "Opção C": question.option_c,
        "Opção D": question.option_d,
        "Opção E": question.option_e,
        "Resposta Correta": question.correct_answer,
        "Explicação": question.explanation || '',
        "Dificuldade": question.difficulty,
        "Questão de Concurso": 'Não',
        "Ano do Concurso": '',
        "Nome do Concurso": ''
      }));

      // Mapear questões de provas anteriores
      const examQuestionsForExcel = examQuestions.map(question => ({
        "Matéria": question.subject,
        "Tema": '',
        "Assunto": question.topic || '',
        "Questão": question.text,
        "URL da Imagem": '',
        "Opção A": question.option_a,
        "Opção B": question.option_b,
        "Opção C": question.option_c,
        "Opção D": question.option_d,
        "Opção E": question.option_e,
        "Resposta Correta": question.correct_answer,
        "Explicação": question.explanation || '',
        "Dificuldade": '',
        "Questão de Concurso": 'Sim',
        "Ano do Concurso": question.previous_exams?.year || '',
        "Nome do Concurso": question.previous_exams?.name || ''
      }));

      // Combinar todas as questões
      const allQuestionsForExcel = [...regularQuestionsForExcel, ...examQuestionsForExcel];

      // Criar workbook com uma única aba
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(allQuestionsForExcel);

      // Configurar larguras das colunas
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

      // Adicionar a planilha ao workbook
      XLSX.utils.book_append_sheet(wb, ws, "Questões");

      // Download do arquivo
      XLSX.writeFile(wb, "questoes.xls");

      toast({
        title: "Download concluído",
        description: "O arquivo foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao baixar questões:", error);
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível baixar as questões.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleDownload}
    >
      <Download className="h-4 w-4" />
      Baixar Questões
    </Button>
  );
};