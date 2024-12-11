import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionFilters } from "./questions/QuestionFilters";
import { QuestionsList } from "./questions/QuestionsList";
import { QuestionEditForm } from "./questions/QuestionEditForm";

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
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    console.log("Buscando questões com filtros:", filters);
    
    try {
      let query = supabase
        .from("questions")
        .select("*")
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

  // Fetch questions when filters change
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