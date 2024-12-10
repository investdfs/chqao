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
      const { data: examQuestions, error } = await supabase
        .from('questions')
        .select('exam_year')
        .eq('is_from_previous_exam', true);

      if (!error && examQuestions) {
        const uniqueYears = new Set(examQuestions.map(q => q.exam_year).filter(Boolean));
        setExamYears(Array.from(uniqueYears).sort((a, b) => b - a));
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
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('is_from_previous_exam', true)
        .eq('exam_year', parseInt(selectedYear));

      if (error) throw error;

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