import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditQuestionsDialog = ({ open, onOpenChange }: EditQuestionsDialogProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    subject: "",
    topic: "",
    searchTerm: ""
  });
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    console.log("Buscando questões para edição...");
    
    try {
      let query = supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.subject) {
        query = query.eq("subject", filters.subject);
      }
      if (filters.topic) {
        query = query.eq("topic", filters.topic);
      }
      if (filters.searchTerm) {
        query = query.ilike("text", `%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuestions(data || []);
      console.log("Questões carregadas:", data?.length);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro ao carregar questões",
        description: "Não foi possível carregar as questões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!selectedQuestion) return;

    console.log("Salvando alterações na questão:", selectedQuestion.id);
    
    try {
      const { error } = await supabase
        .from("questions")
        .update({
          text: selectedQuestion.text,
          subject: selectedQuestion.subject,
          topic: selectedQuestion.topic,
          option_a: selectedQuestion.option_a,
          option_b: selectedQuestion.option_b,
          option_c: selectedQuestion.option_c,
          option_d: selectedQuestion.option_d,
          option_e: selectedQuestion.option_e,
          correct_answer: selectedQuestion.correct_answer,
          explanation: selectedQuestion.explanation,
        })
        .eq("id", selectedQuestion.id);

      if (error) throw error;

      toast({
        title: "Questão atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
      
      fetchQuestions();
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Erro ao salvar questão:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;

    console.log("Deletando questão:", selectedQuestion.id);
    
    try {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", selectedQuestion.id);

      if (error) throw error;

      toast({
        title: "Questão removida",
        description: "A questão foi removida com sucesso.",
      });
      
      fetchQuestions();
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Erro ao deletar questão:", error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a questão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Questões</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Matéria</Label>
              <Select 
                value={filters.subject} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {/* Adicionar matérias dinamicamente */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tópico</Label>
              <Select 
                value={filters.topic} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, topic: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tópico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {/* Adicionar tópicos dinamicamente */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Pesquisar questões..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>
          </div>

          {/* Lista de Questões */}
          <div className="border rounded-lg p-4 space-y-4">
            {questions.map((question) => (
              <div 
                key={question.id} 
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedQuestion(question)}
              >
                <p className="font-medium">{question.text}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <span>{question.subject}</span>
                  {question.topic && <span> • {question.topic}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Formulário de Edição */}
          {selectedQuestion && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Label>Texto da Questão</Label>
                <Input
                  value={selectedQuestion.text}
                  onChange={(e) => setSelectedQuestion(prev => ({ ...prev, text: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matéria</Label>
                  <Input
                    value={selectedQuestion.subject}
                    onChange={(e) => setSelectedQuestion(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tópico</Label>
                  <Input
                    value={selectedQuestion.topic || ""}
                    onChange={(e) => setSelectedQuestion(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Opções</Label>
                {["a", "b", "c", "d", "e"].map((option) => (
                  <Input
                    key={option}
                    value={selectedQuestion[`option_${option}`]}
                    onChange={(e) => setSelectedQuestion(prev => ({ 
                      ...prev, 
                      [`option_${option}`]: e.target.value 
                    }))}
                    placeholder={`Opção ${option.toUpperCase()}`}
                    className="mb-2"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Resposta Correta</Label>
                  <Select 
                    value={selectedQuestion.correct_answer} 
                    onValueChange={(value) => setSelectedQuestion(prev => ({ ...prev, correct_answer: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a resposta correta" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D", "E"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Explicação</Label>
                  <Input
                    value={selectedQuestion.explanation || ""}
                    onChange={(e) => setSelectedQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedQuestion(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteQuestion}
                >
                  Excluir
                </Button>
                <Button
                  onClick={handleSaveQuestion}
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};