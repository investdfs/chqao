import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  const [isResetting, setIsResetting] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch available years when dialog opens
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

  // Fetch subjects for selected year
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
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Reset</DialogTitle>
          <DialogDescription>
            Selecione o ano e opcionalmente a matéria para resetar as provas. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="year">Ano</Label>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedYear && (
            <div className="space-y-2">
              <Label htmlFor="subject">Matéria (opcional)</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as matérias</SelectItem>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isResetting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={isResetting || !selectedYear}
          >
            {isResetting ? "Resetando..." : "Confirmar Reset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};