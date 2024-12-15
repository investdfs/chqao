import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SubjectTopicSelect } from "./form/SubjectTopicSelect";

export const JsonQuestionInput = () => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!subject || !topic) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione a matéria e o tópico antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!jsonInput.trim()) {
      toast({
        title: "JSON vazio",
        description: "Por favor, insira o JSON das questões.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Processando JSON de questões...");

    try {
      const questions = JSON.parse(jsonInput);
      const questionsWithMetadata = Array.isArray(questions) 
        ? questions.map(q => ({
            ...q,
            subject,
            topic,
            status: 'active'
          }))
        : [{
            ...questions,
            subject,
            topic,
            status: 'active'
          }];

      const { error } = await supabase
        .from('questions')
        .insert(questionsWithMetadata);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Questões inseridas com sucesso.",
      });
      
      setOpen(false);
      setJsonInput("");
      setSubject("");
      setTopic("");
    } catch (error) {
      console.error("Erro ao processar JSON:", error);
      toast({
        title: "Erro ao processar JSON",
        description: "Verifique se o formato do JSON está correto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90">
          Inserir Questões via JSON
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inserir Questões via JSON</DialogTitle>
          <DialogDescription>
            Cole o JSON das questões abaixo e selecione a matéria e o tópico correspondentes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <SubjectTopicSelect
            subject={subject}
            topic={topic}
            onSubjectChange={setSubject}
            onTopicChange={setTopic}
          />

          <div className="space-y-2">
            <Label htmlFor="json">JSON das Questões *</Label>
            <Textarea
              id="json"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Cole o JSON das questões aqui..."
              className="min-h-[200px] font-mono"
            />
          </div>
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
  );
};