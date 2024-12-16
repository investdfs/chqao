import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { ExamModeProvider } from "@/features/questions/contexts/ExamModeContext";

interface PreviewDialogProps {
  question: {
    id: string;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    option_e: string;
    correct_answer: string;
    explanation: string;
    subject?: string;
    topic?: string;
    exam_year?: number;
    is_from_previous_exam?: boolean;
    image_url?: string;
    secondary_id?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewDialog = ({ question, open, onOpenChange }: PreviewDialogProps) => {
  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <ExamModeProvider>
          <QuestionCard
            question={{
              id: question.id,
              text: question.text,
              option_a: question.option_a,
              option_b: question.option_b,
              option_c: question.option_c,
              option_d: question.option_d,
              option_e: question.option_e,
              correct_answer: question.correct_answer,
              explanation: question.explanation,
              subject: question.subject,
              topic: question.topic,
              secondary_id: question.secondary_id
            }}
            onNextQuestion={() => {}}
            onPreviousQuestion={() => {}}
            questionNumber={1}
            totalQuestions={1}
            showQuestionId={true}
          />
        </ExamModeProvider>
      </DialogContent>
    </Dialog>
  );
};