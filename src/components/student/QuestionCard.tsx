import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: {
    id: number;
    text: string;
    options: QuestionOption[];
    correctAnswer: string;
    explanation: string;
  };
  selectedAnswer: string;
  hasAnswered: boolean;
  onAnswerSelect: (value: string) => void;
  isUserBlocked?: boolean;
}

const QuestionCard = ({
  question,
  selectedAnswer,
  hasAnswered,
  onAnswerSelect,
  isUserBlocked = false,
}: QuestionCardProps) => {
  if (isUserBlocked) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="space-y-6 text-center">
            <div className="text-lg font-medium text-red-600">
              Usuário bloqueado
            </div>
            <p className="text-gray-600">
              Entre em contato com o administrador para mais informações
            </p>
            <Button
              className="w-full"
              onClick={() => window.open("https://wa.me/5532988847713", "_blank")}
            >
              Contatar Administrador
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-lg font-medium">{question.text}</div>
          
          <RadioGroup
            value={selectedAnswer}
            onValueChange={onAnswerSelect}
            disabled={hasAnswered}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  hasAnswered
                    ? option.id === question.correctAnswer
                      ? "border-success bg-success-light"
                      : option.id === selectedAnswer
                      ? "border-error bg-error-light"
                      : "border-gray-200"
                    : "border-gray-200 hover:border-primary hover:bg-primary-light"
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer"
                >
                  {option.text}
                </label>
                {hasAnswered && option.id === question.correctAnswer && (
                  <Check className="h-5 w-5 text-success" />
                )}
                {hasAnswered &&
                  option.id === selectedAnswer &&
                  option.id !== question.correctAnswer && (
                    <X className="h-5 w-5 text-error" />
                  )}
              </div>
            ))}
          </RadioGroup>

          {hasAnswered && (
            <div className={`p-4 rounded-lg ${
              selectedAnswer === question.correctAnswer 
                ? "bg-success-light border border-success" 
                : "bg-error-light border border-error"
            }`}>
              <p className="text-sm">{question.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
