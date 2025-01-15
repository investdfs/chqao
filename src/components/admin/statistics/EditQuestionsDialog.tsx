import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionFilters } from "./questions/QuestionFilters";
import { QuestionsList } from "./questions/QuestionsList";
import { QuestionEditForm } from "./questions/QuestionEditForm";
import { QuestionsCounter } from "./questions/QuestionsCounter";
import { BulkActionButtons } from "./questions/BulkActionButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface EditQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditQuestionsDialog = ({ open, onOpenChange }: EditQuestionsDialogProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    subject: "all",
    topic: "all",
    searchTerm: ""
  });
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    console.log("Buscando questões com filtros:", filters);
    
    try {
      let query = supabase
        .from("questions")
        .select("*")
        .eq('status', 'active')
        .order("created_at", { ascending: false });

      if (filters.subject !== "all") {
        console.log("Filtrando por matéria:", filters.subject);
        query = query.eq("subject", filters.subject);
      }
      if (filters.topic !== "all") {
        console.log("Filtrando por tópico:", filters.topic);
        query = query.eq("topic", filters.topic);
      }
      if (filters.searchTerm) {
        console.log("Filtrando por termo:", filters.searchTerm);
        query = query.ilike("text", `%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      console.log("Questões encontradas:", data?.length);
      setQuestions(data || []);
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

  useEffect(() => {
    if (open) {
      fetchQuestions();
    }
  }, [filters, open]);

  const handleFilterChange = (field: string, value: string) => {
    console.log("Mudando filtro:", field, "para", value);
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field: string, value: string) => {
    setSelectedQuestion(prev => ({
      ...prev,
      [field]: value
    }));
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

    console.log("Excluindo questão:", selectedQuestion.id);
    
    try {
      const { error } = await supabase
        .from("questions")
        .update({ status: 'deleted' })
        .eq("id", selectedQuestion.id);

      if (error) throw error;

      toast({
        title: "Questão excluída",
        description: "A questão foi excluída com sucesso.",
      });
      
      fetchQuestions();
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Erro ao excluir questão:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a questão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuestions(questions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedQuestions.length) return;

    try {
      const { error } = await supabase
        .from("questions")
        .update({ status: 'deleted' })
        .in('id', selectedQuestions);

      if (error) throw error;

      toast({
        title: "Questões excluídas",
        description: `${selectedQuestions.length} questões foram excluídas com sucesso.`,
      });
      
      setSelectedQuestions([]);
      fetchQuestions();
    } catch (error) {
      console.error("Erro ao excluir questões:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir as questões selecionadas.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Questões</DialogTitle>
          <QuestionsCounter 
            selectedCount={selectedQuestions.length}
            totalCount={questions.length}
          />
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={selectedQuestions.length === questions.length}
                onCheckedChange={handleSelectAll}
                id="select-all"
              />
              <label 
                htmlFor="select-all" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Selecionar todas
              </label>
            </div>
            {selectedQuestions.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Deletar selecionadas ({selectedQuestions.length})
              </Button>
            )}
          </div>

          <QuestionFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <div className="text-center py-4">Carregando questões...</div>
          ) : (
            <QuestionsList
              questions={questions}
              onQuestionSelect={setSelectedQuestion}
              onQuestionsUpdate={fetchQuestions}
              onQuestionsSelect={setSelectedQuestions}
              selectedQuestions={selectedQuestions}
            />
          )}

          {selectedQuestion && (
            <QuestionEditForm
              selectedQuestion={selectedQuestion}
              onQuestionChange={handleQuestionChange}
              onSave={handleSaveQuestion}
              onDelete={handleDeleteQuestion}
              onCancel={() => setSelectedQuestion(null)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
