import { memo, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import QuestionMetadata from "@/features/questions/components/question/QuestionMetadata";
import QuestionOptions from "@/features/questions/components/question/QuestionOptions";
import NavigationButtons from "@/features/questions/components/question/NavigationButtons";
import QuestionFeedback from "@/features/questions/components/question/QuestionFeedback";
import { SessionStatsDialog } from "@/features/questions/components/stats/SessionStatsDialog";

interface SessionStats {
  correctAnswers: number;
  totalAnswers: number;
  answerDistribution: Record<string, number>;
}

interface QuestionContentProps {
  question: {
    id: string;
    text: string;
    subject?: string;
    topic?: string;
    source?: string;
    options: Array<{ id: string; text: string }>;
    correctAnswer: string;
    explanation: string;
  };
  selectedAnswer: string;
  setSelectedAnswer: (value: string) => void;
  hasAnswered: boolean;
  handleAnswer: () => void;
  handleReset: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  sessionStats?: SessionStats;
}

const QuestionContent = memo(({
  question,
  selectedAnswer,
  setSelectedAnswer,
  hasAnswered,
  handleAnswer,
  handleReset,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  sessionStats,
}: QuestionContentProps) => {
  console.log("Renderizando QuestionContent para questão:", question.id);
  const [showStats, setShowStats] = useState(false);

  return (
    <Card className="animate-fade-in dark:bg-gray-800">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          <QuestionMetadata
            id={question.id}
            subject={question.subject}
            topic={question.topic}
            source={question.source}
          />

          <div className="text-base dark:text-gray-200 text-left">
            {question.text}
          </div>

          <QuestionOptions
            options={question.options}
            selectedAnswer={selectedAnswer}
            hasAnswered={hasAnswered}
            correctAnswer={question.correctAnswer}
            onAnswerSelect={setSelectedAnswer}
            questionId={question.id}
          />

          <NavigationButtons
            onPrevious={onPreviousQuestion}
            onNext={onNextQuestion}
            onAnswer={handleAnswer}
            onShowStats={() => setShowStats(true)}
            canAnswer={!!selectedAnswer}
            hasAnswered={hasAnswered}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
          />

          {hasAnswered && (
            <QuestionFeedback
              isCorrect={selectedAnswer === question.correctAnswer}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.correctAnswer}
              explanation={question.explanation}
              onReset={handleReset}
              questionId={question.id}
              sessionStats={sessionStats}
            />
          )}
        </div>
      </CardContent>

      {sessionStats && (
        <SessionStatsDialog
          open={showStats}
          onOpenChange={setShowStats}
          sessionStats={sessionStats}
        />
      )}
    </Card>
  );
});

QuestionContent.displayName = 'QuestionContent';

export default QuestionContent;