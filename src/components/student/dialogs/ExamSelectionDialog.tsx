import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ExamSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExamSelect: (year: number) => void;
}

const exams = Array.from({ length: 12 }, (_, i) => 2024 - i).reverse();

export const ExamSelectionDialog = ({
  open,
  onOpenChange,
  onExamSelect
}: ExamSelectionDialogProps) => {
  const { toast } = useToast();

  const { data: examQuestionsCount } = useQuery({
    queryKey: ['questions-count-by-exam'],
    queryFn: async () => {
      console.log("Buscando contagem de questões por ano de prova...");
      const { data: exams, error: examsError } = await supabase
        .from('previous_exams')
        .select('id, year');

      if (examsError) {
        console.error("Erro ao buscar provas:", examsError);
        return {};
      }

      const examCounts: Record<number, number> = {};
      
      for (const exam of exams) {
        const { count, error: questionsError } = await supabase
          .from('previous_exam_questions')
          .select('*', { count: 'exact' })
          .eq('exam_id', exam.id);

        if (questionsError) {
          console.error("Erro ao buscar questões da prova:", questionsError);
          continue;
        }

        examCounts[exam.year] = count || 0;
      }

      console.log("Contagem de questões por ano:", examCounts);
      return examCounts;
    }
  });

  const handleExamSelect = (year: number) => {
    const count = examQuestionsCount?.[year] || 0;
    
    if (count === 0) {
      toast({
        title: "Desculpe, não há questões disponíveis",
        description: "Estamos trabalhando para adicionar milhares de novas questões de provas anteriores. Por favor, tente outro ano ou volte mais tarde.",
        variant: "destructive"
      });
      return;
    }

    onExamSelect(year);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Selecione qual prova você deseja refazer
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] mt-4">
          <div className="flex flex-col gap-2 p-4">
            {exams.map((year, index) => (
              <Button
                key={year}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 hover:bg-primary/10"
                onClick={() => handleExamSelect(year)}
              >
                <span className="mr-2">{index + 1}.</span>
                EI PS/CHQAO {year}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};