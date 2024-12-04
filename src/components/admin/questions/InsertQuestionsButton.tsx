import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Inserir Questões
        </Button>
      </DialogTrigger>

      <DialogContent>
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
            Inserir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};