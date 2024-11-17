import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    source?: string;
    subject?: string;
    topic?: string;
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  isUserBlocked?: boolean;
}

const QuestionCard = ({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  isUserBlocked = false,
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);

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

  const handleAnswer = () => {
    if (selectedAnswer) {
      setHasAnswered(true);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">
                Q.{question.id}
              </span>
              {question.subject && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{question.subject}</span>
                </>
              )}
              {question.topic && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{question.topic}</span>
                </>
              )}
            </div>
            {question.source && (
              <span className="text-xs text-gray-500">{question.source}</span>
            )}
          </div>

          <div className="text-base">{question.text}</div>
          
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={hasAnswered}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors ${
                  !hasAnswered
                    ? "hover:border-primary hover:bg-primary-light border-gray-200"
                    : option.id === question.correctAnswer
                    ? "border-success bg-success-light"
                    : option.id === selectedAnswer
                    ? "border-error bg-error-light"
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer text-sm"
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

          {!hasAnswered && (
            <Button 
              className="w-full"
              onClick={handleAnswer}
              disabled={!selectedAnswer}
            >
              Responder
            </Button>
          )}

          {hasAnswered && (
            <>
              <div className={`p-4 rounded-lg ${
                selectedAnswer === question.correctAnswer 
                  ? "bg-success-light border border-success" 
                  : "bg-error-light border border-error"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === question.correctAnswer ? (
                    <>
                      <Check className="h-5 w-5 text-success" />
                      <span className="font-medium text-success">Você acertou! 🎉</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 text-error" />
                      <span className="font-medium text-error">Você errou! ⚠️</span>
                    </>
                  )}
                </div>
                <p className="text-sm">
                  Resposta correta: {question.correctAnswer}
                </p>
                <p className="text-sm mt-2">{question.explanation}</p>
              </div>

              <div className="flex justify-between gap-4">
                <Button 
                  variant="outline" 
                  onClick={onPreviousQuestion}
                  className="w-full"
                >
                  Anterior
                </Button>
                <Button 
                  onClick={onNextQuestion}
                  className="w-full"
                >
                  Próxima
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedAnswer("");
                  setHasAnswered(false);
                }}>
                  Refazer
                </Button>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    Gabarito comentado
                  </Button>
                  <Button variant="outline" size="sm">
                    Estatísticas
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;