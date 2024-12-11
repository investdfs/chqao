import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface ResetExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export const ResetExamDialog = ({ 
  open, 
  onOpenChange,
  onReset 
}: ResetExamDialogProps) => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [examYears, setExamYears] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExamYears = async () => {
      const { data: exams, error } = await supabase
        .from('previous_exams')
        .select('year');

      if (!error && exams) {
        const uniqueYears = Array.from(new Set(exams.map(exam => exam.year))).sort((a, b) => b - a);
        setExamYears(uniqueYears);
      }
    };

    fetchExamYears();
  }, []);

  const handleResetExamQuestions = async () => {
    if (!selectedYear) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um ano para resetar",
        variant: "destructive",
      });
      return;
    }

    try {
      // Primeiro, encontrar todos os IDs de exames do ano selecionado
      const { data: exams, error: examError } = await supabase
        .from('previous_exams')
        .select('id')
        .eq('year', parseInt(selectedYear));

      if (examError) throw examError;

      if (exams && exams.length > 0) {
        const examIds = exams.map(exam => exam.id);
        
        // Deletar todas as questões associadas aos exames do ano selecionado
        const { error: deleteError } = await supabase
          .from('previous_exam_questions')
          .delete()
          .in('exam_id', examIds);

        if (deleteError) throw deleteError;

        // Deletar os exames do ano selecionado
        const { error: deleteExamError } = await supabase
          .from('previous_exams')
          .delete()
          .eq('year', parseInt(selectedYear));

        if (deleteExamError) throw deleteExamError;
      }

      toast({
        title: "Sucesso",
        description: `Questões do ano ${selectedYear} foram removidas com sucesso.`,
      });

      onReset();
      onOpenChange(false);
      setSelectedYear("");
    } catch (error) {
      console.error('Error resetting exam questions:', error);
      toast({
        title: "Erro",
        description: "Erro ao resetar questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resetar Questões de Prova Anterior</AlertDialogTitle>
          <AlertDialogDescription>
            Selecione o ano da prova que deseja apagar as questões.
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {examYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleResetExamQuestions}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Apagar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};