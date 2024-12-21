import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useResetExam = (onReset: () => void) => {
  const [isResetting, setIsResetting] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchYears = async () => {
    try {
      const { data, error } = await supabase
        .from('previous_exams')
        .select('year')
        .order('year', { ascending: false });

      if (error) throw error;

      const years = [...new Set(data.map(exam => exam.year))];
      setAvailableYears(years);
    } catch (error) {
      console.error('Erro ao buscar anos:', error);
    }
  };

  const fetchSubjects = async (year: string) => {
    try {
      const { data: exams, error: examsError } = await supabase
        .from('previous_exams')
        .select('id')
        .eq('year', parseInt(year));

      if (examsError) throw examsError;

      if (exams) {
        const examIds = exams.map(exam => exam.id);
        const { data, error } = await supabase
          .from('previous_exam_questions')
          .select('subject')
          .in('exam_id', examIds);

        if (error) throw error;

        const subjects = [...new Set(data.map(q => q.subject))];
        setAvailableSubjects(subjects);
      }
    } catch (error) {
      console.error('Erro ao buscar matérias:', error);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedSubject("");
    fetchSubjects(year);
  };

  const handleReset = async () => {
    if (!selectedYear) {
      toast({
        title: "Selecione um ano",
        description: "É necessário selecionar um ano para continuar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsResetting(true);
      console.log('Iniciando reset das provas anteriores...');

      // Get exam IDs for the selected year
      const { data: exams, error: examsError } = await supabase
        .from('previous_exams')
        .select('id')
        .eq('year', parseInt(selectedYear));

      if (examsError) throw examsError;

      if (exams && exams.length > 0) {
        const examIds = exams.map(exam => exam.id);
        let questionsQuery = supabase
          .from('previous_exam_questions')
          .delete()
          .in('exam_id', examIds);

        // Add subject filter if selected
        if (selectedSubject) {
          questionsQuery = questionsQuery.eq('subject', selectedSubject);
        }

        const { error: questionsError } = await questionsQuery;
        if (questionsError) throw questionsError;

        // Record the update in history
        const changes = {
          year: selectedYear,
          subject: selectedSubject || 'all',
          examIds,
        };

        const { error: historyError } = await supabase
          .rpc('record_update', { 
            p_type: 'exam_reset',
            p_changes: changes,
          });

        if (historyError) throw historyError;

        // Only delete exams if no subject filter is applied
        if (!selectedSubject) {
          const { error: examsDeleteError } = await supabase
            .from('previous_exams')
            .delete()
            .in('id', examIds);

          if (examsDeleteError) throw examsDeleteError;
        }
      }

      toast({
        title: "Provas resetadas com sucesso",
        description: selectedSubject
          ? `Questões de ${selectedSubject} do ano ${selectedYear} foram removidas.`
          : `Todas as provas de ${selectedYear} foram removidas.`,
      });

      onReset();
    } catch (error) {
      console.error('Erro ao resetar provas:', error);
      toast({
        title: "Erro ao resetar provas",
        description: "Ocorreu um erro ao tentar resetar as provas anteriores.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  return {
    isResetting,
    selectedYear,
    selectedSubject,
    availableYears,
    availableSubjects,
    handleYearChange,
    setSelectedSubject,
    handleReset,
  };
};