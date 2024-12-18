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
            Cole as questões no formato JSON, uma por linha. Cada questão deve conter os campos: questao, opcao_a até opcao_e, resposta_correta, comentario e nivel.
          </DialogDescription>
        </DialogHeader>

        <ExamForm
          examYear={examYear}
          examName="Concurso EIPS-CHQAO"
          questions={questions}
          onExamYearChange={setExamYear}
          onExamNameChange={() => {}}
          onQuestionsChange={setQuestions}
        />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleInsertQuestions}
            disabled={!examYear || !questions.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Inserir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};