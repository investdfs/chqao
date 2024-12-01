import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { insertEraVargasQuestions } from "@/utils/insertQuestions";

export const InsertQuestionsButton = () => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState("");
  const { toast } = useToast();

  const handleInsertQuestions = async () => {
    try {
      // Por enquanto, mantemos a função original
      const result = await insertEraVargasQuestions();
      toast({
        title: "Sucesso!",
        description: `${result.count} questões foram inseridas com sucesso.`,
      });
      setOpen(false);
      setQuestions("");
    } catch (error) {
      toast({
        title: "Erro ao inserir questões",
        description: "Ocorreu um erro ao tentar inserir as questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Inserir Questões
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Inserir Questões</DialogTitle>
            <DialogDescription>
              Cole aqui o texto das questões que deseja inserir. Cada questão deve seguir o formato padrão com os campos necessários.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Textarea
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Cole aqui suas questões..."
              className="min-h-[300px]"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInsertQuestions}>
              Inserir Questões
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};