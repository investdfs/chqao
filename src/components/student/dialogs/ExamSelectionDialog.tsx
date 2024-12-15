import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
                onClick={() => onExamSelect(year)}
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