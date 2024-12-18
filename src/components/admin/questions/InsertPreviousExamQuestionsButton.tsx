import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useExamQuestions } from "./exam/useExamQuestions";
import { ExamForm } from "./exam/ExamForm";

export const InsertPreviousExamQuestionsButton = () => {
  const {
    open,
    setOpen,
    questions,
    setQuestions,
    examYear,
    setExamYear,
    examName,
    setExamName,
    handleInsertQuestions
  } = useExamQuestions();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
        >
          Inserir Questões de Provas Anteriores
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inserir Questões de Provas Anteriores</DialogTitle>
          <DialogDescription>
            Cole as questões no formato JSON, uma por linha. Cada questão deve conter os campos: text, option_a até option_e, correct_answer, explanation, difficulty, theme, subject e topic.
          </DialogDescription>
        </DialogHeader>

        <ExamForm
          examYear={examYear}
          examName={examName}
          questions={questions}
          onExamYearChange={setExamYear}
          onExamNameChange={setExamName}
          onQuestionsChange={setQuestions}
        />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleInsertQuestions}
            disabled={!examYear || !questions.trim()}
          >
            Inserir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};