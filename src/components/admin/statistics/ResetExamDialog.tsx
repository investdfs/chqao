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
  const { toast } = useToast();

  const handleReset = async () => {
    try {
      setIsResetting(true);
      console.log('Iniciando reset das provas anteriores...');

      // Deletar questões primeiro devido à restrição de chave estrangeira
      const { error: questionsError } = await supabase
        .from('previous_exam_questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (questionsError) throw questionsError;

      // Depois deletar as provas
      const { error: examsError } = await supabase
        .from('previous_exams')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (examsError) throw examsError;

      toast({
        title: "Provas resetadas com sucesso",
        description: "Todas as provas anteriores foram removidas.",
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
            Tem certeza que deseja apagar todas as provas anteriores? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
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
            disabled={isResetting}
          >
            {isResetting ? "Resetando..." : "Confirmar Reset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};