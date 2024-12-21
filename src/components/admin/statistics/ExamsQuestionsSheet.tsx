import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ExamQuestionItem } from "./questions/ExamQuestionItem";
import { ExamFilters } from "./questions/ExamFilters";
import { BulkActionButtons } from "./questions/BulkActionButtons";
import { PreviewDialog } from "./questions/PreviewDialog";
import { EditQuestionsDialog } from "./EditQuestionsDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExamsQuestionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExamsQuestionsSheet = ({
  open,
  onOpenChange,
}: ExamsQuestionsSheetProps) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<any | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const { toast } = useToast();

  const handleYearSelect = async (year: string | null) => {
    console.log('Buscando questões do ano:', year);
    setSelectedYear(year);
    
    if (!year) {
      setQuestions([]);
      return;
    }

    try {
      // First get the exam IDs for the selected year
      const { data: exams, error: examsError } = await supabase
        .from('previous_exams')
        .select('id')
        .eq('year', parseInt(year));

      if (examsError) throw examsError;

      if (!exams || exams.length === 0) {
        console.log(`Nenhuma prova encontrada para o ano ${year}`);
        setQuestions([]);
        return;
      }

      const examIds = exams.map(exam => exam.id);
      console.log(`Encontradas ${examIds.length} provas para o ano ${year}`);

      // Then get all questions for these exams
      const { data, error } = await supabase
        .from('previous_exam_questions')
        .select(`
          *,
          previous_exams (
            year,
            name
          )
        `)
        .in('exam_id', examIds);

      if (error) throw error;

      console.log(`${data?.length || 0} questões encontradas para o ano ${year}`);
      setQuestions(data || []);
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as questões.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('previous_exam_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuestions(questions.filter(q => q.id !== id));
      setSelectedQuestions(selectedQuestions.filter(q => q.id !== id));
    } catch (error) {
      console.error('Erro ao excluir questão:', error);
      throw error;
    }
  };

  const handleQuestionSelect = (question: any, selected: boolean) => {
    setSelectedQuestions(prev => {
      if (selected) {
        return [...prev, question];
      }
      return prev.filter(q => q.id !== question.id);
    });
  };

  const handleBulkDelete = async () => {
    try {
      const ids = selectedQuestions.map(q => q.id);
      const { error } = await supabase
        .from('previous_exam_questions')
        .delete()
        .in('id', ids);

      if (error) throw error;

      setQuestions(prev => prev.filter(q => !ids.includes(q.id)));
      setSelectedQuestions([]);
      
      toast({
        title: "Sucesso",
        description: "Questões excluídas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir questões:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir questões.",
        variant: "destructive"
      });
    }
  };

  const handleQuestionUpdate = (updatedQuestion: any) => {
    setQuestions(prev => 
      prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
    setEditingQuestion(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Questões de Provas Anteriores</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <ExamFilters
            selectedYear={selectedYear}
            onYearSelect={handleYearSelect}
          />

          {selectedQuestions.length > 0 && (
            <BulkActionButtons
              selectedQuestions={selectedQuestions}
              onSuccess={() => {
                setSelectedQuestions([]);
                handleBulkDelete();
              }}
            />
          )}

          <div className="space-y-4">
            {questions.map(question => (
              <ExamQuestionItem
                key={question.id}
                question={question}
                onDelete={handleDelete}
                onEdit={() => setEditingQuestion(question)}
                onPreview={() => setPreviewQuestion(question)}
                onSelect={(selected) => handleQuestionSelect(question, selected)}
                isSelected={selectedQuestions.some(q => q.id === question.id)}
              />
            ))}
          </div>
        </div>

        {previewQuestion && (
          <PreviewDialog
            question={previewQuestion}
            open={!!previewQuestion}
            onOpenChange={() => setPreviewQuestion(null)}
          />
        )}

        {editingQuestion && (
          <EditQuestionsDialog
            open={!!editingQuestion}
            onOpenChange={(open) => {
              if (!open) setEditingQuestion(null);
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};