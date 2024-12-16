import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { ExamModeProvider } from "@/features/questions/contexts/ExamModeContext";
import { Question } from "@/types/questions/common";

interface PreviewDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewDialog = ({ question, open, onOpenChange }: PreviewDialogProps) => {
  if (!question) return null;

  // Transform the question format to match what QuestionCard expects
  const formattedQuestion = {
    id: question.id,
    text: question.text,
    options: [
      { id: 'A', text: question.option_a },
      { id: 'B', text: question.option_b },
      { id: 'C', text: question.option_c },
      { id: 'D', text: question.option_d },
      { id: 'E', text: question.option_e },
    ],
    correctAnswer: question.correct_answer,
    explanation: question.explanation || '',
    subject: question.subject,
    topic: question.topic,
    secondaryId: question.secondary_id
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <ExamModeProvider>
          <QuestionCard
            question={formattedQuestion}
            onNextQuestion={() => {}}
            onPreviousQuestion={() => {}}
            questionNumber={1}
            totalQuestions={1}
            isUserBlocked={false}
          />
        </ExamModeProvider>
      </DialogContent>
    </Dialog>
  );
};