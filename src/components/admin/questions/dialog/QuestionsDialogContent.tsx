import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestionFilters } from "../QuestionFilters";
import { QuestionsTable } from "../QuestionsTable";

interface QuestionsDialogContentProps {
  questions: any[];
  filters: {
    subject: string;
    topic: string;
    searchTerm: string;
  };
  onFilterChange: (field: string, value: string) => void;
}

export const QuestionsDialogContent = ({
  questions,
  filters,
  onFilterChange,
}: QuestionsDialogContentProps) => {
  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Questões Cadastradas</DialogTitle>
      </DialogHeader>

      <QuestionFilters
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <QuestionsTable questions={questions} />
    </DialogContent>
  );
};