import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionFeedbackProps {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  onReset: () => void;
  questionId: string;
}

const QuestionFeedback = ({
  isCorrect,
  selectedAnswer,
  correctAnswer,
  explanation,
  onReset,
  questionId
}: QuestionFeedbackProps) => {
  return (
    <div className="space-y-4 mt-6">
      <Alert variant={isCorrect ? "default" : "destructive"}>
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
          </AlertTitle>
        </div>
        <AlertDescription className="mt-2">
          {isCorrect ? (
            "Parabéns! Você acertou esta questão."
          ) : (
            `A resposta correta era: ${correctAnswer}`
          )}
        </AlertDescription>
      </Alert>

      {explanation && (
        <Alert>
          <AlertTitle>Explicação</AlertTitle>
          <AlertDescription className="mt-2">
            {explanation}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onReset}>
          Próxima Questão
        </Button>
      </div>
    </div>
  );
};

export default QuestionFeedback;