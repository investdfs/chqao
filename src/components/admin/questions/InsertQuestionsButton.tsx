import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionFormFields } from "./form/QuestionFormFields";

export const InsertQuestionsButton = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [questionData, setQuestionData] = useState({
    subject: "",
    topic: "",
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    option_e: "",
    correct_answer: "",
    explanation: ""
  });

  const handleInputChange = (field: string, value: string) => {
    console.log(`Atualizando campo ${field} com valor:`, value);
    setQuestionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateAlternatives = async () => {
    if (!questionData.text) {
      toast({
        title: "Erro",
        description: "Digite o texto da questão primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    console.log("Gerando alternativas para a questão:", questionData.text);

    try {
      const { data, error } = await supabase.functions.invoke('generate-alternatives', {
        body: { questionText: questionData.text }
      });

      if (error) throw error;

      console.log("Alternativas geradas:", data);
      
      if (data.alternatives) {
        setQuestionData(prev => ({
          ...prev,
          option_a: data.alternatives.a || prev.option_a,
          option_b: data.alternatives.b || prev.option_b,
          option_c: data.alternatives.c || prev.option_c,
          option_d: data.alternatives.d || prev.option_d,
          option_e: data.alternatives.e || prev.option_e,
        }));

        toast({
          title: "Sucesso",
          description: "Alternativas geradas com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar alternativas:", error);
      toast({
        title: "Erro ao gerar alternativas",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertQuestion = async () => {
    if (!questionData.subject || !questionData.topic || !questionData.text || !questionData.correct_answer) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios (matéria, tópico, texto da questão e resposta correta).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Inserindo questão:", questionData);

    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          ...questionData,
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Questão inserida com sucesso.",
      });
      
      setOpen(false);
      setQuestionData({
        subject: "",
        topic: "",
        text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        option_e: "",
        correct_answer: "",
        explanation: ""
      });
    } catch (error) {
      console.error("Erro ao inserir questão:", error);
      toast({
        title: "Erro ao inserir questão",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <Button variant="outline" onClick={() => setOpen(false)}>
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