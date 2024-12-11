import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    // Validação básica
    if (!questionData.subject || !questionData.text || !questionData.correct_answer) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
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
            Preencha os campos abaixo para inserir uma nova questão. Use o botão de sugestões para gerar alternativas automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Matéria</Label>
              <Input
                id="subject"
                value={questionData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Ex: História do Brasil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Tópico (opcional)</Label>
              <Input
                id="topic"
                value={questionData.topic}
                onChange={(e) => handleInputChange("topic", e.target.value)}
                placeholder="Ex: Era Vargas"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Texto da Questão</Label>
            <div className="flex gap-2">
              <Textarea
                id="text"
                value={questionData.text}
                onChange={(e) => handleInputChange("text", e.target.value)}
                placeholder="Digite o texto da questão aqui..."
                className="min-h-[100px]"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={generateAlternatives}
                disabled={isGenerating || !questionData.text}
                className="h-10 w-10 shrink-0"
                title="Gerar sugestões de alternativas"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Alternativas</Label>
            {['a', 'b', 'c', 'd', 'e'].map((option) => (
              <div key={option} className="flex gap-2 items-center">
                <span className="w-6 text-center font-medium">{option.toUpperCase()}</span>
                <Input
                  value={questionData[`option_${option}` as keyof typeof questionData]}
                  onChange={(e) => handleInputChange(`option_${option}`, e.target.value)}
                  placeholder={`Digite a alternativa ${option.toUpperCase()}`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="correct_answer">Resposta Correta</Label>
            <Select
              value={questionData.correct_answer}
              onValueChange={(value) => handleInputChange("correct_answer", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a alternativa correta" />
              </SelectTrigger>
              <SelectContent>
                {['A', 'B', 'C', 'D', 'E'].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explicação (opcional)</Label>
            <Textarea
              id="explanation"
              value={questionData.explanation}
              onChange={(e) => handleInputChange("explanation", e.target.value)}
              placeholder="Digite a explicação da resposta correta..."
              className="min-h-[100px]"
            />
          </div>
        </div>

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