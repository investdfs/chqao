import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestionFilters } from "./QuestionFilters";
import { QuestionsTable } from "./QuestionsTable";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: any[];
  themes: string[];
  subjects: string[];
  topics: string[];
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
  themes,
  subjects,
  topics,
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Questões Cadastradas</DialogTitle>
        </DialogHeader>

        <QuestionFilters
          themes={themes}
          subjects={subjects}
          topics={topics}
          selectedTheme={selectedTheme}
          selectedSubject={selectedSubject}
          selectedTopic={selectedTopic}
          searchTerm={searchTerm}
          onThemeChange={onThemeChange}
          onSubjectChange={onSubjectChange}
          onTopicChange={onTopicChange}
          onSearchChange={onSearchChange}
          onFilter={onFilter}
        />

        <QuestionsTable questions={questions} />
      </DialogContent>
    </Dialog>
  );
};