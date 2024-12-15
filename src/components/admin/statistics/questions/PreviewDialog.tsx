import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuestionCard from "@/features/questions/components/QuestionCard";

interface PreviewDialogProps {
  question: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewDialog = ({ question, open, onOpenChange }: PreviewDialogProps) => {
  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
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
            exam_year: question.exam_year,
            is_from_previous_exam: question.is_from_previous_exam,
          }}
          onNextQuestion={() => {}}
          onPreviousQuestion={() => {}}
          questionNumber={1}
          totalQuestions={1}
          showQuestionId={true}
        />
      </DialogContent>
    </Dialog>
  );
};