import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

export const DownloadQuestions = () => {
  const { toast } = useToast();

  const handleDownload = async () => {
    console.log("Iniciando download das questões por matéria...");
    
    try {
      // Buscar todas as questões
      const { data: questions, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Agrupar questões por matéria
      const questionsBySubject = questions.reduce((acc: any, question) => {
        if (!acc[question.subject]) {
          acc[question.subject] = [];
        }
        acc[question.subject].push({
          "Matéria": question.subject,
          "Tópico": question.topic,
          "Questão": question.text,
          "Opção A": question.option_a,
          "Opção B": question.option_b,
          "Opção C": question.option_c,
          "Opção D": question.option_d,
          "Opção E": question.option_e,
          "Resposta Correta": question.correct_answer,
          "Explicação": question.explanation,
          "Dificuldade": question.difficulty,
        });
        return acc;
      }, {});

      // Criar workbook com uma aba para cada matéria
      const wb = XLSX.utils.book_new();
      
      Object.entries(questionsBySubject).forEach(([subject, subjectQuestions]) => {
        const ws = XLSX.utils.json_to_sheet(subjectQuestions as any[]);
        XLSX.utils.book_append_sheet(wb, ws, subject);
      });

      // Configurar larguras das colunas
      const colWidths = [
        { wch: 15 },  // Matéria
        { wch: 15 },  // Tópico
        { wch: 50 },  // Questão
        { wch: 20 },  // Opção A
        { wch: 20 },  // Opção B
        { wch: 20 },  // Opção C
        { wch: 20 },  // Opção D
        { wch: 20 },  // Opção E
        { wch: 15 },  // Resposta Correta
        { wch: 50 },  // Explicação
        { wch: 10 }   // Dificuldade
      ];

      // Aplicar larguras a todas as abas
      wb.SheetNames.forEach(sheetName => {
        const ws = wb.Sheets[sheetName];
        ws['!cols'] = colWidths;
      });

      // Download do arquivo
      XLSX.writeFile(wb, "questoes_por_materia.xlsx");

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
      Baixar Questões por Matéria
    </Button>
  );
};