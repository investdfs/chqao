import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/components/ui/notification";

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
      
      const { data, error } = await supabase
        .from('questions')
        .select('exam_year')
        .eq('is_from_previous_exam', true)
        .not('exam_year', 'is', null);

      if (error) {
        console.error("Erro ao buscar questões:", error);
        return {};
      }

      const examCounts: Record<number, number> = {};
      
      // Initialize counts for all years to 0
      exams.forEach(year => {
        examCounts[year] = 0;
      });

      // Count questions for each year
      if (data) {
        data.forEach((item: any) => {
          if (item.exam_year) {
            examCounts[item.exam_year] = (examCounts[item.exam_year] || 0) + 1;
          }
        });
      }

      console.log("Contagem de questões por ano:", examCounts);
      return examCounts;
    }
  });

  const handleExamSelect = (year: number) => {
    const count = examQuestionsCount?.[year] || 0;
    
    if (count === 0) {
      showError(
        "Desculpe, não há questões disponíveis",
        "Estamos trabalhando para adicionar mais questões de provas anteriores. Por favor, tente outro ano ou volte mais tarde.",
        variant: "destructive"
      );
      return;
    }

    onExamSelect(year);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Selecione qual prova EIPS/CHQAO você deseja refazer
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
                EIPS/CHQAO {year}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
