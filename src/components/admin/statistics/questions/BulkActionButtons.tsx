import { Button } from "@/components/ui/button";

interface BulkActionButtonsProps {
  selectedQuestions: any[];
  onSuccess: () => void;
}

export const BulkActionButtons = ({ selectedQuestions, onSuccess }: BulkActionButtonsProps) => {
  if (!selectedQuestions.length) return null;

  return (
    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm text-muted-foreground">
        {selectedQuestions.length} questões selecionadas
      </span>
      <Button
        size="sm"
        variant="destructive"
        onClick={onSuccess}
      >
        Excluir selecionadas
      </Button>
    </div>
  );
};