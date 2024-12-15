import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionItem } from "./QuestionItem";
import { PreviewDialog } from "./PreviewDialog";

interface QuestionsListProps {
  questions: any[];
  onQuestionSelect: (question: any) => void;
  onQuestionsUpdate: () => void;
  onQuestionsSelect: (questionIds: string[]) => void;
  selectedQuestions: string[];
}

export const QuestionsList = ({ 
  questions, 
  onQuestionSelect,
  onQuestionsUpdate,
  onQuestionsSelect,
  selectedQuestions
}: QuestionsListProps) => {
  const { toast } = useToast();
  const [previewQuestion, setPreviewQuestion] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCheckboxChange = (questionId: string) => {
    const newSelectedQuestions = selectedQuestions.includes(questionId)
      ? selectedQuestions.filter(id => id !== questionId)
      : [...selectedQuestions, questionId];
    
    onQuestionsSelect(newSelectedQuestions);
  };

  const handleStatusChange = async (questionId: string, newStatus: 'hidden' | 'deleted') => {
    try {
      console.log(`Changing question ${questionId} status to ${newStatus}`);
      
      const { error } = await supabase
        .from('questions')
        .update({ status: newStatus })
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Questão ${newStatus === 'hidden' ? 'ocultada' : 'excluída'} com sucesso.`,
      });

      onQuestionsUpdate();
    } catch (error) {
      console.error('Error updating question status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da questão.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (question: any) => {
    setPreviewQuestion(question);
    setShowPreview(true);
  };

  return (
    <>
      <div className="border rounded-lg p-4 space-y-4">
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            isSelected={selectedQuestions.includes(question.id)}
            onSelect={handleCheckboxChange}
            onStatusChange={handleStatusChange}
            onEdit={onQuestionSelect}
            onPreview={handlePreview}
          />
        ))}
      </div>

      <PreviewDialog
        question={previewQuestion}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </>
  );
};