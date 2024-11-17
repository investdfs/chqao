import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionHeader from "./question/QuestionHeader";
import QuestionMetadata from "./question/QuestionMetadata";
import QuestionOptions from "./question/QuestionOptions";

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
  const [isFocusMode, setIsFocusMode] = useState(false);

  if (isUserBlocked) {
    return (
      <Card className="animate-fade-in dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="space-y-6 text-center">
            <div className="text-lg font-medium text-red-600 dark:text-red-400">
              Usuário bloqueado
            </div>
            <p className="text-gray-600 dark:text-gray-300">
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
    <div className="space-y-6">
      <QuestionHeader
        isFocusMode={isFocusMode}
        onFocusModeToggle={() => setIsFocusMode(!isFocusMode)}
      />

      <Card className="animate-fade-in dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="space-y-6">
            {!isFocusMode && (
              <QuestionMetadata
                id={question.id}
                subject={question.subject}
                topic={question.topic}
                source={question.source}
              />
            )}

            <div className="text-base dark:text-gray-200">{question.text}</div>

            <QuestionOptions
              options={question.options}
              selectedAnswer={selectedAnswer}
              hasAnswered={hasAnswered}
              correctAnswer={question.correctAnswer}
              onAnswerSelect={setSelectedAnswer}
            />

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
                <div
                  className={`p-4 rounded-lg ${
                    selectedAnswer === question.correctAnswer
                      ? "bg-success-light border border-success dark:bg-green-900/30 dark:border-green-700"
                      : "bg-error-light border border-error dark:bg-red-900/30 dark:border-red-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {selectedAnswer === question.correctAnswer ? (
                      <>
                        <Check className="h-5 w-5 text-success dark:text-green-400" />
                        <span className="font-medium text-success dark:text-green-400">
                          Você acertou! 🎉
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-error dark:text-red-400" />
                        <span className="font-medium text-error dark:text-red-400">
                          Você errou! ⚠️
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm dark:text-gray-300">
                    Resposta correta: {question.correctAnswer}
                  </p>
                  <p className="text-sm mt-2 dark:text-gray-300">
                    {question.explanation}
                  </p>
                </div>

                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={onPreviousQuestion}
                    className="w-full"
                  >
                    Anterior
                  </Button>
                  <Button onClick={onNextQuestion} className="w-full">
                    Próxima
                  </Button>
                </div>

                {!isFocusMode && (
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAnswer("");
                        setHasAnswered(false);
                      }}
                    >
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
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;