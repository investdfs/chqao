import { ExcelTemplateSection } from "./questions/ExcelTemplateSection";
import { FileUploadSection } from "./questions/FileUploadSection";
import { ActionButtons } from "./questions/ActionButtons";
import { QuestionsDialog } from "./questions/QuestionsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuestionImporter } from "./questions/hooks/useQuestionImporter";
import { InsertQuestionsButton } from "./questions/InsertQuestionsButton";
import { InsertPreviousExamQuestionsButton } from "./questions/InsertPreviousExamQuestionsButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const QuestionImporter = () => {
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
      <Tabs defaultValue="regular" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regular">Questões Regulares</TabsTrigger>
          <TabsTrigger value="exams">Questões de Provas</TabsTrigger>
        </TabsList>

        <TabsContent value="regular" className="space-y-4">
          <ExcelTemplateSection />
          <FileUploadSection />
          <InsertQuestionsButton />
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <InsertPreviousExamQuestionsButton />
        </TabsContent>
      </Tabs>

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

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reset</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja apagar todas as questões do banco de dados? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleResetDatabase}>
              Confirmar Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};