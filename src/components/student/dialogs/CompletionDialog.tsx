import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface CompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  onSelectNewSubject: () => void;
}

export const CompletionDialog = ({
  open,
  onOpenChange,
  subject,
  onSelectNewSubject
}: CompletionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <span>Parabéns!</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <p className="text-center text-muted-foreground">
            Você completou todas as questões disponíveis de <span className="font-semibold text-foreground">{subject}</span>!
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Novas questões são adicionadas diariamente. Que tal praticar outra matéria enquanto isso?
          </p>
          <Button onClick={onSelectNewSubject} className="w-full mt-4">
            Escolher outra matéria
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};