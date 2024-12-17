import { Button } from "@/components/ui/button";
import { useQuestionBulkUpdate } from "./useQuestionBulkUpdate";

interface BulkActionButtonsProps {
  selectedQuestions: string[];
  onSuccess?: () => void;
}

export const BulkActionButtons = ({ selectedQuestions, onSuccess }: BulkActionButtonsProps) => {
  const { updateQuestionsSubject } = useQuestionBulkUpdate();

  const handleUpdateSubject = async () => {
    const success = await updateQuestionsSubject(selectedQuestions);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  if (!selectedQuestions.length) return null;

  return (
    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm text-muted-foreground">
        {selectedQuestions.length} questões selecionadas
      </span>
      <Button
        size="sm"
        onClick={handleUpdateSubject}
      >
        Marcar como História do Brasil
      </Button>
    </div>
  );
};