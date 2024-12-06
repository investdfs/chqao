import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionStatsDialog } from "./QuestionStatsDialog";
import { SessionStatsDialog } from "../stats/SessionStatsDialog";

interface QuestionFeedbackProps {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  onReset: () => void;
  questionId: string;
  sessionStats: {
    correctAnswers: number;
    totalAnswers: number;
    answerDistribution: Record<string, number>;
  };
}

const QuestionFeedback = ({
  isCorrect,
  selectedAnswer,
  correctAnswer,
  explanation,
  onReset,
  questionId,
  sessionStats,
}: QuestionFeedbackProps) => {
  const [showQuestionStats, setShowQuestionStats] = useState(false);
  const [showSessionStats, setShowSessionStats] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className={`p-4 rounded-lg ${
          isCorrect
            ? "bg-success-light border border-success dark:bg-blue-900/30 dark:border-blue-700"
            : "bg-error-light border border-error dark:bg-red-900/30 dark:border-red-700"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isCorrect ? (
            <>
              <Check className="h-5 w-5 text-success dark:text-blue-400" />
              <span className="font-medium text-success dark:text-blue-400">
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
          Resposta correta: {correctAnswer}
        </p>
        <p className="text-sm mt-2 dark:text-gray-300">{explanation}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <Button variant="outline" size="sm" onClick={onReset}>
          Refazer
        </Button>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setShowQuestionStats(true)}>
            Estatísticas da Questão
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSessionStats(true)}>
            Estatísticas da Sessão
          </Button>
        </div>
      </div>

      <QuestionStatsDialog
        open={showQuestionStats}
        onOpenChange={setShowQuestionStats}
        questionId={questionId}
        correctAnswer={correctAnswer}
      />

      <SessionStatsDialog
        open={showSessionStats}
        onOpenChange={setShowSessionStats}
        sessionStats={sessionStats}
      />
    </div>
  );
};

export default QuestionFeedback;