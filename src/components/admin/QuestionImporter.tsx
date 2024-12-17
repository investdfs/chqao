import { QuestionsDialog } from "./questions/QuestionsDialog";
import { useQuestionImporter } from "./questions/hooks/useQuestionImporter";
import { ImporterTabs } from "./questions/importer/ImporterTabs";
import { JsonInputs } from "./questions/importer/JsonInputs";
import { ResetDialog } from "./questions/importer/ResetDialog";
import { ActionButtons } from "./questions/ActionButtons";
import { Button } from "@/components/ui/button";
import { insertHistoryQuestions } from "@/utils/insertHistoryQuestions";
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

  const handleInsertHistoryQuestions = async () => {
    try {
      const result = await insertHistoryQuestions();
      toast({
        title: "Sucesso!",
        description: `${result.count} questões de História inseridas com sucesso.`,
      });
      fetchQuestions(); // Atualiza a lista de questões
    } catch (error) {
      toast({
        title: "Erro ao inserir questões",
        description: "Ocorreu um erro ao inserir as questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <JsonInputs />
      <ImporterTabs />

      <div className="flex gap-4">
        <Button 
          onClick={handleInsertHistoryQuestions}
          className="bg-green-600 hover:bg-green-700"
        >
          Inserir Questões de História
        </Button>
      </div>

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