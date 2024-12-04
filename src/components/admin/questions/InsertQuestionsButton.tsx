import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { insertEraVargasQuestions } from "@/utils/insertQuestions";
import { insertHistoriaQuestions } from "@/utils/questions/historiaQuestions";

export const InsertQuestionsButton = () => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState("");
  const { toast } = useToast();

  const handleInsertQuestions = async () => {
    try {
      // Inserir questões da Era Vargas
      const resultVargas = await insertEraVargasQuestions();
      
      // Inserir questões de História
      const resultHistoria = await insertHistoriaQuestions();
      
      toast({
        title: "Sucesso!",
        description: `${resultVargas.count + resultHistoria.count} questões foram inseridas com sucesso.`,
      });
      
      setOpen(false);
      setQuestions("");
    } catch (error) {
      console.error("Erro ao inserir questões:", error);
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
              Clique em inserir para adicionar as questões ao banco de dados.
            </DialogDescription>
          </DialogHeader>

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