import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestionFilters } from "./QuestionFilters";
import { QuestionsTable } from "./QuestionsTable";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: any[];
  selectedTheme: string;
  selectedSubject: string;
  selectedTopic: string;
  searchTerm: string;
  onThemeChange: (theme: string) => void;
  onSubjectChange: (subject: string) => void;
  onTopicChange: (topic: string) => void;
  onSearchChange: (search: string) => void;
  onFilter: () => void;
}

export const QuestionsDialog = ({
  open,
  onOpenChange,
  questions,
  selectedTheme,
  selectedSubject,
  selectedTopic,
  searchTerm,
  onThemeChange,
  onSubjectChange,
  onTopicChange,
  onSearchChange,
  onFilter,
}: QuestionsDialogProps) => {
  const filters = {
    subject: selectedSubject,
    topic: selectedTopic,
    searchTerm: searchTerm,
  };

  const handleFilterChange = (field: string, value: string) => {
    switch (field) {
      case "subject":
        onSubjectChange(value);
        break;
      case "topic":
        onTopicChange(value);
        break;
      case "searchTerm":
        onSearchChange(value);
        break;
    }
    onFilter();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Questões Cadastradas</DialogTitle>
        </DialogHeader>

        <QuestionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <QuestionsTable questions={questions} />
      </DialogContent>
    </Dialog>
  );
};