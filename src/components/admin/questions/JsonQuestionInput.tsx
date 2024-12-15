import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const JsonQuestionInput = () => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      console.log("Processando entrada JSON:", jsonInput);

      // Parse JSON input - agora esperando um array
      const questionsData = JSON.parse(jsonInput);
      const questions = Array.isArray(questionsData) ? questionsData : [questionsData];

      console.log(`Processando ${questions.length} questões...`);

      // Validar cada questão
      const requiredFields = ['text', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer'];
      
      questions.forEach((question, index) => {
        const missingFields = requiredFields.filter(field => !question[field]);
        if (missingFields.length > 0) {
          throw new Error(`Questão ${index + 1}: Campos obrigatórios faltando: ${missingFields.join(', ')}`);
        }
      });

      console.log("Questões validadas, inserindo no banco...");

      // Inserir todas as questões
      const { error } = await supabase
        .from('questions')
        .insert(questions.map(q => ({
          ...q,
          status: 'active'
        })));

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${questions.length} questões foram inseridas com sucesso.`,
      });

      setOpen(false);
      setJsonInput("");
    } catch (error) {
      console.error("Erro ao processar questões:", error);
      toast({
        title: "Erro ao inserir questões",
        description: error.message || "Verifique o formato JSON e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="default" 
        size="lg"
        className="w-full bg-primary hover:bg-primary/90"
        onClick={() => setOpen(true)}
      >
        Inserir Questões via JSON
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Inserir Questões via JSON</DialogTitle>
            <DialogDescription>
              Cole o JSON das questões em formato de array. Cada questão deve conter os campos obrigatórios (*) conforme exemplo abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`[
  {
    "text": "Texto da questão", // * obrigatório
    "option_a": "Alternativa A", // * obrigatório
    "option_b": "Alternativa B", // * obrigatório
    "option_c": "Alternativa C", // * obrigatório
    "option_d": "Alternativa D", // * obrigatório
    "option_e": "Alternativa E", // * obrigatório
    "correct_answer": "A", // * obrigatório (A, B, C, D ou E)

    // Campos opcionais abaixo
    "explanation": "Explicação da resposta",
    "difficulty": "Fácil",
    "theme": "Tema da questão",
    "subject": "Matéria",
    "topic": "Tópico específico",
    "subject_matter": "Conteúdo específico"
  },
  {
    // Segunda questão...
  }
]`}
              className="min-h-[300px] font-mono"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Inserir Questões"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};