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
import { PreviewDialog } from "../statistics/questions/PreviewDialog";
import { ExamQuestionItem } from "./questions/ExamQuestionItem";
import { ExamFilters } from "./questions/ExamFilters";

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
  const { toast } = useToast();

  const years = [...new Set(previousExamQuestions.map(q => q.exam_year))].sort((a, b) => b - a);
  const subjects = [...new Set(previousExamQuestions.map(q => q.subject))].sort();

  useEffect(() => {
    if (open) {
      const fetchPreviousExamQuestions = async () => {
        try {
          console.log("Buscando questões de provas anteriores...");
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('is_from_previous_exam', true)
            .order('exam_year', { ascending: false });

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
        }
      };

      fetchPreviousExamQuestions();
    }
  }, [open, toast]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPreviousExamQuestions(prev => prev.filter(q => q.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const handleHideQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ status: 'hidden' })
        .eq('id', id);

      if (error) throw error;

      setPreviousExamQuestions(prev => 
        prev.map(q => q.id === id ? { ...q, status: 'hidden' } : q)
      );
    } catch (error) {
      throw error;
    }
  };

  const handleShowQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ status: 'active' })
        .eq('id', id);

      if (error) throw error;

      setPreviousExamQuestions(prev => 
        prev.map(q => q.id === id ? { ...q, status: 'active' } : q)
      );
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (question: any) => {
    console.log("Editar questão:", question);
    toast({
      title: "Em breve",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handlePreview = (question: any) => {
    setSelectedQuestion(question);
    setIsPreviewOpen(true);
  };

  const filteredQuestions = previousExamQuestions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "all" || question.exam_year.toString() === selectedYear;
    const matchesSubject = selectedSubject === "all" || question.subject === selectedSubject;
    return matchesSearch && matchesYear && matchesSubject;
  });

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[80vh] w-full sm:max-w-[80vw] mx-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold text-primary">
              Questões de Provas Anteriores
            </SheetTitle>
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

          <ScrollArea className="h-[calc(100%-140px)] rounded-md border p-4">
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <ExamQuestionItem
                  key={question.id}
                  question={question}
                  onDelete={handleDelete}
                  onHide={handleHideQuestion}
                  onShow={handleShowQuestion}
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          </ScrollArea>
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