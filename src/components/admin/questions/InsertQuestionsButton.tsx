import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { QuestionFormFields } from "./form/QuestionFormFields";
import { useInsertQuestion } from "./hooks/useInsertQuestion";

export const InsertQuestionsButton = () => {
  const {
    open,
    setOpen,
    isLoading,
    isGenerating,
    questionData,
    handleInputChange,
    generateAlternatives,
    handleInsertQuestion,
    resetForm
  } = useInsertQuestion();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Inserir Questões
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inserir Nova Questão</DialogTitle>
          <DialogDescription>
            Preencha os campos obrigatórios (*) abaixo para inserir uma nova questão.
          </DialogDescription>
        </DialogHeader>

        <QuestionFormFields
          questionData={questionData}
          onInputChange={handleInputChange}
          isGenerating={isGenerating}
          onGenerateAlternatives={generateAlternatives}
        />

        <DialogFooter>
          <Button variant="outline" onClick={resetForm}>
            Cancelar
          </Button>
          <Button onClick={handleInsertQuestion} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Questão"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};