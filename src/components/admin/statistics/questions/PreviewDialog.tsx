import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { ExamModeProvider } from "@/features/questions/contexts/ExamModeContext";

interface PreviewDialogProps {
  question: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewDialog = ({ question, open, onOpenChange }: PreviewDialogProps) => {
  if (!question) return null;

  const formattedQuestion = {
    id: question.id,
    text: question.text,
    options: [
      { id: "A", text: question.option_a },
      { id: "B", text: question.option_b },
      { id: "C", text: question.option_c },
      { id: "D", text: question.option_d },
      { id: "E", text: question.option_e },
    ],
    correctAnswer: question.correct_answer,
    explanation: question.explanation,
    subject: question.subject,
    topic: question.topic,
    source: question.exam_year ? `Concurso ${question.exam_year}` : undefined,
    image_url: question.image_url
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
            showQuestionId={true}
          />
        </ExamModeProvider>
      </DialogContent>
    </Dialog>
  );
};