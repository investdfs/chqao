import { QuestionsDialog } from "./questions/QuestionsDialog";
import { useQuestionImporter } from "./questions/hooks/useQuestionImporter";
import { ImporterTabs } from "./questions/importer/ImporterTabs";
import { JsonInputs } from "./questions/importer/JsonInputs";
import { ResetDialog } from "./questions/importer/ResetDialog";
import { ActionButtons } from "./questions/ActionButtons";
import { useToast } from "@/components/ui/use-toast";

export const QuestionImporter = () => {
  const { toast } = useToast();
  const {
    questions,
    showQuestions,
    setShowQuestions,
    selectedTheme,
    selectedSubject,
    selectedTopic,
    searchTerm,
    showResetDialog,
    setShowResetDialog,
    setSelectedTheme,
    setSelectedSubject,
    setSelectedTopic,
    setSearchTerm,
    fetchQuestions,
    fetchThemesSubjectsAndTopics,
    handleResetDatabase
  } = useQuestionImporter();

  return (
    <div className="space-y-4">
      <JsonInputs />
      <ImporterTabs />

      <ActionButtons
        questionsCount={questions.length}
        onShowQuestions={() => {
          setShowQuestions(true);
          fetchQuestions();
          fetchThemesSubjectsAndTopics();
        }}
        onShowResetDialog={() => setShowResetDialog(true)}
      />

      <QuestionsDialog
        open={showQuestions}
        onOpenChange={setShowQuestions}
        questions={questions}
        selectedTheme={selectedTheme}
        selectedSubject={selectedSubject}
        selectedTopic={selectedTopic}
        searchTerm={searchTerm}
        onThemeChange={setSelectedTheme}
        onSubjectChange={setSelectedSubject}
        onTopicChange={setSelectedTopic}
        onSearchChange={setSearchTerm}
        onFilter={fetchQuestions}
      />

      <ResetDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={handleResetDatabase}
      />
    </div>
  );
};