import { Dialog } from "@/components/ui/dialog";
import { QuestionsDialogContent } from "./dialog/QuestionsDialogContent";

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
  selectedSubject,
  selectedTopic,
  searchTerm,
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
      <QuestionsDialogContent
        questions={questions}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </Dialog>
  );
};