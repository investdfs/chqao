import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, EyeOff, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuestionCard from "@/features/questions/components/QuestionCard";

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
          <div 
            key={question.id} 
            className={`p-4 border rounded-lg transition-colors ${
              question.status === 'hidden' ? 'bg-red-50 border-red-200' : 
              question.status === 'deleted' ? 'bg-gray-100 border-gray-200' : 
              'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                checked={selectedQuestions.includes(question.id)}
                onCheckedChange={() => handleCheckboxChange(question.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium">{question.text}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <span>{question.subject}</span>
                  {question.topic && <span> • {question.topic}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreview(question)}
                  title="Visualizar questão"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onQuestionSelect(question)}
                  title="Editar questão"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStatusChange(question.id, 'deleted')}
                  title="Excluir questão"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStatusChange(question.id, 'hidden')}
                  title="Ocultar questão"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
          {previewQuestion && (
            <QuestionCard
              question={{
                id: previewQuestion.id,
                text: previewQuestion.text,
                option_a: previewQuestion.option_a,
                option_b: previewQuestion.option_b,
                option_c: previewQuestion.option_c,
                option_d: previewQuestion.option_d,
                option_e: previewQuestion.option_e,
                correct_answer: previewQuestion.correct_answer,
                explanation: previewQuestion.explanation,
                subject: previewQuestion.subject,
                topic: previewQuestion.topic,
                exam_year: previewQuestion.exam_year,
                is_from_previous_exam: previewQuestion.is_from_previous_exam,
              }}
              onNextQuestion={() => {}}
              onPreviousQuestion={() => {}}
              questionNumber={1}
              totalQuestions={1}
              showQuestionId={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};