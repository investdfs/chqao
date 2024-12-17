import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PreviewDialog } from "./questions/PreviewDialog";
import { ExamQuestionItem } from "./questions/ExamQuestionItem";
import { ExamFilters } from "./questions/ExamFilters";
import { QuestionEditForm } from "./questions/QuestionEditForm";
import { QuestionsCounter } from "./questions/QuestionsCounter";
import { BulkActionButtons } from "./questions/BulkActionButtons";

interface ExamsQuestionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExamsQuestionsSheet = ({ 
  open, 
  onOpenChange 
}: ExamsQuestionsSheetProps) => {
  const [previousExamQuestions, setPreviousExamQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const years = [...new Set(previousExamQuestions.map(q => q.exam_year))].sort((a, b) => b - a);
  const subjects = [...new Set(previousExamQuestions.map(q => q.subject))].sort();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      console.log("Buscando questões de provas anteriores...");
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_from_previous_exam', true)
        .order('exam_year', { ascending: false });

      if (selectedYear !== "all") {
        query = query.eq('exam_year', selectedYear);
      }
      if (selectedSubject !== "all") {
        query = query.eq('subject', selectedSubject);
      }
      if (searchTerm) {
        query = query.ilike('text', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log("Questões encontradas:", data?.length);
      setPreviousExamQuestions(data || []);
    } catch (error) {
      console.error('Error fetching previous exam questions:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar questões. Tente novamente.",
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
  }, [open, selectedYear, selectedSubject, searchTerm]);

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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) throw error;

      setPreviousExamQuestions(prev => prev.filter(q => q.id !== id));
      toast({
        title: "Questão excluída",
        description: "A questão foi excluída com sucesso.",
      });
    } catch (error) {
      throw error;
    }
  };

  const handleQuestionsSelect = (questionIds: string[]) => {
    setSelectedQuestions(questionIds);
  };

  const handleBulkActionSuccess = () => {
    setSelectedQuestions([]);
    fetchQuestions();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[80vh] w-full sm:max-w-[80vw] mx-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold text-primary">
              Questões de Provas Anteriores
            </SheetTitle>
            <QuestionsCounter 
              selectedCount={selectedQuestions.length}
              totalCount={previousExamQuestions.length}
            />
          </SheetHeader>

          <ExamFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            years={years}
            subjects={subjects}
          />

          <BulkActionButtons 
            selectedQuestions={selectedQuestions}
            onSuccess={handleBulkActionSuccess}
          />

          <ScrollArea className="h-[calc(100%-140px)] rounded-md border p-4">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Carregando questões...</div>
              ) : (
                previousExamQuestions.map((question) => (
                  <ExamQuestionItem
                    key={question.id}
                    question={question}
                    onDelete={handleDelete}
                    onEdit={() => setSelectedQuestion(question)}
                    onPreview={() => {
                      setSelectedQuestion(question);
                      setIsPreviewOpen(true);
                    }}
                    onSelect={(selected) => {
                      if (selected) {
                        setSelectedQuestions(prev => [...prev, question.id]);
                      } else {
                        setSelectedQuestions(prev => prev.filter(id => id !== question.id));
                      }
                    }}
                    isSelected={selectedQuestions.includes(question.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {selectedQuestion && !isPreviewOpen && (
            <QuestionEditForm
              selectedQuestion={selectedQuestion}
              onQuestionChange={handleQuestionChange}
              onSave={handleSaveQuestion}
              onDelete={() => handleDelete(selectedQuestion.id)}
              onCancel={() => setSelectedQuestion(null)}
            />
          )}
        </SheetContent>
      </Sheet>

      <PreviewDialog
        question={selectedQuestion}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
};