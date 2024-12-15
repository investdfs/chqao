import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const JsonQuestionInput = () => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const { toast } = useToast();

  const { data: subjects } = useQuery({
    queryKey: ['subject-structure-subjects'],
    queryFn: async () => {
      console.log('Buscando matérias do banco...');
      const { data, error } = await supabase
        .from('subject_structure')
        .select('name')
        .eq('level', 1)
        .order('name');

      if (error) throw error;
      return data.map(item => item.name);
    }
  });

  const { data: topics } = useQuery({
    queryKey: ['subject-structure-topics', subject],
    queryFn: async () => {
      if (!subject) return [];

      console.log('Buscando tópicos do banco...');
      const parentNode = await supabase
        .from('subject_structure')
        .select('id')
        .eq('name', subject)
        .single();

      if (!parentNode.data) return [];

      const { data, error } = await supabase
        .from('subject_structure')
        .select('name')
        .eq('parent_id', parentNode.data.id)
        .order('name');

      if (error) throw error;
      return data.map(item => item.name);
    },
    enabled: !!subject
  });

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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Matéria *</Label>
              <Select
                value={subject}
                onValueChange={setSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Tópico *</Label>
              <div className="flex gap-2">
                <Select
                  value={topics?.includes(topic) ? topic : ""}
                  onValueChange={setTopic}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione o tópico" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics?.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Ou digite um novo tópico"
                  value={!topics?.includes(topic) ? topic : ""}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

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