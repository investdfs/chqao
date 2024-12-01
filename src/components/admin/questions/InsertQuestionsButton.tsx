import { Button } from "@/components/ui/button";
import { insertEraVargasQuestions } from "@/utils/insertQuestions";
import { useToast } from "@/components/ui/use-toast";

export const InsertQuestionsButton = () => {
  const { toast } = useToast();

  const handleInsertQuestions = async () => {
    try {
      const result = await insertEraVargasQuestions();
      toast({
        title: "Sucesso!",
        description: `${result.count} questões foram inseridas com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao inserir questões",
        description: "Ocorreu um erro ao tentar inserir as questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleInsertQuestions}>
      Inserir Questões da Era Vargas
    </Button>
  );
};