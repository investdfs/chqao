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

      // Parse JSON input
      const questionData = JSON.parse(jsonInput);

      // Validate required fields
      const requiredFields = ['text', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer'];
      const missingFields = requiredFields.filter(field => !questionData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      }

      console.log("Dados da questão validados:", questionData);

      // Insert into database
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
      setJsonInput("");
    } catch (error) {
      console.error("Erro ao processar questão:", error);
      toast({
        title: "Erro ao inserir questão",
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
        Inserir Questão via JSON
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Inserir Questão via JSON</DialogTitle>
            <DialogDescription>
              Cole o JSON da questão no formato especificado abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{
  "text": "Texto da questão",
  "option_a": "Alternativa A",
  "option_b": "Alternativa B",
  "option_c": "Alternativa C",
  "option_d": "Alternativa D",
  "option_e": "Alternativa E",
  "correct_answer": "A",
  "explanation": "Explicação da resposta",
  "difficulty": "Fácil",
  "theme": "Tema",
  "subject": "Matéria",
  "topic": "Tópico"
}`}
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
                "Inserir Questão"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};